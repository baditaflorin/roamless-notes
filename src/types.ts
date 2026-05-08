export type BlockId = string

export type BlockRecord = {
  id: BlockId
  parentId: BlockId | null
  order: number
  text: string
  createdAt: string
  updatedAt: string
}

export type BlockTreeNode = BlockRecord & {
  children: BlockTreeNode[]
  depth: number
}

export type LinkMention = {
  blockId: BlockId
  target: string
}

export type TagMention = {
  blockId: BlockId
  tag: string
}

export type GraphNode = {
  id: string
  kind: 'block' | 'concept' | 'tag'
  label: string
  blockId?: BlockId
}

export type GraphEdge = {
  id: string
  source: string
  target: string
}

export type QueryResult = {
  block: BlockRecord
  reason: string
}
