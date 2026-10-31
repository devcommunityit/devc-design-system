import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { DocsLang, Localized } from '../i18n/lang';

/** Sidebar area and group the guide belongs to. */
export type GuideGroup = 'start' | 'foundations' | 'develop' | 'design' | 'project';

export interface GuideEntry {
  slug: string;
  title: Localized;
  description: Localized;
  group: GuideGroup;
}

export const GUIDES: GuideEntry[] = [
  {
    slug: 'quick-start',
    title: { it: 'Quick start', en: 'Quick start' },
    description: { it: 'Il primo componente in cinque minuti.', en: 'Your first component in five minutes.' },
    group: 'start',
  },
  {
    slug: 'installazione',
    title: { it: 'Installazione', en: 'Installation' },
    description: { it: 'Registry pubblico o privato, peer dependencies e stili.', en: 'Public or private registry, peer dependencies and styles.' },
    group: 'start',
  },
  {
    slug: 'integrazione',
    title: { it: 'Integrazione nei portali', en: 'Integrating into portals' },
    description: {
      it: 'Vite, router, provider annidati, coesistenza con CSS esistenti.',
      en: 'Vite, routers, nested providers, coexisting with existing CSS.',
    },
    group: 'start',
  },
  {
    slug: 'fondamenta',
    title: { it: 'Fondamenta visive', en: 'Visual foundations' },
    description: {
      it: 'Colore, tipografia, spaziatura, elevazione, motion e breakpoint.',
      en: 'Color, typography, spacing, elevation, motion and breakpoints.',
    },
    group: 'foundations',
  },
  {
    slug: 'token',
    title: { it: 'Design token', en: 'Design tokens' },
    description: { it: 'Token primitivi e semantici, naming, output generati.', en: 'Primitive and semantic tokens, naming, generated outputs.' },
    group: 'foundations',
  },
  {
    slug: 'temi',
    title: { it: 'Temi', en: 'Themes' },
    description: {
      it: 'Modalità, palette, densità, createTheme, persistenza e JSON.',
      en: 'Modes, palettes, density, createTheme, persistence and JSON.',
    },
    group: 'foundations',
  },
  {
    slug: 'accessibilita',
    title: { it: 'Accessibilità', en: 'Accessibility' },
    description: {
      it: 'Obiettivi WCAG 2.2 AA, cosa è verificato e cosa resta al consumer.',
      en: 'WCAG 2.2 AA goals, what is verified and what is left to the consumer.',
    },
    group: 'foundations',
  },
  {
    slug: 'grafici-dashboard',
    title: { it: 'Grafici e dashboard', en: 'Charts and dashboards' },
    description: {
      it: 'Scegliere il grafico, colori dei dati, accessibilità e composizione di una dashboard.',
      en: 'Choosing a chart, data colors, accessibility and composing a dashboard.',
    },
    group: 'develop',
  },
  {
    slug: 'stati-di-caricamento',
    title: { it: 'Stati di caricamento', en: 'Loading states' },
    description: {
      it: 'Skeleton dei componenti con isLoading, preset e un solo annuncio per area.',
      en: 'Component skeletons with isLoading, presets and a single announcement per area.',
    },
    group: 'develop',
  },
  {
    slug: 'ai-content',
    title: { it: 'AI e gestione contenuti', en: 'AI and content management' },
    description: {
      it: 'Assistenti componibili, feedback, fonti e strumenti editoriali senza backend impliciti.',
      en: 'Composable assistants, feedback, sources and editorial tools with no implicit backend.',
    },
    group: 'develop',
  },
  {
    slug: 'localizzazione-rtl',
    title: { it: 'Localizzazione e RTL', en: 'Localization and RTL' },
    description: { it: 'LocaleProvider, messaggi traducibili, Intl, proprietà logiche.', en: 'LocaleProvider, translatable messages, Intl, logical properties.' },
    group: 'develop',
  },
  {
    slug: 'ssr-nextjs',
    title: { it: 'SSR e Next.js', en: 'SSR and Next.js' },
    description: { it: 'Confini client, flash del tema, hydration e CSP.', en: 'Client boundaries, theme flash, hydration and CSP.' },
    group: 'develop',
  },
  {
    slug: 'personalizzazione',
    title: { it: 'Personalizzazione', en: 'Customization' },
    description: { it: 'className, data attribute, token e override sicuri.', en: 'className, data attributes, tokens and safe overrides.' },
    group: 'develop',
  },
  {
    slug: 'figma',
    title: { it: 'Figma e design token', en: 'Figma and design tokens' },
    description: {
      it: 'Stato reale degli artefatti design e procedura di importazione.',
      en: 'Actual state of the design artifacts and how to import them.',
    },
    group: 'design',
  },
  {
    slug: 'troubleshooting',
    title: { it: 'Troubleshooting', en: 'Troubleshooting' },
    description: { it: 'Problemi frequenti e soluzioni.', en: 'Common problems and solutions.' },
    group: 'project',
  },
  {
    slug: 'contribuire',
    title: { it: 'Contribuire', en: 'Contributing' },
    description: { it: 'Struttura del repository, convenzioni e checklist.', en: 'Repository structure, conventions and checklist.' },
    group: 'project',
  },
  {
    slug: 'changelog',
    title: { it: 'Changelog e migrazioni', en: 'Changelog and migrations' },
    description: {
      it: 'Versioni, politica semver e migrazioni dello schema dei temi.',
      en: 'Versions, semver policy and theme schema migrations.',
    },
    group: 'project',
  },
];

const modules = import.meta.glob<{ default: ComponentType }>('../guides/*.tsx');
const enModules = import.meta.glob<{ default: ComponentType }>('../guides/en/*.tsx');

export function findGuide(slug: string | undefined): GuideEntry | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** True when the guide body exists in `lang` (Italian is the source; other languages fall back to it). */
export function hasGuideTranslation(slug: string, lang: DocsLang): boolean {
  return lang === 'it' || `../guides/en/${slug}.tsx` in enModules;
}

function lazyBody(loader: (() => Promise<{ default: ComponentType }>) | undefined, slug: string) {
  return lazy(() => (loader ? loader() : Promise.reject(new Error(`Guide not found: ${slug}`))));
}

/** One lazy component per guide and language, created once at module scope (loading starts on first render). */
export const GUIDE_COMPONENTS: Record<DocsLang, Record<string, LazyExoticComponent<ComponentType>>> = {
  it: Object.fromEntries(GUIDES.map((g) => [g.slug, lazyBody(modules[`../guides/${g.slug}.tsx`], g.slug)])),
  en: Object.fromEntries(
    GUIDES.map((g) => [g.slug, lazyBody(enModules[`../guides/en/${g.slug}.tsx`] ?? modules[`../guides/${g.slug}.tsx`], g.slug)]),
  ),
};
