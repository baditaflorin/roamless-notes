import { describe, expect, it } from 'vitest'
import { extractLinksFromText, extractTagsFromText } from './text'

describe('text extraction', () => {
  it('extracts wiki links without duplicates', () => {
    expect(
      extractLinksFromText('See [[Graph View]] and [[Graph View]].'),
    ).toEqual(['Graph View'])
  })

  it('extracts normalized tags', () => {
    expect(extractTagsFromText('Ship #LocalFirst and #ai/search')).toEqual([
      '#localfirst',
      '#ai/search',
    ])
  })
})
