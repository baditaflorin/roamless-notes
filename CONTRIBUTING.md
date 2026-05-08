# Contributing

Thanks for improving Roamless Notes.

## Local Workflow

1. Run `npm install`.
2. Run `make install-hooks`.
3. Use Conventional Commits, for example `feat: add graph filter`.
4. Run `make test` and `make build` before pushing.

## Standards

- Keep the app static and GitHub Pages compatible.
- Prefer browser-native storage and local computation.
- Add or update an ADR before changing architecture.
- Do not commit secrets, generated credentials, private keys, or real `.env` files.
