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
  plugins: [react(), themeInitScript()],
  css: cssOptions,
  resolve: {
    // The docs consume library sources for fast feedback; the packed tarball is verified separately (apps/playground).
    alias: [
      { find: /^@dev-community\/ui\/theme$/, replacement: ui('src/theme/server.ts') },
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