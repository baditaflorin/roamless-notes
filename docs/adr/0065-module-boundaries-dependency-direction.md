# 0065 Module Boundaries And Dependency Direction

## Status

Accepted

## Context

The app is small but Phase 3 adds enough paths that dependency direction matters.

## Decision

Use one-way dependencies: components -> features -> lib/types. Store code may import schema/persistence helpers; parsing/export helpers may import domain types; feature code must not import UI components.

## Consequences

Import/export logic becomes testable outside React.

## Alternatives Considered

Keeping all logic in components was rejected because it prevents real-user path testing.
