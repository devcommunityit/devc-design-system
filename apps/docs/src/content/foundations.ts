import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type FoundationSlug = 'typography' | 'spacing' | 'rounded' | 'colors' | 'shadows';

export interface FoundationEntry {
  slug: FoundationSlug;
  title: string;
  description: string;
}

export const FOUNDATIONS: FoundationEntry[] = [
  { slug: 'typography', title: 'Typography', description: 'Gerarchie tipografiche, scale e ruoli semantici.' },
  { slug: 'spacing', title: 'Spacing', description: 'Scala coerente per spazi, layout e ritmo visivo.' },
  { slug: 'rounded', title: 'Rounded', description: 'Raggi e forme per controlli, superfici e contenuti.' },
  { slug: 'colors', title: 'Colors', description: 'Ruoli colore semantici che si adattano a temi e modalità.' },
  { slug: 'shadows', title: 'Shadows', description: 'Livelli di elevazione e superfici.' },
];

const modules = import.meta.glob<{ default: ComponentType }>('../foundations/*.tsx');

export const FOUNDATION_COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = Object.fromEntries(
  FOUNDATIONS.map((foundation) => {
    const loader = modules[`../foundations/${foundation.slug}.tsx`];
    return [foundation.slug, lazy(() => (loader ? loader() : Promise.reject(new Error(`Foundation not found: ${foundation.slug}`))))];
  }),
);

export function findFoundation(slug: string | undefined): FoundationEntry | undefined {
  return FOUNDATIONS.find((foundation) => foundation.slug === slug);
}
