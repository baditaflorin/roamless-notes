import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4187',
    trace: 'on-first-retry',
  },
  webServer: {
    command:
      'npm run pages-preview -- --host 127.0.0.1 --port 4187 --strictPort',
    reuseExistingServer: false,
    timeout: 20_000,
    url: 'http://127.0.0.1:4187/roamless-notes/',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
