SHELL := /bin/bash

.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview hooks-pre-commit hooks-commit-msg hooks-pre-push hooks-post-merge hooks-post-checkout release clean

help:
	@printf "Targets:\n"
	@printf "  make install-hooks     Wire .githooks\n"
	@printf "  make dev               Run the Vite dev server\n"
	@printf "  make build             Build GitHub Pages output into docs/\n"
	@printf "  make data              Mode A no-op\n"
	@printf "  make test              Run unit tests\n"
	@printf "  make smoke             Build and run Playwright smoke test\n"
	@printf "  make lint              Run lint, format check, audit, and type check\n"
	@printf "  make fmt               Format files\n"
	@printf "  make pages-preview     Serve docs/ as GitHub Pages preview\n"
	@printf "  make release           Tag v$$(node -p \"require('./package.json').version\")\n"

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev:
	npm run dev

build:
	npm run build

data:
	@printf "Mode A: no static data pipeline is required.\n"

test:
	npm run test

test-integration:
	@printf "No separate integration suite for Mode A v1.\n"

smoke:
	./scripts/smoke.sh

lint:
	npm run lint
	npm run fmt:check
	npm exec tsc -- -b --pretty false
	npm audit --audit-level=high

fmt:
	npm run fmt

pages-preview:
	npm run pages-preview

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push

hooks-post-merge:
	.githooks/post-merge

hooks-post-checkout:
	.githooks/post-checkout

release:
	git tag "v$$(node -p "require('./package.json').version")"

clean:
	rm -rf coverage docs/app-assets docs/index.html docs/404.html docs/version.json
