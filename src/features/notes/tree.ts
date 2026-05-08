import type { BlockRecord, BlockTreeNode } from '../../types'

export const sortBlocks = (blocks: BlockRecord[]) =>
  [...blocks].sort((first, second) => {
    if (first.parentId === second.parentId) {
      return first.order - second.order
    }

    return first.createdAt.localeCompare(second.createdAt)
  })

export const buildTree = (blocks: BlockRecord[]): BlockTreeNode[] => {
  const children = new Map<string | null, BlockRecord[]>()

  for (const block of sortBlocks(blocks)) {
    const group = children.get(block.parentId) ?? []
    group.push(block)
    children.set(block.parentId, group)
  }

  const visit = (parentId: string | null, depth: number): BlockTreeNode[] =>
    (children.get(parentId) ?? []).map((block) => ({
      ...block,
      children: visit(block.id, depth + 1),
      depth,
    }))

  return visit(null, 0)
}

export const flattenTree = (nodes: BlockTreeNode[]) => {
  const flattened: BlockTreeNode[] = []

  const visit = (node: BlockTreeNode) => {
    flattened.push(node)
    node.children.forEach(visit)
  }

  nodes.forEach(visit)
  return flattened
}
