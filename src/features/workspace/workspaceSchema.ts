import { z } from 'zod'
import type { BlockRecord } from '../../types'

export const WORKSPACE_SCHEMA_VERSION = 2

export const workspaceSettingsSchema = z.object({
  compactEditor: z.boolean().default(false),
  confirmDestructiveActions: z.boolean().default(true),
  fuzzySearch: z.boolean().default(true),
  showGraphLabels: z.boolean().default(true),
})

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>

export const defaultWorkspaceSettings: WorkspaceSettings =
  workspaceSettingsSchema.parse({})

export const blockSchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  order: z.number(),
  parentId: z.string().nullable(),
  text: z.string(),
  updatedAt: z.string(),
})

export const workspaceStateSchema = z.object({
  blocks: z.array(blockSchema),
  exportedAt: z.string(),
  schemaVersion: z.literal(WORKSPACE_SCHEMA_VERSION),
  selectedId: z.string().nullable(),
  settings: workspaceSettingsSchema,
})

export type WorkspaceState = z.infer<typeof workspaceStateSchema>

export const legacyWorkspaceStateSchema = z.object({
  blocks: z.array(blockSchema),
  exportedAt: z.string().optional(),
  schemaVersion: z.literal(1).optional(),
})

export type WorkspaceImport =
  | {
      kind: 'workspace'
      state: WorkspaceState
    }
  | {
      kind: 'blocks'
      blocks: BlockRecord[]
      title: string
    }

export const normalizeWorkspaceState = (value: unknown): WorkspaceState => {
  if (Array.isArray(value)) {
    const blocks = z.array(blockSchema).parse(value)

    return {
      blocks,
      exportedAt: new Date().toISOString(),
      schemaVersion: WORKSPACE_SCHEMA_VERSION,
      selectedId: blocks[0]?.id ?? null,
      settings: defaultWorkspaceSettings,
    }
  }

  const current = workspaceStateSchema.safeParse(value)

  if (current.success) {
    return current.data
  }

  const legacy = legacyWorkspaceStateSchema.parse(value)

  return {
    blocks: legacy.blocks,
    exportedAt: legacy.exportedAt ?? new Date().toISOString(),
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    selectedId: legacy.blocks[0]?.id ?? null,
    settings: defaultWorkspaceSettings,
  }
}

export const createWorkspaceState = ({
  blocks,
  selectedId,
  settings,
}: {
  blocks: BlockRecord[]
  selectedId: string | null
  settings: WorkspaceSettings
}): WorkspaceState => ({
  blocks,
  exportedAt: new Date().toISOString(),
  schemaVersion: WORKSPACE_SCHEMA_VERSION,
  selectedId,
  settings,
})
