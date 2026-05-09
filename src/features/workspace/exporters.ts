import { buildTree } from '../notes/tree'
import type { BlockRecord } from '../../types'
import type { WorkspaceState } from './workspaceSchema'

export const workspaceToJson = (state: WorkspaceState) =>
  `${JSON.stringify(state, null, 2)}\n`

export const blocksToMarkdown = (blocks: BlockRecord[]) => {
  const lines: string[] = []

  const visit = (nodes: ReturnType<typeof buildTree>, depth: number) => {
    for (const node of nodes) {
      lines.push(`${'  '.repeat(depth)}- ${node.text || 'Untitled'}`)
      visit(node.children, depth + 1)
    }
  }

  visit(buildTree(blocks), 0)
  return `${lines.join('\n')}\n`
}

export const blocksToCsv = (blocks: BlockRecord[]) => {
  const header = ['id', 'parentId', 'order', 'text', 'createdAt', 'updatedAt']

  const rows = blocks.map((block) =>
    [
      block.id,
      block.parentId ?? '',
      String(block.order),
      block.text,
      block.createdAt,
      block.updatedAt,
    ].map(escapeCsv),
  )

  return `${[header, ...rows].map((row) => row.join(',')).join('\n')}\n`
}

const escapeCsv = (value: string) => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}
