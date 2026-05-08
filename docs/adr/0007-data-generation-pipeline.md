# 0007 Data Generation Pipeline

## Status

Accepted

## Context

Mode B would need a static data-generation pipeline. Roamless Notes v1 is Mode A.

## Decision

Skip the data-generation pipeline in v1.

## Consequences

There is no `make data` implementation beyond a no-op target that documents Mode A.

## Alternatives Considered

Prebuilt sample notebooks were considered, but demo content can ship inside the static bundle.
