# Phase 3 Input Audit

Status legend: green = works end-to-end, yellow = partial, red = claimed or expected but broken/missing, gray = out of scope for Mode A v1.

| Input pathway                | Before | Evidence                                                                                              | Phase 3 target                                                                   |
| ---------------------------- | ------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Demo/sample loader           | Yellow | `Reset demo` exists but is destructive and not framed as one input path.                              | Green: demo and fresh notebook are explicit choices.                             |
| Restored autosave            | Yellow | Yjs snapshot persists in IndexedDB, but no migration metadata or selected block/settings persistence. | Green: migrated persisted workspace with settings and selected block.            |
| Downloaded state file import | Yellow | Single JSON file import exists, no error handling, no version migration, no progress.                 | Green: schema-validated v1/v2 import with user-visible result.                   |
| Multi-file upload            | Red    | File input accepts one JSON file.                                                                     | Green: multiple JSON/Markdown/text/HTML files with progress and per-file errors. |
| Drag and drop                | Red    | No drop target.                                                                                       | Green: drop files or text into import panel.                                     |
| Paste plain text             | Red    | Only block editor text editing works.                                                                 | Green: paste box or clipboard import turns lines into blocks.                    |
| Paste HTML                   | Red    | Not supported.                                                                                        | Green: HTML converted to readable blocks.                                        |
| Paste image                  | Gray   | Notes are text-only in Mode A v1.                                                                     | ADR marks image OCR/attachments out of scope.                                    |
| URL input                    | Red    | Not supported.                                                                                        | Green: fetch public text/HTML when CORS permits, otherwise clear paste guidance. |
| Clipboard read button        | Red    | Not supported.                                                                                        | Green: permission-aware clipboard import with fallback to paste box.             |
| Mobile file picker           | Yellow | Hidden file input exists but JSON-only and single-file.                                               | Green: visible import control, multiple text formats.                            |
| Folder import                | Gray   | Browser folder APIs add complexity beyond v1.                                                         | ADR marks folder import out of scope.                                            |
| Deep-link imported state     | Red    | No hash/share import.                                                                                 | Green: small notebooks can load from URL hash.                                   |

## After Implementation

| Input pathway                | After | Evidence                                                                     |
| ---------------------------- | ----- | ---------------------------------------------------------------------------- |
| Demo/sample loader           | Green | `Load demo` is explicit and separate from fresh start.                       |
| Restored autosave            | Green | Blocks, selected block, and settings persist in IndexedDB metadata/snapshot. |
| Downloaded state file import | Green | v1/v2 JSON state validates and migrates through shared schema.               |
| Multi-file upload            | Green | File input accepts multiple JSON/Markdown/text/HTML files.                   |
| Drag and drop                | Green | Workspace panel handles dropped files and text.                              |
| Paste plain text             | Green | Paste box imports text as blocks.                                            |
| Paste HTML                   | Green | HTML parser extracts headings, paragraphs, list items, quotes, and pre text. |
| Paste image                  | Gray  | Text-only v1; ADR 0061 keeps OCR/attachments out of scope.                   |
| URL input                    | Green | URL fetch imports public text/HTML and reports CORS fallback guidance.       |
| Clipboard read button        | Green | Clipboard read imports text or shows fallback notice.                        |
| Mobile file picker           | Green | Visible import control uses mobile-compatible file input.                    |
| Folder import                | Gray  | ADR 0061 keeps folder import out of scope.                                   |
| Deep-link imported state     | Green | Hash-encoded workspace state loads on first app open.                        |

Before counts: green 0, yellow 3, red 7, gray 2. After counts: green 11, yellow 0, red 0, gray 2.
