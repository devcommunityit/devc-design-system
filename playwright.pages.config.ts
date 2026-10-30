import { defineConfig, devices } from '@playwright/test';

const PORT = 4174;
/** Must match the base used for the build: `npm run build:pages -- --base /design-system/`. */
export const PAGES_BASE = process.env.PAGES_BASE ?? '/design-system/';

/**
 * Browser tests of the GitHub Pages build (project site under a sub-path), served by a
 * static server that behaves like Pages: no rewrites, 404.html with status 404.
 */
export default defineConfig({
  testDir: 'e2e-pages',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
    locale: 'it-IT',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node scripts/preview-pages.mjs --base ${PAGES_BASE}`,
    url: `http://localhost:${PORT}${PAGES_BASE}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: { PORT: String(PORT) },
  },
});
