# 0009 Configuration And Secrets

## Status

Accepted

## Context

The frontend must not contain secrets.

## Decision

Use build-time public constants only: version, commit, repository URL, and Pages base path. Keep `.env.example` placeholder-only.

## Consequences

No secret management service is needed.

## Alternatives Considered

Runtime configuration files were rejected because v1 has no deployment secrets.
