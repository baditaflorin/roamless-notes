# 0064 DRY Consolidation Map

## Status

Accepted

## Context

Phase 3 adds many input/output paths that would otherwise duplicate parsing, downloading, copying, and validation.

## Decision

Create shared modules for workspace schema, import parsing, export formatting, browser IO helpers, and notices.

## Consequences

UI components call small application functions instead of owning file parsing and download mechanics.

## Alternatives Considered

A broad abstraction framework was rejected; only repeated concrete behavior is centralized.
