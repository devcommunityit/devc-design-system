/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cssOptions } from './build/css.ts';

const externals = [
  'react',
  'react-dom',
  'react-aria',
  'react-aria-components',
  'react-stately',
  '@internationalized/date',
  'lucide-react',
  '@material/material-color-utilities',
  '@tiptap',
  '@floating-ui/dom',
];

const isExternal = (id: string) => externals.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
  plugins: [react()],
  css: cssOptions,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: 'src/index.ts',
        'theme/server': 'src/theme/server.ts',
        editor: 'src/editor.ts',
        patterns: 'src/patterns-entry.ts',
        widgets: 'src/widgets.ts',
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Only React component modules are client modules; pure .ts modules stay usable in RSC.
        banner: (chunk) => (chunk.facadeModuleId?.endsWith('.tsx') ? "'use client';" : ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./test/setup.ts'],
    alias: { '@devcommunityit/ui/editor': new URL('./src/editor.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), '@devcommunityit/ui/patterns': new URL('./src/patterns-entry.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), '@devcommunityit/ui/widgets': new URL('./src/widgets.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), '@devcommunityit/ui/theme': new URL('./src/theme/server.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), '@devcommunityit/ui': new URL('./src/index.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') },
    css: { modules: { classNameStrategy: 'non-scoped' } },
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
  },
});
