import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from 'vite';
import { cssOptions } from '../../packages/ui/build/css.ts';
import { getThemeScript } from '../../packages/ui/src/theme/persistence.ts';
import { DOCS_DEFAULT_LOOK, DOCS_DEFAULT_THEME } from './src/docs-defaults.ts';

const ui = (p: string) => fileURLToPath(new URL(`../../packages/ui/${p}`, import.meta.url));

/**
 * Serves the pre-paint theme script as an external file (`<base>theme-init.js`), so the site
 * works with a strict `script-src 'self'` CSP without inline scripts or nonces.
 */
function themeInitScript(): Plugin {
  const code = getThemeScript({ defaultMode: 'system', defaultTheme: DOCS_DEFAULT_THEME, defaultLook: DOCS_DEFAULT_LOOK });
  let path = '/theme-init.js';
  const mount = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use(path, (_req, res) => {
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      res.end(code);
    });
  };
  return {
    name: 'dc-theme-init',
    configResolved(config) {
      path = `${config.base}theme-init.js`;
    },
    configureServer: mount,
    configurePreviewServer: mount,
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'theme-init.js', source: code });
    },
  };
}

const OVERLAY_DIR = fileURLToPath(new URL('./src/i18n/en/components/', import.meta.url));
const SUMMARIES_ID = 'virtual:dc-en-summaries';

/**
 * `virtual:dc-en-summaries`: only the English summary and example titles of each component, read from the overlay JSON
 * files at build time. Importing the JSON directly would share it with the full overlays and load ~150 KB gzip for search.
 */
function englishSummaries(): Plugin {
  const resolved = `\0${SUMMARIES_ID}`;
  return {
    name: 'dc-en-summaries',
    resolveId: (id) => (id === SUMMARIES_ID ? resolved : undefined),
    load(id) {
      if (id !== resolved) return undefined;
      const summaries: Record<string, string> = {};
      const examples: Record<string, Record<string, { title: string; description?: string }>> = {};
      for (const file of readdirSync(OVERLAY_DIR).filter((f) => f.endsWith('.json')).sort()) {
        const path = `${OVERLAY_DIR}${file}`;
        this.addWatchFile(path);
        const overlay = JSON.parse(readFileSync(path, 'utf8')) as {
          summary: string;
          examples: Array<{ name: string; title: string; description?: string }>;
        };
        const slug = file.slice(0, -'.json'.length);
        summaries[slug] = overlay.summary;
        examples[slug] = Object.fromEntries(overlay.examples.map((e) => [e.name, { title: e.title, description: e.description }]));
      }
      return `export const SUMMARIES = ${JSON.stringify(summaries)};\nexport const EXAMPLE_TITLES = ${JSON.stringify(examples)};\n`;
    },
  };
}

/**
 * Base path of the deployment: `/` by default, `/<repo>/` for GitHub Pages project sites.
 * Normalised to start and end with `/` (`DOCS_BASE=design-system` → `/design-system/`).
 */
function docsBase(): string {
  const raw = (process.env.DOCS_BASE ?? '/').trim();
  const trimmed = raw.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export default defineConfig({
  base: docsBase(),
  plugins: [react(), themeInitScript(), englishSummaries()],
  css: cssOptions,
  resolve: {
    // The docs consume library sources for fast feedback; the packed tarball is verified separately (apps/playground).
    alias: [
      { find: /^@dev-community\/ui\/theme$/, replacement: ui('src/theme/server.ts') },
      { find: /^@dev-community\/ui\/editor$/, replacement: ui('src/editor.ts') },
      { find: /^@dev-community\/ui\/patterns$/, replacement: ui('src/patterns-entry.ts') },
      { find: /^@dev-community\/ui\/widgets$/, replacement: ui('src/widgets.ts') },
      { find: /^@dev-community\/ui\/reset\.css$/, replacement: ui('src/styles/reset.css') },
      // Explicit, like a consumer: the side-effect CSS import inside src/index.ts is tree-shaken in app builds.
      { find: /^@dev-community\/ui\/styles\.css$/, replacement: ui('src/styles/index.css') },
      { find: /^@dev-community\/ui$/, replacement: ui('src/index.ts') },
      { find: /^@ui-src\//, replacement: `${ui('src')}/` },
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  preview: { port: 4173, strictPort: true },
  server: { port: 5173 },
});