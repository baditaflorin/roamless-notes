# 0003 Frontend Framework And Build Tooling

## Status

Accepted

## Context

The UI is interactive and needs strict TypeScript, a fast build, and GitHub Pages support.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, Vitest, and Playwright.

## Consequences

The build is simple, static, and friendly to GitHub Pages base paths.

## Alternatives Considered

Svelte and vanilla Web Components were viable, but React has broader ecosystem support for this surface.
