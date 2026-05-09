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

Before counts: green 2, yellow 3, red 2, gray 0.
