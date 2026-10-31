/** Portal language (prose, navigation, labels). Routes are language-independent; the choice is stored per browser. */
export type DocsLang = 'it' | 'en';

export const DOCS_LANGS: readonly { id: DocsLang; label: string; short: string; locale: string }[] = [
  { id: 'it', label: 'Italiano', short: 'IT', locale: 'it-IT' },
  { id: 'en', label: 'English', short: 'EN', locale: 'en-US' },
];

/** Fallback when neither the user nor the browser asks for a supported language. */
export const DEFAULT_LANG: DocsLang = 'en';
const STORAGE_KEY = 'dc-docs-lang';

export function isDocsLang(value: unknown): value is DocsLang {
  return value === 'it' || value === 'en';
}

/** First supported language in the browser preferences (`navigator.languages`), matched on the primary subtag. */
export function browserLang(languages: readonly string[] = typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language])): DocsLang | undefined {
  for (const tag of languages) {
    const primary = tag?.split('-')[0]?.toLowerCase();
    if (isDocsLang(primary)) return primary;
  }
  return undefined;
}

/** Priority: `?lang=` (shareable links), the choice made in the UI, the browser language, then English. */
export function readInitialLang(): DocsLang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const param = new URLSearchParams(window.location.search).get('lang');
  if (isDocsLang(param)) return param;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isDocsLang(stored)) return stored;
  } catch {
    // Storage unavailable (privacy mode): fall back to the browser language.
  }
  return browserLang() ?? DEFAULT_LANG;
}

export function storeLang(lang: DocsLang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not persisted: the choice still applies to this visit.
  }
  const url = new URL(window.location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.delete('lang');
    window.history.replaceState(window.history.state, '', url);
  }
}

/** Localized text for content kept next to the data it describes. */
export type Localized<T = string> = Record<DocsLang, T>;
