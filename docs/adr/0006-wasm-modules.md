# 0006 WASM Modules

## Status

Accepted

## Context

DuckDB and local model inference require WASM or WebGPU-backed browser runtimes.

## Decision

Lazy-load DuckDB-WASM for SQL exploration. Lazy-load Transformers.js only when semantic search or local summarization is requested.

## Consequences

GitHub Pages can host the app, but browser model downloads remain opt-in.

## Alternatives Considered

Server-side inference was rejected because it violates the local-first v1 constraint.
