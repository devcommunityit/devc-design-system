import type { ComponentType } from 'react';
import type { ComponentCategory, ComponentDoc } from '@ui-src/docs-meta/types';

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

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  layout: 'Layout',
  typography: 'Tipografia',
  actions: 'Azioni',
  navigation: 'Navigazione',
  forms: 'Form',
  data: 'Contenuti e dati',
  charts: 'Grafici',
  dashboard: 'Dashboard',
  feedback: 'Feedback',
  overlay: 'Overlay',
  patterns: 'Pattern',
};

export const CATEGORY_ORDER: ComponentCategory[] = ['layout', 'typography', 'actions', 'navigation', 'forms', 'data', 'charts', 'dashboard', 'feedback', 'overlay', 'patterns'];

export const components: ComponentEntry[] = Object.entries(metaModules)
  .map(([path, mod]) => {
    const examplesKey = path.replace(/\.meta\.ts$/, '.examples.tsx');
    return { doc: mod.doc, examplesKey: examplesKey in exampleModules ? examplesKey : null };
  })
  .sort((a, b) => a.doc.name.localeCompare(b.doc.name, 'it'));

export function findComponent(slug: string | undefined): ComponentEntry | undefined {
  return components.find((c) => c.doc.slug === slug);
}

export function componentsByCategory(): Array<{ category: ComponentCategory; label: string; items: ComponentEntry[] }> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
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