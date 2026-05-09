#!/usr/bin/env bash
set -euo pipefail

if [[ "${SKIP_SMOKE_BUILD:-0}" != "1" ]]; then
  npm run build
fi
npx playwright test --config playwright.config.ts
