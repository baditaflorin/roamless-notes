# 0014 Error Handling Conventions

## Status

Accepted

## Context

Browser failures should be understandable without a server log.

## Decision

Return typed results from logic modules where practical, catch async UI failures, and surface actionable messages in the app shell.

## Consequences

DuckDB/model-loading errors remain contained to their panels.

## Alternatives Considered

Throwing through React render paths was rejected.
