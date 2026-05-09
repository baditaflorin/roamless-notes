# 0062 Output Pathway Coverage Policy

## Status

Accepted

## Context

A local notes tool must let users leave with useful data formats.

## Decision

Support full JSON state, Markdown, CSV, clipboard copy, small hash share links, and browser print/PDF. Screenshot, embed code, and API/curl output are out of scope for Mode A v1.

## Consequences

The export boundary becomes stable, documented, and testable.

## Alternatives Considered

Keeping JSON-only export was rejected because it traps work in an app-specific shape.
