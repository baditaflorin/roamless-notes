import { openDB } from 'idb'
import * as Y from 'yjs'
import { z } from 'zod'
import { createId } from '../../lib/ids'
import type { BlockId, BlockRecord } from '../../types'
import { createSeedBlocks } from './seed'
import { buildTree } from './tree'

const DB_NAME = 'roamless-notes'
const DB_VERSION = 1
const STORE_NAME = 'snapshots'
const SNAPSHOT_KEY = 'main'

const blockSchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  order: z.number(),
  parentId: z.string().nullable(),
  text: z.string(),
  updatedAt: z.string(),
})

const importSchema = z.object({
  blocks: z.array(blockSchema),
  exportedAt: z.string(),
  schemaVersion: z.literal(1),
})

export type NotesSnapshot = {
  blocks: BlockRecord[]
  ready: boolean
  selectedId: BlockId | null
}

type Listener = () => void

const getDatabase = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    },
  })

export class NoteStore {
  private readonly doc = new Y.Doc()
  private readonly blocksMap = this.doc.getMap<BlockRecord>('blocks')
  private readonly listeners = new Set<Listener>()
  private cachedSnapshot: NotesSnapshot = {
    blocks: [],
    ready: false,
    selectedId: null,
  }
  private saveTimer: number | undefined
  private selectedId: BlockId | null = null
  private ready = false

  async initialize() {
    const database = await getDatabase()
    const snapshot = await database.get(STORE_NAME, SNAPSHOT_KEY)

    if (snapshot instanceof Uint8Array) {
      Y.applyUpdate(this.doc, snapshot)
    }

    if (this.blocksMap.size === 0) {
      this.doc.transact(() => {
        for (const block of createSeedBlocks()) {
          this.blocksMap.set(block.id, block)
        }
      })
    }

    this.ready = true
    this.selectedId = this.getBlocks()[0]?.id ?? null
    this.doc.on('update', this.handleDocumentUpdate)
    await this.persist()
    this.emit()
  }

  destroy() {
    this.doc.off('update', this.handleDocumentUpdate)
    window.clearTimeout(this.saveTimer)
    this.listeners.clear()
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot(): NotesSnapshot {
    return this.cachedSnapshot
  }

  selectBlock(id: BlockId) {
    this.selectedId = id
    this.emit()
  }

  updateBlock(id: BlockId, text: string) {
    const block = this.blocksMap.get(id)

    if (!block) {
      return
    }

    this.blocksMap.set(id, {
      ...block,
      text,
      updatedAt: new Date().toISOString(),
    })
  }

  addBlock(parentId: BlockId | null, afterId?: BlockId) {
    const siblings = this.getSiblings(parentId)
    const afterIndex = afterId
      ? Math.max(
          siblings.findIndex((block) => block.id === afterId),
          -1,
        )
      : siblings.length - 1
    const nextSiblings = [...siblings]
    const newBlock = this.createBlock('', parentId, afterIndex + 1)

    nextSiblings.splice(afterIndex + 1, 0, newBlock)
    this.rewriteSiblings(parentId, nextSiblings)
    this.selectedId = newBlock.id
    this.emit()

    return newBlock.id
  }

  deleteBlock(id: BlockId) {
    const ids = new Set<BlockId>([id])
    let changed = true

    while (changed) {
      changed = false

      for (const block of this.getBlocks()) {
        if (block.parentId && ids.has(block.parentId) && !ids.has(block.id)) {
          ids.add(block.id)
          changed = true
        }
      }
    }

    this.doc.transact(() => {
      for (const blockId of ids) {
        this.blocksMap.delete(blockId)
      }
    })

    if (this.blocksMap.size === 0) {
      const replacement = this.createBlock('Untitled', null, 0)
      this.blocksMap.set(replacement.id, replacement)
      this.selectedId = replacement.id
      return
    }

    this.selectedId = this.getBlocks()[0]?.id ?? null
    this.emit()
  }

  indentBlock(id: BlockId) {
    const block = this.blocksMap.get(id)

    if (!block) {
      return
    }

    const siblings = this.getSiblings(block.parentId)
    const index = siblings.findIndex((item) => item.id === id)
    const previous = siblings[index - 1]

    if (!previous) {
      return
    }

    const remaining = siblings.filter((item) => item.id !== id)
    this.rewriteSiblings(block.parentId, remaining)
    const newSiblings = [...this.getSiblings(previous.id), block]
    this.rewriteSiblings(previous.id, newSiblings)
  }

  outdentBlock(id: BlockId) {
    const block = this.blocksMap.get(id)

    if (!block?.parentId) {
      return
    }

    const parent = this.blocksMap.get(block.parentId)
    const grandParentId = parent?.parentId ?? null
    const currentSiblings = this.getSiblings(block.parentId).filter(
      (item) => item.id !== id,
    )
    const targetSiblings = this.getSiblings(grandParentId)
    const parentIndex = targetSiblings.findIndex(
      (item) => item.id === block.parentId,
    )

    this.rewriteSiblings(block.parentId, currentSiblings)
    targetSiblings.splice(parentIndex + 1, 0, block)
    this.rewriteSiblings(grandParentId, targetSiblings)
  }

  moveBlock(id: BlockId, direction: -1 | 1) {
    const block = this.blocksMap.get(id)

    if (!block) {
      return
    }

    const siblings = this.getSiblings(block.parentId)
    const index = siblings.findIndex((item) => item.id === id)
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= siblings.length) {
      return
    }

    const [removed] = siblings.splice(index, 1)

    if (!removed) {
      return
    }

    siblings.splice(nextIndex, 0, removed)
    this.rewriteSiblings(block.parentId, siblings)
  }

