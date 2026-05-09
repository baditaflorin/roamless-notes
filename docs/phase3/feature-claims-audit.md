# Phase 3 Feature Claims Audit

| Claim location | Claim                                                      | Before | Phase 3 action                                                             |
| -------------- | ---------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| README/package | Optional peer-to-peer sync                                 | Red    | Reword to portable CRDT-safe import/export; live P2P remains out of scope. |
| README         | Notes stored in IndexedDB with Yjs CRDT updates            | Green  | Keep and add migration note.                                               |
| README         | Search/backlinks/graph/DuckDB/semantic tools run on device | Yellow | Keep, add lazy-model limitation and tests for search/graph/import paths.   |
| Docs privacy   | Settings in browser storage                                | Red    | Add real settings persistence or remove claim.                             |
| Postmortem     | CRDT-safe export/import represents sync                    | Yellow | Keep after v2 state export/import round-trip.                              |
| App header     | Version and commit visible                                 | Green  | Keep.                                                                      |
| In-app buttons | JSON import/export                                         | Yellow | Finish.                                                                    |

## After Implementation

| Claim                                              | After   | Evidence                                                      |
| -------------------------------------------------- | ------- | ------------------------------------------------------------- |
| Portable CRDT-safe import/export                   | Green   | Full v2 state export/import and v1 migration.                 |
| IndexedDB/Yjs local persistence                    | Green   | Existing storage plus metadata/settings persistence.          |
| Search/backlinks/graph/DuckDB/semantic local tools | Green   | Existing tools preserved; outputs and limitations documented. |
| Settings in browser storage                        | Green   | Real persisted settings added.                                |
| Version/commit/header links                        | Green   | Existing behavior preserved.                                  |
| Live peer-to-peer sync                             | Removed | Reworded as out-of-scope/portable state, not a shipped claim. |

Before counts: green 2, yellow 3, red 2, gray 0. After counts: green 5, yellow 0, red 0, removed 1.
