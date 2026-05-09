import { describe, expect, it } from 'vitest'
import { parseImportBatch, parseImportSource } from './importers'

describe('workspace importers', () => {
  it('turns Markdown headings and bullets into nested blocks', () => {
    const result = parseImportSource({
      content: '# Project\n- First idea\n  - Nested idea',
      fileName: 'notes.md',
      sourceName: 'notes.md',
    })

    expect(result.kind).toBe('blocks')

    if (result.kind === 'blocks') {
      expect(result.blocks.map((block) => block.text)).toEqual([
        'notes.md',
        'Project',
        'First idea',
        'Nested idea',
      ])
      expect(result.blocks[3]?.parentId).toBe(result.blocks[2]?.id)
    }
  })

  it('imports HTML text nodes that users paste from a page', () => {
    const result = parseImportSource({
      content: '<h1>Title</h1><p>Paragraph text</p><ul><li>List item</li></ul>',
      fileName: 'clip.html',
      mimeType: 'text/html',
      sourceName: 'clip.html',
    })

    expect(result.kind).toBe('blocks')

    if (result.kind === 'blocks') {
      expect(result.blocks.map((block) => block.text)).toContain(
        'Paragraph text',
      )
      expect(result.blocks.map((block) => block.text)).toContain('List item')
    }
  })

  it('keeps per-file errors in batch imports', () => {
    const result = parseImportBatch([
      {
        content: 'hello',
        fileName: 'ok.txt',
        sourceName: 'ok.txt',
      },
      {
        content: '{broken',
        fileName: 'bad.json',
        sourceName: 'bad.json',
      },
    ])

    expect(result.successes).toHaveLength(1)
    expect(result.failures).toHaveLength(1)
  })
})
