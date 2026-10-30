import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type GuideGroup = 'start' | 'foundations' | 'guides';

export interface GuideEntry {
  slug: string;
  title: string;
  description: string;
  group: GuideGroup;
}

export const GUIDES: GuideEntry[] = [
  { slug: 'quick-start', title: 'Quick start', description: 'Il primo componente in cinque minuti.', group: 'start' },
  { slug: 'installazione', title: 'Installazione', description: 'Registry pubblico o privato, peer dependencies e stili.', group: 'start' },
  { slug: 'integrazione', title: 'Integrazione nei portali', description: 'Vite, router, provider annidati, coesistenza con CSS esistenti.', group: 'start' },
  { slug: 'fondamenta', title: 'Fondamenta visive', description: 'Colore, tipografia, spaziatura, elevazione, motion e breakpoint.', group: 'foundations' },
  { slug: 'token', title: 'Design token', description: 'Token primitivi e semantici, naming, output generati.', group: 'foundations' },
  { slug: 'temi', title: 'Temi', description: 'Modalità, palette, densità, createTheme, persistenza e JSON.', group: 'foundations' },
  { slug: 'accessibilita', title: 'Accessibilità', description: 'Obiettivi WCAG 2.2 AA, cosa è verificato e cosa resta al consumer.', group: 'foundations' },
  { slug: 'grafici-dashboard', title: 'Grafici e dashboard', description: 'Scegliere il grafico, colori dei dati, accessibilità e composizione di una dashboard.', group: 'guides' },
  { slug: 'localizzazione-rtl', title: 'Localizzazione e RTL', description: 'LocaleProvider, messaggi traducibili, Intl, proprietà logiche.', group: 'guides' },
  { slug: 'ssr-nextjs', title: 'SSR e Next.js', description: 'Confini client, flash del tema, hydration e CSP.', group: 'guides' },
  { slug: 'personalizzazione', title: 'Personalizzazione', description: 'className, data attribute, token e override sicuri.', group: 'guides' },
  { slug: 'figma', title: 'Figma e design token', description: 'Stato reale degli artefatti design e procedura di importazione.', group: 'guides' },
  { slug: 'troubleshooting', title: 'Troubleshooting', description: 'Problemi frequenti e soluzioni.', group: 'guides' },
  { slug: 'contribuire', title: 'Contribuire', description: 'Struttura del repository, convenzioni e checklist.', group: 'guides' },
  { slug: 'changelog', title: 'Changelog e migrazioni', description: 'Versioni, politica semver e migrazioni dello schema dei temi.', group: 'guides' },
];

const modules = import.meta.glob<{ default: ComponentType }>('../guides/*.tsx');

export function findGuide(slug: string | undefined): GuideEntry | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** One lazy component per guide, created once at module scope (loading starts on first render). */
export const GUIDE_COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = Object.fromEntries(
  GUIDES.map((guide) => {
    const loader = modules[`../guides/${guide.slug}.tsx`];
    return [guide.slug, lazy(() => (loader ? loader() : Promise.reject(new Error(`Guide not found: ${guide.slug}`))))];
  }),
);