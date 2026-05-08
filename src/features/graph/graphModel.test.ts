import { describe, expect, it } from 'vitest'
import { buildGraph } from './graphModel'
import type { BlockRecord } from '../../types'

const sample: BlockRecord = {
  createdAt: '2026-05-08T00:00:00.000Z',
  id: '1',
  order: 0,
  parentId: null,
  text: 'Map [[Backlinks]] #graph',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('graph model', () => {
  it('creates concept and tag edges from a block', () => {
    const graph = buildGraph([sample])

    expect(graph.nodes.some((node) => node.id === 'concept:backlinks')).toBe(
      true,
    )
    expect(graph.nodes.some((node) => node.id === 'tag:#graph')).toBe(true)
    expect(graph.edges).toHaveLength(2)
  })
})
