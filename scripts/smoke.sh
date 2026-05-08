#!/usr/bin/env bash
set -euo pipefail

npm run build
npx playwright test --config playwright.config.ts
