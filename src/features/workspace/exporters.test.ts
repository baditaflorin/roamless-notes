import { describe, expect, it } from 'vitest'
import type { BlockRecord } from '../../types'
import { blocksToCsv, blocksToMarkdown, workspaceToJson } from './exporters'
import {
  createWorkspaceState,
  defaultWorkspaceSettings,
} from './workspaceSchema'

const block = (
  id: string,
  text: string,
  parentId: string | null = null,
  order = 0,
): BlockRecord => ({
  createdAt: '2026-05-09T00:00:00.000Z',
  id,
  order,
  parentId,
  text,
  updatedAt: '2026-05-09T00:00:00.000Z',
})

describe('workspace exporters', () => {
  it('exports nested Markdown bullets', () => {
    expect(blocksToMarkdown([block('1', 'Root'), block('2', 'Child', '1')]))
      .toMatchInlineSnapshot(`
        "- Root
          - Child
        "
      `)
  })

  it('escapes CSV cells', () => {
    expect(blocksToCsv([block('1', 'Hello, "CSV"')])).toContain(
      '"Hello, ""CSV"""',
    )
  })

  it('exports full workspace state', () => {
    const json = workspaceToJson(
      createWorkspaceState({
        blocks: [block('1', 'Root')],
        selectedId: '1',
        settings: defaultWorkspaceSettings,
      }),
    )

    expect(JSON.parse(json)).toMatchObject({
      schemaVersion: 2,
      selectedId: '1',
      settings: defaultWorkspaceSettings,
    })
  })
})
