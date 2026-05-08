import {
  blockTitle,
  extractLinksFromText,
  extractTagsFromText,
  normalizeConcept,
} from '../../lib/text'
import type { BlockRecord, GraphEdge, GraphNode } from '../../types'

export const buildGraph = (blocks: BlockRecord[]) => {
  const nodeMap = new Map<string, GraphNode>()
  const edgeMap = new Map<string, GraphEdge>()

  for (const block of blocks) {
    const blockNodeId = `block:${block.id}`
    nodeMap.set(blockNodeId, {
      blockId: block.id,
      id: blockNodeId,
      kind: 'block',
      label: blockTitle(block),
    })

    for (const link of extractLinksFromText(block.text)) {
      const conceptId = `concept:${normalizeConcept(link)}`
      nodeMap.set(conceptId, {
        id: conceptId,
        kind: 'concept',
        label: link,
      })
      edgeMap.set(`${blockNodeId}->${conceptId}`, {
        id: `${blockNodeId}->${conceptId}`,
        source: blockNodeId,
        target: conceptId,
      })
    }

    for (const tag of extractTagsFromText(block.text)) {
      const tagId = `tag:${normalizeConcept(tag)}`
      nodeMap.set(tagId, {
        id: tagId,
        kind: 'tag',
        label: tag,
      })
      edgeMap.set(`${blockNodeId}->${tagId}`, {
        id: `${blockNodeId}->${tagId}`,
        source: blockNodeId,
        target: tagId,
      })
    }
  }

  return {
    edges: [...edgeMap.values()],
    nodes: [...nodeMap.values()],
  }
}
