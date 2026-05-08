# 0013 Testing Strategy

## Status

Accepted

## Context

The most important risks are local note transformations, query behavior, and Pages loadability.

## Decision

Use Vitest for unit tests and Playwright for a static happy-path smoke test.

## Consequences

`make test`, `make build`, and `make smoke` are suitable for local hooks.

## Alternatives Considered

Browser-only manual testing was rejected.
