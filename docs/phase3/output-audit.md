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

Before counts: green 0, yellow 2, red 5, gray 3.
