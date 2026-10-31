import { useEffect, useState } from 'react';
import type { ComponentDoc } from '@ui-src/docs-meta/types';
import type { DocsLang } from './lang';
import type * as Summaries from './en/summaries';

/** Shape of src/i18n/en/components/<slug>.json (validated by `npm run i18n:check -w @dev-community/docs`). */
export interface ComponentOverlay {
  source: string;
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  props: Array<{ name: string; description: string }>;
  inherits?: string;
  keyboard: Array<{ keys: string; action: string }>;
  accessibility: string[];
  responsive: string[];
  customization: string[];
  commonMistakes: string[];
  examples: Array<{ name: string; title: string; description?: string }>;
  limits: string[];
}

export type OverlayMap = Record<string, ComponentOverlay>;

let pending: Promise<OverlayMap> | undefined;

/** English component docs, fetched once as a single chunk and only when the portal is in English. */
export function loadEnglishOverlays(): Promise<OverlayMap> {
  pending ??= import('./en/overlays').then((m) => m.OVERLAYS);
  return pending;
}

type SummaryModule = typeof Summaries;
let pendingSummaries: Promise<SummaryModule> | undefined;

/** Short English summaries and example titles (for search and the catalog), much lighter than the full overlays. */
export function loadEnglishSummaries(): Promise<SummaryModule> {
  pendingSummaries ??= import('./en/summaries');
  return pendingSummaries;
}

/** Resolves an async resource for English only; `undefined` while loading or in Italian. */
function useEnglish<T>(loader: () => Promise<T>, lang: DocsLang): T | undefined {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    if (lang !== 'en') return;
    let active = true;
    void loader().then((v) => {
      if (active) setValue(() => v);
    });
    return () => {
      active = false;
    };
  }, [lang, loader]);
  return lang === 'en' ? value : undefined;
}

export const useEnglishOverlays = (lang: DocsLang) => useEnglish(loadEnglishOverlays, lang);
export const useEnglishSummaries = (lang: DocsLang) => useEnglish(loadEnglishSummaries, lang);

/** Key names stay as authored in the Italian metadata; these are the words used there. */
const KEY_WORDS: Array<[RegExp, string]> = [
  [/\bFrecce\b/g, 'Arrow keys'],
  [/\bFreccia\b/g, 'Arrow'],
  [/\bsu\s*\/\s*giù\b/gi, 'Up / Down'],
  [/\bsinistra\s*\/\s*destra\b/gi, 'Left / Right'],
  [/\bsinistra\b/gi, 'Left'],
  [/\bdestra\b/gi, 'Right'],
  [/\bgiù\b/gi, 'Down'],
  [/\bsu\b/g, 'Up'],
  [/\bInvio\b/g, 'Enter'],
  [/\bSpazio\b/g, 'Space'],
  [/\bMaiusc\b/g, 'Shift'],
  [/\bCanc\b/g, 'Delete'],
  [/\bFine\b/g, 'End'],
  [/\bPagina\b/g, 'Page'],
  [/\bprimo\b/g, 'first'],
  [/\bultimo\b/g, 'last'],
  [/\bsul\b/g, 'on'],
  [/\bsulla\b/g, 'on the'],
  [/\bnel\b/g, 'in the'],
  [/\boppure\b/g, 'or'],
  [/\b e \b/g, ' and '],
  [/\bo\b/g, 'or'],
];

export function translateKeys(keys: string): string {
  return KEY_WORDS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), keys);
}

/**
 * Merges the English overlay into the Italian metadata. Props and examples are matched by name, so an
 * overlay that is stale (Italian source edited later) still applies to the entries it knows about.
 */
export function localizeDoc(doc: ComponentDoc, overlay: ComponentOverlay | undefined): ComponentDoc {
  if (!overlay) return doc;
  const sameLength = <T,>(source: T[], translated: T[] | undefined) => (translated && translated.length === source.length ? translated : source);
  const props = new Map(overlay.props.map((p) => [p.name, p.description]));
  const examples = new Map(overlay.examples.map((e) => [e.name, e]));
  const keyboard = overlay.keyboard.length === doc.keyboard.length ? overlay.keyboard : undefined;
  return {
    ...doc,
    summary: overlay.summary,
    whenToUse: sameLength(doc.whenToUse, overlay.whenToUse),
    whenNotToUse: sameLength(doc.whenNotToUse, overlay.whenNotToUse),
    props: doc.props.map((p) => ({ ...p, description: props.get(p.name) ?? p.description })),
    inherits: doc.inherits ? (overlay.inherits ?? doc.inherits) : undefined,
    keyboard: doc.keyboard.map((k, i) => ({ keys: translateKeys(k.keys), action: keyboard?.[i]?.action ?? k.action })),
    accessibility: sameLength(doc.accessibility, overlay.accessibility),
    responsive: sameLength(doc.responsive, overlay.responsive),
    customization: sameLength(doc.customization, overlay.customization),
    commonMistakes: sameLength(doc.commonMistakes, overlay.commonMistakes),
    examples: doc.examples.map((e) => {
      const translated = examples.get(e.name);
      return translated ? { ...e, title: translated.title, description: translated.description ?? e.description } : e;
    }),
    status: { ...doc.status, limits: sameLength(doc.status.limits, overlay.limits) },
  };
}
