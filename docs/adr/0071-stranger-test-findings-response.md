# 0071 Stranger Test Findings And Response

## Status

Accepted

## Context

Phase 3 requires testing the app as a new user with real input data.

## Decision

Use a fresh browser context with a real Markdown/text notebook fixture. Record all failures in `docs/phase3/stranger-test.md` and fix the top three before release.

## Consequences

The final postmortem must answer whether a stranger can use the app end-to-end without help.

## Alternatives Considered

Only running automated smoke tests was rejected because smoke tests miss confusion and missing affordances.
