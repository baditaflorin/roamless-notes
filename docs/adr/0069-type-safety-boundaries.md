# 0069 Type Safety Policy At Boundaries

## Status

Accepted

## Context

External inputs include files, clipboard text, URL responses, DuckDB rows, and Transformer tensors.

## Decision

Validate JSON/file boundaries with Zod. Keep unavoidable casts only inside named boundary modules with comments and exported typed functions.

## Consequences

Application code sees typed data and boundary risk is localized.

## Alternatives Considered

Using unsafe broad types for speed was rejected.
