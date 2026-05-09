# 0066 Error Handling Convention

## Status

Accepted

## Context

Several v0.1 actions failed silently or exposed raw implementation messages.

## Decision

Async UI actions report user-visible notices with a stable severity, title, and message. Boundary modules throw typed, human-readable errors; UI catches and reports them.

## Consequences

Users know whether import/export/copy/search actions succeeded and how to recover from failure.

## Alternatives Considered

Console logging was rejected because production users do not inspect devtools.
