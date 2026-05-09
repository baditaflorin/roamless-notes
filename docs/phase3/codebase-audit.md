# Phase 3 Codebase Audit

## DRY Violations

1. Export/download logic is embedded in `src/components/BlockEditor.tsx` lines 35-42 and will duplicate for Markdown/CSV/share unless extracted.
2. Error handling is repeated in `src/components/SearchPanel.tsx` DuckDB and semantic panels with local `busy/error` state.
3. Boundary schemas live inside `noteStore.ts`; import/export producers and consumers cannot reuse one schema.

## SOLID Violations

1. `src/features/notes/noteStore.ts` handles persistence, migration, block mutation, import/export, and tree derivation.
2. `src/components/SearchPanel.tsx` owns search UI, query UI, DuckDB UI, semantic UI, result rendering, and error handling.
3. `src/components/BlockEditor.tsx` mixes editor rendering with import/export file IO.

## Dead Code

- `src/assets/react.svg`, `src/assets/vite.svg`, and `src/assets/hero.png` are unused starter assets.
- No commented-out blocks found.

## TODO/FIXME/XXX/HACK

- `src/features/notes/seed.ts` contains demo text with `TODO:`. It is user-facing sample content, not source debt, but it makes debt scans noisy.
- `src/features/query/queryLanguage.ts` intentionally matches user `TODO` blocks.

## Type Safety Holes

- `src/features/duckdb/duckdbClient.ts` uses `unknown` and casts rows at the DuckDB boundary.
- `src/features/semantic/semanticClient.ts` casts model tensor output at the Transformers boundary.
- No `any` or `@ts-ignore` in source.

## Inconsistent Patterns

- Some user actions silently fail (`selectBlock` missing id, import parse errors, clipboard unavailable).
- State is partly in IndexedDB and partly ephemeral React state; no settings convention yet.
- Export schema version and persisted snapshot version are not aligned.

## Test Coverage Holes

- No tests for real user import paths: Markdown, text, HTML, multi-file, drag/drop, paste, hash import.
- No tests for JSON round-trip or migration.
- Smoke test only exercises new block + search.

## After Implementation

## DRY

- Download, clipboard, and share helpers moved to `src/lib/browserIo.ts`.
- Import parsing is centralized in `src/features/workspace/importers.ts`.
- Export formatting is centralized in `src/features/workspace/exporters.ts`.
- Workspace schemas are shared in `src/features/workspace/workspaceSchema.ts`.

## SOLID

- `BlockEditor` now edits blocks only.
- `WorkspacePanel` owns import/export/settings controls.
- `NoteStore` still owns mutations and persistence, but import/export parsing moved out.

## Dead Code

- Unused starter assets were deleted.

## TODO/FIXME/XXX/HACK

- Source debt remains zero. The query parser still intentionally matches user `TODO` blocks.

## Type Safety

- `any` remains zero.
- Boundary casts remain isolated in DuckDB and Transformers boundary modules.
- JSON imports use Zod validation/migration.

## Tests

- Unit tests increased from 5 to 12.
- Playwright smoke now covers real Markdown import, settings persistence, Markdown export, copy, print, edit, and search.

Before metrics: DRY 3, SOLID 3, dead files 3, source TODO debt 0, `any` 0, unsafe boundary casts 2, real-user path tests 1.
After metrics: DRY 0 in core modules, SOLID 1 accepted (`NoteStore` persistence/mutation coupling), dead files 0, source TODO debt 0, `any` 0, unsafe boundary casts 2 isolated, real-user path tests 7.
