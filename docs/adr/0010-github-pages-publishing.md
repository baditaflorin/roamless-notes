# 0010 GitHub Pages Publishing

## Status

Accepted

## Context

The live URL is a first-class deliverable and GitHub Pages must work from day one.

## Decision

Publish from `main` branch `/docs`. Vite writes `docs/index.html`, `docs/404.html`, and `docs/app-assets/` while preserving documentation files in `docs/`.

## Consequences

`docs/` is not gitignored. `dist/` remains ignored because it is not the publish directory.

## Alternatives Considered

A `gh-pages` branch was rejected to keep source and published artifacts visible in one branch.
