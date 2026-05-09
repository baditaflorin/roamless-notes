# Phase 3 Controls Audit

| Control                | Before | Evidence                                                   | Decision                                                          |
| ---------------------- | ------ | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| New root block         | Green  | Creates a root block and focuses it.                       | Keep.                                                             |
| Export JSON            | Yellow | Downloads block-only JSON.                                 | Finish as full state export and add more formats.                 |
| Import JSON            | Yellow | Single-file JSON import, no visible errors.                | Finish with parser/import panel.                                  |
| Reset demo             | Yellow | Destructive, no separate fresh start.                      | Split into demo load and clear workspace.                         |
| Move up/down           | Green  | Reorders sibling blocks.                                   | Keep and test.                                                    |
| Indent/outdent         | Green  | Moves blocks between parent levels.                        | Keep and test.                                                    |
| Delete                 | Yellow | Deletes block subtree with no confirmation or undo.        | Keep for block row, add safer workspace-level reset confirmation. |
| Full text search       | Green  | MiniSearch over real blocks.                               | Keep.                                                             |
| Query language         | Green  | `tag:`, `link:`, `todo`, text query paths.                 | Keep and document.                                                |
| DuckDB SQL             | Yellow | Runs queries but result export/copy missing.               | Finish copy/download result path.                                 |
| Semantic index/search  | Yellow | Loads local model on demand; errors shown.                 | Keep opt-in and document large download.                          |
| Semantic summarize     | Yellow | Fallback exists, output cannot be copied.                  | Finish copy summary.                                              |
| Graph node click       | Yellow | Opens query/select, backlink logic weak for concept pages. | Keep and fix selected/backlink behavior.                          |
| Star/Fork/PayPal links | Green  | Header links work.                                         | Keep.                                                             |

Before counts: green 6, yellow 8, red 0, gray 0.
