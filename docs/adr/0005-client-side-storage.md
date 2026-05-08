# 0005 Client Side Storage

## Status

Accepted

## Context

Notes must survive reloads and work offline.

## Decision

Store the encoded Yjs document snapshot in IndexedDB. Use localStorage only for small UI preferences when needed.

## Consequences

The data model remains CRDT-compatible while storage stays browser-native.

## Alternatives Considered

OPFS was deferred until notebooks become large enough to require file-like storage.
