import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { DocsLang, Localized } from '../i18n/lang';

export type FoundationSlug = 'typography' | 'spacing' | 'rounded' | 'colors' | 'shadows';

export interface FoundationEntry {
  slug: FoundationSlug;
  title: Localized;
  description: Localized;
}

export const FOUNDATIONS: FoundationEntry[] = [
  {
    slug: 'typography',
    title: { it: 'Tipografia', en: 'Typography' },
    description: { it: 'Gerarchie tipografiche, scale e ruoli semantici.', en: 'Type hierarchies, scales and semantic roles.' },
  },
  {
    slug: 'spacing',
    title: { it: 'Spaziatura', en: 'Spacing' },
    description: { it: 'Scala coerente per spazi, layout e ritmo visivo.', en: 'A consistent scale for spacing, layout and visual rhythm.' },
  },
  {
    slug: 'rounded',
    title: { it: 'Arrotondamenti', en: 'Rounded corners' },
    description: { it: 'Raggi e forme per controlli, superfici e contenuti.', en: 'Radii and shapes for controls, surfaces and content.' },
  },
  {
    slug: 'colors',
    title: { it: 'Colori', en: 'Colors' },
    description: { it: 'Ruoli colore semantici che si adattano a temi e modalità.', en: 'Semantic color roles that adapt to themes and modes.' },
  },
  {
    slug: 'shadows',
    title: { it: 'Ombre', en: 'Shadows' },
    description: { it: 'Livelli di elevazione e superfici.', en: 'Elevation levels and surfaces.' },
  },
];

const modules = import.meta.glob<{ default: ComponentType }>('../foundations/*.tsx');
const enModules = import.meta.glob<{ default: ComponentType }>('../foundations/en/*.tsx');

function lazyBody(loader: (() => Promise<{ default: ComponentType }>) | undefined, slug: string) {
  return lazy(() => (loader ? loader() : Promise.reject(new Error(`Foundation not found: ${slug}`))));
}

export function hasFoundationTranslation(slug: string, lang: DocsLang): boolean {
  return lang === 'it' || `../foundations/en/${slug}.tsx` in enModules;
}

/** One lazy body per foundation and language; English falls back to the Italian page. */
export const FOUNDATION_COMPONENTS: Record<DocsLang, Record<string, LazyExoticComponent<ComponentType>>> = {
  it: Object.fromEntries(FOUNDATIONS.map((f) => [f.slug, lazyBody(modules[`../foundations/${f.slug}.tsx`], f.slug)])),
  en: Object.fromEntries(
    FOUNDATIONS.map((f) => [f.slug, lazyBody(enModules[`../foundations/en/${f.slug}.tsx`] ?? modules[`../foundations/${f.slug}.tsx`], f.slug)]),
  ),
};

export function findFoundation(slug: string | undefined): FoundationEntry | undefined {
  return FOUNDATIONS.find((foundation) => foundation.slug === slug);
}
