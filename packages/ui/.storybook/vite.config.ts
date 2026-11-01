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
      { find: /^@devcommunityit\/ui\/theme$/, replacement: src('theme/server.ts') },
      { find: /^@devcommunityit\/ui\/editor$/, replacement: src('editor.ts') },
      { find: /^@devcommunityit\/ui\/patterns$/, replacement: src('patterns-entry.ts') },
      { find: /^@devcommunityit\/ui\/widgets$/, replacement: src('widgets.ts') },
      { find: /^@devcommunityit\/ui$/, replacement: src('index.ts') },
    ],
  },
});
