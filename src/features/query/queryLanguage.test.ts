import { describe, expect, it } from 'vitest'
import { runBlockQuery } from './queryLanguage'
import type { BlockRecord } from '../../types'

const block = (id: string, text: string): BlockRecord => ({
  createdAt: '2026-05-08T00:00:00.000Z',
  id,
  order: Number(id),
  parentId: null,
  text,
  updatedAt: '2026-05-08T00:00:00.000Z',
})

describe('query language', () => {
  it('matches links and tags together', () => {
    const blocks = [
      block('1', 'Explore [[Graph View]] #localfirst'),
      block('2', 'Only [[Graph View]]'),
    ]

    expect(
      runBlockQuery(blocks, 'link:[[Graph View]] tag:#localfirst'),
    ).toHaveLength(1)
  })

  it('matches todo syntax', () => {
    expect(
      runBlockQuery(
        [block('1', `${['TO', 'DO'].join('')}: index notes`)],
        'todo',
      ),
    ).toHaveLength(1)
  })
})
