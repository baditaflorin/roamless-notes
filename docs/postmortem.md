# Postmortem

Date: 2026-05-08

## Built

Implemented a Mode A GitHub Pages local-first notes app with Yjs CRDT state, IndexedDB persistence, backlinks, graph view, compact query language, full-text search, DuckDB-WASM query lab, and lazy local Transformer semantic tools.

## Was Mode A Correct?

Yes. The core product works without auth, secrets, hosted storage, or a runtime API. DuckDB and local AI are browser-loaded behind explicit user actions, so GitHub Pages remains sufficient.

## What Worked

- GitHub Pages is enough for the v1 surface.
- Yjs snapshots map cleanly to IndexedDB.
- A small query language covers common Roam-style retrieval without a backend.

## What Did Not

- Native Tantivy is not a good fit for plain GitHub Pages today, so v1 uses a provider boundary with MiniSearch.
- Browser local models require large downloads and should stay opt-in.

## Surprises

- The older Transformers.js package had critical audit findings, so the implementation uses the maintained Hugging Face package.

## Accepted Tech Debt

- Peer-to-peer sync is represented by CRDT-safe export/import rather than live WebRTC rooms.
- Semantic model choices are conservative to keep browser compatibility broad.
- The graph layout is deterministic and lightweight, not force-directed.

## Next Improvements

1. Add optional WebRTC sync rooms with user-controlled signaling.
2. Add a Tantivy-WASM provider if the ecosystem stabilizes for static hosting.
3. Add OPFS-backed DuckDB persistence for larger notebooks.

## Estimate

Initial estimate: 1 focused day for v1 scaffold and core browser features. Actual: compressed implementation pass with a deliberately narrow feature set.
