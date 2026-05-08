# 0017 Dependency Policy

## Status

Accepted

## Context

The app depends on browser storage, search, WASM, and model libraries.

## Decision

Use production-ready packages with active maintenance and keep `npm audit --audit-level=high` clean.

## Consequences

The older `@xenova/transformers` package is not used because its dependency tree currently audits critical.

## Alternatives Considered

Hand-written full-text search and custom embeddings were rejected.
