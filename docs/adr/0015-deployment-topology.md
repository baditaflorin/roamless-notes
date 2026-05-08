# 0015 Deployment Topology

## Status

Accepted

## Context

Mode A uses GitHub Pages only.

## Decision

Serve the app from `https://baditaflorin.github.io/roamless-notes/` with no runtime backend.

## Consequences

There is no `deploy/` directory for Docker, nginx, or Prometheus.

## Alternatives Considered

Docker Compose was rejected as unnecessary for v1.
