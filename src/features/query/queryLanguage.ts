import {
  blockContainsConcept,
  extractLinks,
  extractLinksFromText,
  extractTagsFromText,
  normalizeConcept,
} from '../../lib/text'
import type { BlockRecord, QueryResult } from '../../types'

type Clause =
  | { kind: 'contains'; value: string }
  | { kind: 'link'; value: string }
  | { kind: 'tag'; value: string }
  | { kind: 'todo' }
  | { kind: 'orphan' }

const tokenize = (query: string) =>
  query.match(/(?:link:\[\[[^\]]+\]\]|"[^"]+"|\S+)/g) ?? []

export const parseQuery = (query: string): Clause[] =>
  tokenize(query).map((token) => {
    const clean = token.replace(/^"|"$/g, '')

    if (clean === 'todo' || clean === 'is:todo') {
      return { kind: 'todo' }
    }

    if (clean === 'orphans' || clean === 'is:orphan') {
      return { kind: 'orphan' }
    }

    if (clean.startsWith('link:[[') && clean.endsWith(']]')) {
      return {
        kind: 'link',
        value: clean.slice('link:[['.length, -2),
      }
    }

    if (clean.startsWith('tag:')) {
      return {
        kind: 'tag',
        value: clean.slice('tag:'.length).replace(/^#/, ''),
      }
    }

    if (clean.startsWith('text:')) {
      return {
        kind: 'contains',
        value: clean.slice('text:'.length),
      }
    }

    return { kind: 'contains', value: clean }
  })

export const runBlockQuery = (
  blocks: BlockRecord[],
  query: string,
): QueryResult[] => {
  const clauses = parseQuery(query)
  const incoming = new Map<string, number>()

  for (const link of extractLinks(blocks)) {
    const key = normalizeConcept(link.target)
    incoming.set(key, (incoming.get(key) ?? 0) + 1)
  }

  if (clauses.length === 0) {
    return []
  }

  return blocks
    .filter((block) =>
      clauses.every((clause) => {
        switch (clause.kind) {
          case 'contains':
            return block.text
              .toLowerCase()
              .includes(clause.value.trim().toLowerCase())
          case 'link':
            return blockContainsConcept(block, clause.value)
          case 'orphan':
            return (
              extractLinksFromText(block.text).length === 0 &&
              (incoming.get(normalizeConcept(block.text)) ?? 0) === 0
            )
          case 'tag':
            return extractTagsFromText(block.text)
              .map((tag) => normalizeConcept(tag.replace(/^#/, '')))
              .includes(normalizeConcept(clause.value))
          case 'todo':
            return /\bTODO\b|\bDONE\b|\[\s?\]|\[x\]/i.test(block.text)
        }
      }),
    )
    .map((block) => ({
      block,
      reason: clauses.map((clause) => clause.kind).join(', '),
    }))
}
