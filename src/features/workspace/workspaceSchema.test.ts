import { describe, expect, it } from 'vitest'
import { normalizeWorkspaceState } from './workspaceSchema'

describe('workspace schema migration', () => {
  it('migrates v1 block-only exports to v2 workspace state', () => {
    const state = normalizeWorkspaceState({
      blocks: [
        {
          createdAt: '2026-05-09T00:00:00.000Z',
          id: 'one',
          order: 0,
          parentId: null,
          text: 'Old export',
          updatedAt: '2026-05-09T00:00:00.000Z',
        },
      ],
      schemaVersion: 1,
    })

    expect(state.schemaVersion).toBe(2)
    expect(state.selectedId).toBe('one')
    expect(state.settings.showGraphLabels).toBe(true)
  })
})
