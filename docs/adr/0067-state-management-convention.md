# 0067 State Management Convention

## Status

Accepted

## Context

Notes are persistent, while panels and transient notices are UI state.

## Decision

Keep note blocks, selected block, and settings in `NoteStore` persisted to IndexedDB. Keep tab selection, drafts, busy states, and notices in React component state.

## Consequences

Reload restores meaningful work without persisting short-lived UI activity.

## Alternatives Considered

Persisting every panel field was rejected because it creates migration noise without user value.
