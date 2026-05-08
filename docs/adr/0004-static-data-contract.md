# 0004 Static Data Contract

## Status

Accepted

## Context

Mode A has no server data. The only static data is app metadata and optional demo seed content compiled into the bundle.

## Decision

Keep static artifacts in `docs/` after build. `docs/version.json` exposes version, source commit, repository URL, and build time.

## Consequences

The frontend can display version and commit without contacting an API.

## Alternatives Considered

Mode B JSON artifacts were rejected because v1 user data is private and local.
