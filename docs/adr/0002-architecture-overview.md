# 0002 Architecture Overview

## Status

Accepted

## Context

The app needs editing, links, graph exploration, local search, and optional local AI without a server.

## Decision

Split modules by feature: notes, search, query, graph, DuckDB, semantic tools, shell UI, and shared utilities.

## Consequences

Feature modules can evolve independently, and heavy modules can stay behind dynamic imports.

## Alternatives Considered

A single app module was rejected because local persistence and search need focused tests.
