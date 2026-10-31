import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { cssOptions } from '../build/css.ts';

const src = (p: string) => fileURLToPath(new URL(`../src/${p}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  css: cssOptions,
  resolve: {
    alias: [
      { find: /^@dev-community\/ui\/theme$/, replacement: src('theme/server.ts') },
      { find: /^@dev-community\/ui\/editor$/, replacement: src('editor.ts') },
      { find: /^@dev-community\/ui\/patterns$/, replacement: src('patterns-entry.ts') },
      { find: /^@dev-community\/ui\/widgets$/, replacement: src('widgets.ts') },
      { find: /^@dev-community\/ui$/, replacement: src('index.ts') },
    ],
  },
});