  resetDemo() {
    this.doc.transact(() => {
      for (const id of [...this.blocksMap.keys()]) {
        this.blocksMap.delete(id)
      }

      for (const block of createSeedBlocks()) {
        this.blocksMap.set(block.id, block)
      }
    })

    this.selectedId = this.getBlocks()[0]?.id ?? null
    this.emit()
  }

  exportJson() {
    return JSON.stringify(
      {
        blocks: this.getBlocks(),
        exportedAt: new Date().toISOString(),
        schemaVersion: 1,
      },
      null,
      2,
    )
  }

  importJson(value: string) {
    const parsed = importSchema.parse(JSON.parse(value))

    this.doc.transact(() => {
      for (const id of [...this.blocksMap.keys()]) {
        this.blocksMap.delete(id)
      }

      for (const block of parsed.blocks) {
        this.blocksMap.set(block.id, block)
      }
    })

    this.selectedId = parsed.blocks[0]?.id ?? null
    this.emit()
  }

  getTree() {
    return buildTree(this.getBlocks())
  }

  private readonly handleDocumentUpdate = () => {
    window.clearTimeout(this.saveTimer)
    this.saveTimer = window.setTimeout(() => {
      void this.persist()
    }, 150)
    this.emit()
  }

  private async persist() {
    const database = await getDatabase()
    await database.put(
      STORE_NAME,
      Y.encodeStateAsUpdate(this.doc),
      SNAPSHOT_KEY,
    )
  }

  private emit() {
    this.cachedSnapshot = {
      blocks: this.getBlocks(),
      ready: this.ready,
      selectedId: this.selectedId,
    }

    for (const listener of this.listeners) {
      listener()
    }
  }

  private getBlocks() {
    return [...this.blocksMap.values()].sort((first, second) => {
      if (first.parentId === second.parentId) {
        return first.order - second.order
      }

      return first.createdAt.localeCompare(second.createdAt)
    })
  }

  private getSiblings(parentId: BlockId | null) {
    return this.getBlocks().filter((block) => block.parentId === parentId)
  }

  private createBlock(
    text: string,
    parentId: BlockId | null,
    order: number,
  ): BlockRecord {
    const timestamp = new Date().toISOString()

    return {
      createdAt: timestamp,
      id: createId(),
      order,
      parentId,
      text,
      updatedAt: timestamp,
    }
  }

  private rewriteSiblings(parentId: BlockId | null, siblings: BlockRecord[]) {
    this.doc.transact(() => {
      siblings.forEach((block, index) => {
        this.blocksMap.set(block.id, {
          ...block,
          order: index,
          parentId,
          updatedAt: new Date().toISOString(),
        })
      })
    })
  }
}
