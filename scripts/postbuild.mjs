import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'

const indexPath = 'docs/index.html'
const fallbackPath = 'docs/404.html'

if (!existsSync(indexPath)) {
  throw new Error('docs/index.html was not generated')
}

const html = readFileSync(indexPath, 'utf8')

if (!html.includes('/roamless-notes/app-assets/')) {
  throw new Error('docs/index.html does not reference the GitHub Pages base path')
}

copyFileSync(indexPath, fallbackPath)

const gitValue = (command, fallback) => {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch {
    return fallback
  }
}

writeFileSync(
  'docs/version.json',
  `${JSON.stringify(
    {
      buildTime: globalThis.__APP_BUILD_TIME__ ?? new Date().toISOString(),
      commit: gitValue('git rev-parse --short HEAD', 'local'),
      repository: 'https://github.com/baditaflorin/roamless-notes',
      version: process.env.npm_package_version ?? '0.1.0',
    },
    null,
    2,
  )}\n`,
)
