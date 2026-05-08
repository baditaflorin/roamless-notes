# Security Policy

## Supported Versions

The current `main` branch and latest semver tag are supported.

## Reporting a Vulnerability

Use GitHub private vulnerability reporting at `https://github.com/baditaflorin/roamless-notes/security/advisories/new`.

Fallback contact: `baditaflorin@users.noreply.github.com`.

Please include reproduction steps, affected browser/version, and whether the issue can expose local note data.

## Security Baseline

- No runtime backend.
- No frontend secrets.
- Browser storage only.
- `gitleaks` runs in the pre-commit hook.
- `npm audit --audit-level=high` is part of the local lint flow.
