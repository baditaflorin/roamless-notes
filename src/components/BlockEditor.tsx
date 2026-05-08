import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Download,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react'
import { useRef } from 'react'
import type { NoteStore } from '../features/notes/noteStore'
import { flattenTree } from '../features/notes/tree'
import type { BlockTreeNode } from '../types'

type Props = {
  store: NoteStore
  tree: BlockTreeNode[]
  selectedId: string | null
}

const focusBlock = (id: string) => {
  requestAnimationFrame(() => {
    document
      .querySelector<HTMLTextAreaElement>(`[data-block-id="${id}"]`)
      ?.focus()
  })
}

export const BlockEditor = ({ store, tree, selectedId }: Props) => {
  const importRef = useRef<HTMLInputElement | null>(null)
  const flat = flattenTree(tree)

  const exportNotes = () => {
    const blob = new Blob([store.exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `roamless-notes-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importNotes = async (file: File) => {
    store.importJson(await file.text())
  }

  return (
    <section className="flex min-h-0 flex-col border-r border-stone-200 bg-stone-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 bg-white px-3 py-2">
        <button
          aria-label="New root block"
          className="icon-button"
          onClick={() => focusBlock(store.addBlock(null) ?? '')}
          title="New root block"
          type="button"
        >
          <Plus size={16} />
        </button>
        <button
          aria-label="Export JSON"
          className="icon-button"
          onClick={exportNotes}
          title="Export JSON"
          type="button"
        >
          <Download size={16} />
        </button>
        <button
          aria-label="Import JSON"
          className="icon-button"
          onClick={() => importRef.current?.click()}
          title="Import JSON"
          type="button"
        >
          <Upload size={16} />
        </button>
        <button
          aria-label="Reset demo"
          className="icon-button"
          onClick={() => store.resetDemo()}
          title="Reset demo"
          type="button"
        >
          <RotateCcw size={16} />
        </button>
        <input
          ref={importRef}
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]

            if (file) {
              void importNotes(file)
            }
          }}
          type="file"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
        {flat.map((block) => (
          <BlockRow
            block={block}
            key={block.id}
            selected={selectedId === block.id}
            store={store}
          />
        ))}
      </div>
    </section>
  )
}

type RowProps = {
  block: BlockTreeNode
  selected: boolean
  store: NoteStore
}

const BlockRow = ({ block, selected, store }: RowProps) => {
  const addAfter = () =>
    focusBlock(store.addBlock(block.parentId, block.id) ?? '')

  return (
    <article
      className="group grid grid-cols-[auto_1fr_auto] items-start gap-2 py-1"
      style={{ paddingLeft: `${Math.min(block.depth, 7) * 18}px` }}
    >
      <span className="mt-3 h-2 w-2 rounded-full bg-stone-400" />
      <textarea
        className={`block-field ${selected ? 'block-field-selected' : ''}`}
        data-block-id={block.id}
        onChange={(event) => store.updateBlock(block.id, event.target.value)}
        onFocus={() => store.selectBlock(block.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            addAfter()
          }

          if (event.key === 'Tab') {
            event.preventDefault()
            if (event.shiftKey) {
              store.outdentBlock(block.id)
            } else {
              store.indentBlock(block.id)
            }
          }

          if (event.metaKey && event.key === 'ArrowUp') {
            event.preventDefault()
            store.moveBlock(block.id, -1)
          }

          if (event.metaKey && event.key === 'ArrowDown') {
            event.preventDefault()
            store.moveBlock(block.id, 1)
          }

          if (event.key === 'Backspace' && !block.text.trim()) {
            event.preventDefault()
            store.deleteBlock(block.id)
          }
        }}
        rows={Math.max(1, Math.ceil(block.text.length / 74))}
        value={block.text}
      />
      <div className="flex opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
        <button
          aria-label="Move up"
          className="mini-button"
          onClick={() => store.moveBlock(block.id, -1)}
          title="Move up"
          type="button"
        >
          <ArrowUp size={14} />
        </button>
        <button
          aria-label="Move down"
          className="mini-button"
          onClick={() => store.moveBlock(block.id, 1)}
          title="Move down"
          type="button"
        >
          <ArrowDown size={14} />
        </button>
        <button
          aria-label="Outdent"
          className="mini-button"
          onClick={() => store.outdentBlock(block.id)}
          title="Outdent"
          type="button"
        >
          <ArrowLeft size={14} />
        </button>
        <button
          aria-label="Indent"
          className="mini-button"
          onClick={() => store.indentBlock(block.id)}
          title="Indent"
          type="button"
        >
          <ArrowRight size={14} />
        </button>
        <button
          aria-label="Delete"
          className="mini-button text-red-700"
          onClick={() => store.deleteBlock(block.id)}
          title="Delete"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  )
}
