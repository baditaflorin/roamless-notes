# Phase 3 Output Audit

| Output pathway        | Before | Evidence                                                          | Phase 3 target                                                  |
| --------------------- | ------ | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| JSON state export     | Yellow | Blocks export exists, settings/selection omitted, only schema v1. | Green: full v2 workspace export with migration compatibility.   |
| JSON round-trip       | Yellow | v1 import/export likely works for blocks only; no test.           | Green: tested full-state round-trip.                            |
| Markdown export       | Red    | Not built.                                                        | Green: nested blocks exported as Markdown bullets.              |
| CSV export            | Red    | Not built.                                                        | Green: blocks table export for spreadsheets.                    |
| Copy to clipboard     | Red    | Not built.                                                        | Green: copy selected block, Markdown notebook, query results.   |
| Share link            | Red    | Not built.                                                        | Green: hash-encoded small workspace with documented size limit. |
| Print/PDF view        | Red    | Browser print works poorly with app chrome.                       | Green: print stylesheet and print action.                       |
| Screenshot export     | Gray   | Browser-native screenshots are enough for v1.                     | ADR marks out of scope.                                         |
| Embed code            | Gray   | No public hosted documents or stable embeds.                      | ADR marks out of scope.                                         |
| API/curl-ready output | Gray   | Mode A has no runtime API.                                        | Stable JSON/CSV documented instead.                             |

## After Implementation

| Output pathway        | After | Evidence                                                                         |
| --------------------- | ----- | -------------------------------------------------------------------------------- |
| JSON state export     | Green | Exports v2 full workspace with blocks, selected block, settings, timestamp.      |
| JSON round-trip       | Green | Unit test covers v2 state shape and v1 migration.                                |
| Markdown export       | Green | Exports nested Markdown bullets and is smoke-tested by download.                 |
| CSV export            | Green | Exports stable blocks table with escaped cells.                                  |
| Copy to clipboard     | Green | Markdown, selected block, SQL rows, and summary paths have copy actions/notices. |
| Share link            | Green | Small workspaces produce hash URLs; oversized state gives export guidance.       |
| Print/PDF view        | Green | Print action and print stylesheet are smoke-tested.                              |
| Screenshot export     | Gray  | Browser-native screenshots remain out of scope.                                  |
| Embed code            | Gray  | No hosted documents/embeds in Mode A v1.                                         |
| API/curl-ready output | Gray  | Stable JSON/CSV is documented instead of an API.                                 |

Before counts: green 0, yellow 2, red 5, gray 3. After counts: green 7, yellow 0, red 0, gray 3.
