# Phase 3 Findings

## Top 5 Usability Gaps

1. A stranger cannot bring real notes in except by knowing the app-specific JSON schema.
2. A stranger cannot take work out except as block-only JSON.
3. There is no settings page even though persistence/settings are documented.
4. Import failures are silent or developer-looking.
5. Share/print/copy paths expected from a notes tool are missing.

## Top 5 Half-Baked Features

1. Peer-to-peer sync claim: delete/reword for v1.
2. JSON import/export: finish with full workspace state and migration.
3. Semantic summary/search: keep opt-in, add copy/error affordances.
4. DuckDB lab: keep, add copy/download result output.
5. Demo reset: split into load demo and start fresh.

## Top 5 Codebase Pain Points

1. `NoteStore` has too many reasons to change.
2. Import/export schemas are not reusable.
3. Download/copy/export helpers are not centralized.
4. Real-user flows are mostly untested.
5. Error handling is local and inconsistent.

## Top 5 Documentation/Reality Mismatches

1. Optional peer-to-peer sync is claimed but not implemented.
2. Settings are mentioned but not built.
3. Export/import is described as CRDT-safe but omits settings/selection.
4. DuckDB and semantic engines are real but limitations are not clear.
5. README does not tell a new user how to import existing notes.

## Definition Of Fully Usable

1. A user can import real notes from text, Markdown, HTML, JSON, paste, drag/drop, or small share URL.
2. A user can edit, search, query, inspect backlinks/graph, and reload without losing work.
3. A user can export or copy work as JSON, Markdown, CSV, or print/PDF.
4. A user can understand and change real settings that persist.
5. A user can recover from wrong imports with visible errors and clear-state controls.

## Phase 3 Success Metrics

- Input audit after: at least 9 green rows, red 0 for in-scope rows.
- Output audit after: at least 7 green rows, red 0 for in-scope rows.
- Controls audit after: every production control green.
- Codebase after: source TODO debt 0, `any` 0, dead starter assets 0, real-user path tests >=6.
- Stranger test: top 3 issues fixed before release.

## Out Of Scope

- Live WebRTC/P2P sync.
- Image OCR/attachments.
- Folder import.
- Hosted API, server secrets, accounts, or collaboration.
- Search/AI engine replacement.
