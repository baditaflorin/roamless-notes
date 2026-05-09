import { createId } from '../../lib/ids'
import type { BlockRecord } from '../../types'
import {
  normalizeWorkspaceState,
  type WorkspaceImport,
} from './workspaceSchema'

export type ImportSource = {
  content: string
  fileName?: string
  mimeType?: string
  sourceName: string
}

export type ImportFailure = {
  message: string
  sourceName: string
}

export type ImportSuccess = {
  importData: WorkspaceImport
  sourceName: string
}

export type ImportBatchResult = {
  failures: ImportFailure[]
  successes: ImportSuccess[]
}

type ParsedLine = {
  depth: number
  text: string
}

const now = () => new Date().toISOString()

const createBlock = (
  text: string,
  order: number,
  parentId: string | null,
): BlockRecord => {
  const timestamp = now()

  return {
    createdAt: timestamp,
    id: createId(),
    order,
    parentId,
    text,
    updatedAt: timestamp,
  }
}

const extensionOf = (fileName?: string) =>
  fileName?.toLowerCase().split('.').pop() ?? ''

export const detectImportFormat = (source: ImportSource) => {
  const extension = extensionOf(source.fileName)
  const mime = source.mimeType?.toLowerCase() ?? ''
  const sample = source.content.trimStart()

  if (
    sample.startsWith('{') ||
    sample.startsWith('[') ||
    extension === 'json'
  ) {
    return 'json'
  }

  if (mime.includes('html') || extension === 'html' || sample.startsWith('<')) {
    return 'html'
  }

  if (extension === 'md' || extension === 'markdown') {
    return 'markdown'
  }

  return 'text'
}

export const parseImportSource = (source: ImportSource): WorkspaceImport => {
  const format = detectImportFormat(source)

  if (format === 'json') {
    return {
      kind: 'workspace',
      state: normalizeWorkspaceState(JSON.parse(source.content)),
    }
  }

  const lines =
    format === 'html'
      ? htmlToLines(source.content)
      : textToLines(source.content, format === 'markdown')

  return {
    blocks: linesToBlocks(lines, source.sourceName),
    kind: 'blocks',
    title: source.sourceName,
  }
}

export const parseImportBatch = (
  sources: ImportSource[],
): ImportBatchResult => {
  const successes: ImportSuccess[] = []
  const failures: ImportFailure[] = []

  for (const source of sources) {
    try {
      successes.push({
        importData: parseImportSource(source),
        sourceName: source.sourceName,
      })
    } catch (caught) {
      failures.push({
        message:
          caught instanceof Error ? caught.message : 'Could not parse input',
        sourceName: source.sourceName,
      })
    }
  }

  return { failures, successes }
}

const textToLines = (content: string, markdown: boolean): ParsedLine[] =>
  content
    .split(/\r?\n/)
    .map((raw) => {
      const leading = raw.match(/^\s*/)?.[0].length ?? 0
      const cleaned = raw
        .replace(/^\s*[-*+]\s+/, '')
        .replace(/^\s*\d+\.\s+/, '')
        .replace(/^#{1,6}\s+/, '')
        .trim()

      return {
        depth: markdown ? Math.floor(leading / 2) : 0,
        text: cleaned,
      }
    })
    .filter((line) => line.text.length > 0)

const htmlToLines = (content: string): ParsedLine[] => {
  const doc = new DOMParser().parseFromString(content, 'text/html')
  const nodes = [
    ...doc.body.querySelectorAll('h1,h2,h3,h4,h5,h6,li,p,blockquote,pre'),
  ]

  return nodes
    .map((node) => {
      const tag = node.tagName.toLowerCase()
      const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      const depth = tag.startsWith('h')
        ? Math.max(Number(tag.slice(1)) - 1, 0)
        : tag === 'li'
          ? listDepth(node)
          : 0

      return { depth, text }
    })
    .filter((line) => line.text.length > 0)
}

const listDepth = (node: Element) => {
  let depth = 0
  let current: Element | null = node.parentElement

  while (current) {
    if (current.tagName === 'UL' || current.tagName === 'OL') {
      depth += 1
    }
    current = current.parentElement
  }

  return Math.max(depth - 1, 0)
}

const linesToBlocks = (lines: ParsedLine[], title: string): BlockRecord[] => {
  const root = createBlock(title, 0, null)
  const parents = new Map<number, BlockRecord>([[0, root]])
  const siblingCounts = new Map<string | null, number>([[null, 1]])
  const blocks = [root]

  lines.forEach((line) => {
    const depth = Math.max(line.depth + 1, 1)
    const parent = parents.get(depth - 1) ?? root
    const key = parent.id
    const order = siblingCounts.get(key) ?? 0
    const block = createBlock(line.text, order, parent.id)

    siblingCounts.set(key, order + 1)
    parents.set(depth, block)
    blocks.push(block)
  })

  return blocks
}
