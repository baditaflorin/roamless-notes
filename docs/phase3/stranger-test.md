# Phase 3 Stranger Test

Date: 2026-05-09

## Setup

Fresh Chromium context through Playwright, served from the production `docs/` build at the GitHub Pages base path. Input fixture: `test/fixtures/real-notes.md`, a small Markdown notebook with a heading, nested bullets, a wiki link, and a tag.

## User Story Tested

1. Open the app with no prior state.
2. Import a real Markdown note file.
3. Confirm imported notes are editable and searchable.
4. Change a setting, reload, and confirm it persists.
5. Export Markdown.
6. Copy notebook Markdown.
7. Trigger print/PDF flow.

## Findings

| Finding                                                                         | Severity | Response                                                                                |
| ------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| Clipboard write can fail in stricter browser contexts without a visible result. | High     | Fixed copy actions to catch clipboard errors and show notices.                          |
| Settings persistence was not covered by the old smoke test.                     | High     | Added smoke coverage for toggling compact editor, reloading, and verifying persistence. |
| Print flow was not covered by tests.                                            | Medium   | Added print action test with a browser-side print hook and print stylesheet.            |
| Import affordances need to support real files, not only the app JSON schema.    | High     | Added multi-format parser and smoke-tested Markdown import.                             |
| URL import can be blocked by CORS.                                              | Medium   | Added explicit fallback message telling users to paste rendered text/HTML.              |

## Top 3 Fixed Before Release

1. Clipboard failures now produce notices instead of silent failure.
2. Settings persistence is implemented and smoke-tested.
3. Real Markdown file import is implemented and smoke-tested.

## Result

The tested stranger path completed without assistance after fixes: import real notes, edit/search, persist settings, export/copy, and print.
