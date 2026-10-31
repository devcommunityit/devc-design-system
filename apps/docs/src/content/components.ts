import type { ComponentType } from 'react';
import type { ComponentCategory, ComponentDoc } from '@ui-src/docs-meta/types';
import type { DocsLang } from '../i18n/lang';

const metaModules = import.meta.glob<{ doc: ComponentDoc }>(
  ['../../../../packages/ui/src/components/**/*.meta.ts', '../../../../packages/ui/src/patterns/**/*.meta.ts'],
  { eager: true },
);
const exampleModules = import.meta.glob<Record<string, unknown>>([
  '../../../../packages/ui/src/components/**/*.examples.tsx',
  '../../../../packages/ui/src/patterns/**/*.examples.tsx',
]);
const exampleSources = import.meta.glob<string>(
  ['../../../../packages/ui/src/components/**/*.examples.tsx', '../../../../packages/ui/src/patterns/**/*.examples.tsx'],
  { query: '?raw', import: 'default' },
);

export interface ComponentEntry {
  doc: ComponentDoc;
  /** Glob key of the sibling examples file (same basename as the meta file). */
  examplesKey: string | null;
}

/** Italian labels: also used for Storybook story ids, so they must not change with the portal language. */
export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  layout: 'Layout',
  typography: 'Tipografia',
  actions: 'Azioni',
  navigation: 'Navigazione',
  forms: 'Form',
  data: 'Contenuti e dati',
  charts: 'Grafici',
  dashboard: 'Dashboard',
  ai: 'AI',
  website: 'Gestione siti',
  community: 'Community',
  editor: 'Editor',
  feedback: 'Feedback',
  overlay: 'Overlay',
  patterns: 'Pattern',
};

const CATEGORY_LABELS_EN: Record<ComponentCategory, string> = {
  layout: 'Layout',
  typography: 'Typography',
  actions: 'Actions',
  navigation: 'Navigation',
  forms: 'Forms',
  data: 'Content and data',
  charts: 'Charts',
  dashboard: 'Dashboard',
  ai: 'AI',
  website: 'Website management',
  community: 'Community',
  editor: 'Editor',
  feedback: 'Feedback',
  overlay: 'Overlays',
  patterns: 'Page patterns',
};

export function categoryLabel(category: ComponentCategory, lang: DocsLang): string {
  return (lang === 'en' ? CATEGORY_LABELS_EN : CATEGORY_LABELS)[category];
}

/** Sidebar groups: everyday building blocks first, then data, then product-specific families. Page patterns live in the Patterns area. */
export const CATEGORY_GROUPS: Array<{ id: 'base' | 'data' | 'product'; categories: ComponentCategory[] }> = [
  { id: 'base', categories: ['layout', 'typography', 'actions', 'navigation', 'forms', 'feedback', 'overlay'] },
  { id: 'data', categories: ['data', 'charts', 'dashboard'] },
  { id: 'product', categories: ['ai', 'editor', 'website', 'community'] },
];

export const CATEGORY_ORDER: ComponentCategory[] = [...CATEGORY_GROUPS.flatMap((g) => g.categories), 'patterns'];

export const components: ComponentEntry[] = Object.entries(metaModules)
  .map(([path, mod]) => {
    const examplesKey = path.replace(/\.meta\.ts$/, '.examples.tsx');
    return { doc: mod.doc, examplesKey: examplesKey in exampleModules ? examplesKey : null };
  })
  .sort((a, b) => a.doc.name.localeCompare(b.doc.name, 'it'));

export function findComponent(slug: string | undefined): ComponentEntry | undefined {
  return components.find((c) => c.doc.slug === slug);
}

export function componentsByCategory(lang: DocsLang = 'it'): Array<{ category: ComponentCategory; label: string; items: ComponentEntry[] }> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: categoryLabel(category, lang),
    items: components.filter((c) => c.doc.category === category),
  })).filter((group) => group.items.length > 0);
}

export interface LoadedExamples {
  module: Record<string, unknown>;
  source: string;
}

const cache = new Map<string, Promise<LoadedExamples>>();

/** Loads (once) the examples module and its raw source. Stable promise for React `use()`. */
export function loadExamples(key: string): Promise<LoadedExamples> {
  const cached = cache.get(key);
  if (cached) return cached;
  const loadModule = exampleModules[key];
  const loadSource = exampleSources[key];
  const promise =
    loadModule && loadSource
      ? Promise.all([loadModule(), loadSource()]).then(([module, source]) => ({ module, source }))
      : Promise.reject(new Error(`Examples not found: ${key}`));
  cache.set(key, promise);
  return promise;
}

export function isComponent(value: unknown): value is ComponentType {
  return typeof value === 'function';
}