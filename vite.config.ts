import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'

const repoName = 'roamless-notes'

const fromGit = (command: string, fallback: string) => {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch {
    return fallback
  }
}

const commit = fromGit('git rev-parse --short HEAD', 'local')
const version = process.env.npm_package_version ?? '0.1.0'

// https://vite.dev/config/
export default defineConfig({
  base: `/${repoName}/`,
  define: {
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __APP_COMMIT__: JSON.stringify(commit),
    __APP_REPOSITORY_URL__: JSON.stringify(
      'https://github.com/baditaflorin/roamless-notes',
    ),
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    assetsDir: 'app-assets',
    emptyOutDir: false,
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@duckdb/duckdb-wasm')) {
            return 'duckdb'
          }

          if (id.includes('@huggingface/transformers')) {
            return 'transformers'
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }

          return undefined
        },
      },
    },
    sourcemap: true,
  },
  plugins: [react(), tailwindcss()],
})
