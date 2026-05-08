import { rmSync } from 'node:fs'

for (const path of ['docs/app-assets', 'docs/index.html', 'docs/404.html']) {
  rmSync(path, { force: true, recursive: true })
}
