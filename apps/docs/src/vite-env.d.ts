/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `'true'` when Storybook is published at `<base>/storybook/` (GitHub Pages build). */
  readonly VITE_STORYBOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
