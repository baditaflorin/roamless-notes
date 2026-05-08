# 0016 Local Git Hooks

## Status

Accepted

## Context

The project does not use GitHub Actions. Checks must run locally.

## Decision

Use plain `.githooks/` scripts wired by `make install-hooks`.

## Consequences

Hooks are inspectable, dependency-light, and easy to run manually through Make targets.

## Alternatives Considered

Lefthook was considered but skipped to avoid another tool dependency.
