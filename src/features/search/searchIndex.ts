import MiniSearch from 'minisearch'
import { extractLinksFromText, extractTagsFromText } from '../../lib/text'
import type { BlockRecord } from '../../types'

export type SearchHit = {
  block: BlockRecord
  score: number
  terms: string[]
}

type IndexedBlock = {
  id: string
  links: string
  tags: string
  text: string
}

export const createSearchIndex = (blocks: BlockRecord[], fuzzy = true) => {
  const index = new MiniSearch<IndexedBlock>({
    fields: ['text', 'links', 'tags'],
    idField: 'id',
    searchOptions: {
      boost: { links: 2, tags: 1.5, text: 1 },
      fuzzy: fuzzy ? 0.2 : false,
      prefix: true,
    },
    storeFields: ['text', 'links', 'tags'],
  })

  index.addAll(
    blocks.map((block) => ({
      id: block.id,
      links: extractLinksFromText(block.text).join(' '),
      tags: extractTagsFromText(block.text).join(' '),
      text: block.text,
    })),
  )

  return index
}

export const searchBlocks = (
  index: MiniSearch<IndexedBlock>,
  blocks: BlockRecord[],
  query: string,
): SearchHit[] => {
  if (!query.trim()) {
    return []
  }

  const byId = new Map(blocks.map((block) => [block.id, block]))

  return index
    .search(query)
    .map((result) => ({
      block: byId.get(String(result.id)),
      score: result.score,
      terms: result.terms,
    }))
    .filter((hit): hit is SearchHit => Boolean(hit.block))
}
