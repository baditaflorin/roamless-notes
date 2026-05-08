import type { BlockRecord, LinkMention, TagMention } from '../types'

const LINK_PATTERN = /\[\[([^\]\n]+)\]\]/g
const TAG_PATTERN = /(^|\s)#([\p{L}\p{N}_/-]+)/gu

export const normalizeConcept = (value: string) =>
  value.trim().replace(/\s+/g, ' ').toLowerCase()

export const displayConcept = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

export const extractLinksFromText = (text: string) => {
  const links = new Set<string>()

  for (const match of text.matchAll(LINK_PATTERN)) {
    const target = match[1]?.trim()

    if (target) {
      links.add(displayConcept(target))
    }
  }

  return [...links]
}

export const extractTagsFromText = (text: string) => {
  const tags = new Set<string>()

  for (const match of text.matchAll(TAG_PATTERN)) {
    const tag = match[2]?.trim()

    if (tag) {
      tags.add(`#${normalizeConcept(tag)}`)
    }
  }

  return [...tags]
}

export const extractLinks = (blocks: BlockRecord[]): LinkMention[] =>
  blocks.flatMap((block) =>
    extractLinksFromText(block.text).map((target) => ({
      blockId: block.id,
      target,
    })),
  )

export const extractTags = (blocks: BlockRecord[]): TagMention[] =>
  blocks.flatMap((block) =>
    extractTagsFromText(block.text).map((tag) => ({
      blockId: block.id,
      tag,
    })),
  )

export const blockTitle = (block: BlockRecord) => {
  const clean = block.text
    .replaceAll('[', '')
    .replaceAll(']', '')
    .replace(TAG_PATTERN, ' ')
    .trim()

  if (!clean) {
    return 'Untitled block'
  }

  return clean.length > 72 ? `${clean.slice(0, 69)}...` : clean
}

export const blockContainsConcept = (block: BlockRecord, concept: string) => {
  const normalized = normalizeConcept(concept.replace(/^#/, ''))
  const links = extractLinksFromText(block.text).map(normalizeConcept)
  const tags = extractTagsFromText(block.text).map((tag) =>
    normalizeConcept(tag.replace(/^#/, '')),
  )

  return links.includes(normalized) || tags.includes(normalized)
}
