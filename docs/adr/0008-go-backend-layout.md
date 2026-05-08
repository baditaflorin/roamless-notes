# 0008 Go Backend Layout

## Status

Accepted

## Context

Mode A has no Go backend.

## Decision

Skip Go project layout in v1.

## Consequences

No `cmd/`, `internal/`, Dockerfile, migrations, or runtime API are created.

## Alternatives Considered

A local generator backend was rejected because no static data pipeline is needed.
