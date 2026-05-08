# 0011 Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs.

## Decision

Use minimal browser console output in development. Production errors are shown in UI toasts or panels.

## Consequences

No PII or note contents are logged intentionally.

## Alternatives Considered

Client log collection was rejected for privacy.
