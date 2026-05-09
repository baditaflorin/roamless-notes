# Phase 3 Postmortem

Date: 2026-05-09

## Audit Grids

| Audit          | Before                           | After                               |
| -------------- | -------------------------------- | ----------------------------------- |
| Inputs         | 0 green, 3 yellow, 7 red, 2 gray | 11 green, 0 yellow, 0 red, 2 gray   |
| Outputs        | 0 green, 2 yellow, 5 red, 3 gray | 7 green, 0 yellow, 0 red, 3 gray    |
| Controls       | 6 green, 8 yellow, 0 red         | 13 green, 0 yellow, 0 red           |
| Feature claims | 2 green, 3 yellow, 2 red         | 5 green, 0 yellow, 0 red, 1 removed |

## Half-Baked Feature Triage

- Finished JSON import/export: now full v2 workspace state with settings and selected block.
- Finished DuckDB lab output: SQL rows can be copied or downloaded.
- Finished semantic output: summaries can be copied and model errors surface as notices.
- Finished demo reset: split into `Load demo` and `Start fresh`.
- Removed live peer-to-peer sync claim: documented as out of scope; portable state remains.

## Codebase Health

| Metric                    | Before | After |
| ------------------------- | ------ | ----- |
| Core DRY violations       | 3      | 0     |
| Accepted SOLID violations | 3      | 1     |
| Dead starter files        | 3      | 0     |
| Source debt markers       | 0      | 0     |
| Unsafe broad types        | 0      | 0     |
| Isolated boundary casts   | 2      | 2     |
| Real-user path tests      | 1      | 7     |
| Unit tests                | 5      | 12    |

## Stranger-Test Response

The fresh-browser test found three release-blocking usability gaps: clipboard failure visibility, settings persistence coverage, and real Markdown import coverage. All three were fixed and added to tests.

## Documentation-Reality Mismatches Fixed

- Reworded the product description from optional peer-to-peer sync to portable state.
- Added import/export instructions and limitations to README.
- Added verified feature checklist tied to unit/smoke coverage.
- Updated privacy docs to include selected block metadata and settings.
- Updated architecture docs with workspace schema/import/export boundaries.

## Surprises

- Clipboard writes are less dependable in automated and stricter contexts than normal clicking suggests, so visible notices matter.
- A small import panel did more for usability than another knowledge-graph feature would have.
- The old JSON-only path made the app feel complete to its author but not to a stranger.

## Still-Open Completeness Gaps

1. Folder import remains out of scope.
2. Image OCR and attachments remain out of scope.
3. Share URLs are intentionally limited to small workspaces.
4. Live cross-device sync remains out of scope.
5. Semantic model downloads are large and browser-dependent.

## Honest Take

A stranger can now use Roamless Notes for real text/Markdown/HTML notes end-to-end: import, edit, persist, search, query, inspect graph/backlinks, export, copy, share small workspaces, and print without asking for help.

Specific ways still no: very large notebooks, folder trees, images, attachments, and live multi-device sync are not solved in Phase 3.
