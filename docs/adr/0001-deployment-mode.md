# 0001 Deployment Mode

## Status

Accepted

## Context

The product is explicitly local-first and should avoid hosted accounts, secrets, and runtime servers in v1.

## Decision

Use Mode A: Pure GitHub Pages. The app is a static React bundle served from `docs/`, with all notes, indexes, and model work running in the browser.

## Consequences

- No backend, Docker, nginx, server metrics, or API secrets in v1.
- Cross-device live sync is not a v1 requirement.
- Heavy engines are lazy-loaded so the initial app stays usable.

## Alternatives Considered

- Mode B was unnecessary because v1 has no shared data pipeline.
- Mode C was rejected because mutations and storage are local.
