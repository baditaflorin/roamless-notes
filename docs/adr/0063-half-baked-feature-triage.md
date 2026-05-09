# 0063 Half-Baked Feature Triage

## Status

Accepted

## Context

Phase 3 requires finishing, hiding, or deleting incomplete features.

## Decision

- Finish JSON import/export as full workspace state.
- Finish DuckDB lab with copy/download results.
- Finish semantic summary/search with copyable output and clearer errors.
- Split destructive demo reset into load demo and start fresh.
- Delete/reword live P2P sync claims; keep CRDT-safe portable state wording.

## Consequences

The production UI should not contain placeholder controls or claims that imply live sync.

## Alternatives Considered

Hiding semantic and DuckDB tools was rejected because they are real opt-in tools and only needed output/error completion.
