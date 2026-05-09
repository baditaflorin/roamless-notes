# 0061 Input Pathway Coverage Policy

## Status

Accepted

## Context

Users have existing notes in plain text, Markdown, HTML, exported JSON, clipboard contents, and small shared URLs.

## Decision

Support JSON, Markdown, text, HTML, paste, clipboard read, drag/drop, multi-file upload, URL fetch where CORS permits, demo load, fresh workspace, autosave restore, and small hash share imports.

Image OCR, attachments, and folder import stay out of scope for Mode A v1.

## Consequences

Every supported pathway routes through the same parser and workspace import boundary.

## Alternatives Considered

JSON-only import was rejected as too app-specific for strangers.
