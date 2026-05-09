# 0068 Persistence Schema And Migration Policy

## Status

Accepted

## Context

The v0.1 IndexedDB snapshot was a raw Yjs update with no app schema metadata.

## Decision

Move to a v2 workspace state envelope for exports and store metadata, while still reading existing v1 block-only exports and existing Yjs snapshots. New exports include `schemaVersion`, `exportedAt`, `blocks`, `settings`, and `selectedId`.

## Consequences

Older users are migrated without data loss, and future breaking changes have a versioned boundary.

## Alternatives Considered

Discarding old snapshots was rejected.
