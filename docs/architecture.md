# Architecture

Roamless Notes is a Mode A GitHub Pages application.

```mermaid
C4Context
  title Roamless Notes Context
  Person(user, "Knowledge worker", "Writes and queries private notes")
  System_Boundary(pages, "GitHub Pages") {
    System(staticApp, "Roamless Notes", "Static React app")
  }
  System_Ext(github, "GitHub Repository", "Source, releases, stars")
  Rel(user, staticApp, "Uses in browser")
  Rel(staticApp, github, "Links to repo")
```

```mermaid
flowchart TB
  subgraph "GitHub Pages Boundary"
    App["React TypeScript app"]
    SW["Service worker"]
    Manifest["Web app manifest"]
  end
  subgraph "Browser Local Boundary"
    YDoc["Yjs CRDT document"]
    IDB["IndexedDB snapshot"]
    FullText["MiniSearch index"]
    DuckDB["DuckDB-WASM"]
    Transformers["Transformers.js"]
  end
  App --> YDoc
  YDoc --> IDB
  App --> FullText
  App --> DuckDB
  App --> Transformers
  SW --> App
```

## Module Boundaries

- `src/features/notes` owns CRDT state, persistence, and block editing.
- `src/features/search` owns full-text indexing.
- `src/features/query` owns the compact query language.
- `src/features/graph` owns graph derivation and SVG rendering.
- `src/features/semantic` owns lazy local model loading.
- `src/features/duckdb` owns lazy DuckDB-WASM initialization.
- `src/features/workspace` owns import parsing, export formatting, and workspace schema migration.
- `src/lib/browserIo.ts` owns browser download, clipboard, and share URL helpers.
