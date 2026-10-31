/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `'true'` when Storybook is published at `<base>/storybook/` (GitHub Pages build). */
  readonly VITE_STORYBOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'virtual:dc-en-summaries' {
  export const SUMMARIES: Record<string, string>;
  export const EXAMPLE_TITLES: Record<string, Record<string, { title: string; description?: string }>>;
}
