import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/**
 * Browser tests against the production build of the docs site (`npm run build:docs` first).
 * The packed library is verified separately by `npm run verify:package`.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    // Deterministic rendering: no transitions to wait for, stable screenshots on failure.
    reducedMotion: 'reduce',
    locale: 'it-IT',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -w @dev-community/docs',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
