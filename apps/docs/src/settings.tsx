import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BuiltInLanguage } from '@devcommunityit/ui';
import { readInitialLang, storeLang, type DocsLang as PortalLang } from './i18n/lang';
import { MESSAGES, type Messages } from './i18n/messages';

export type DocsLanguage = BuiltInLanguage;

/** Languages offered in the docs, with the locale passed to LocaleProvider and the native name. */
export const DOCS_LANGUAGES: readonly { id: DocsLanguage; locale: string; label: string }[] = [
  { id: 'it', locale: 'it-IT', label: 'Italiano' },
  { id: 'en', locale: 'en-US', label: 'English' },
  { id: 'es', locale: 'es-ES', label: 'Español' },
  { id: 'fr', locale: 'fr-FR', label: 'Français' },
  { id: 'de', locale: 'de-DE', label: 'Deutsch' },
  { id: 'pt', locale: 'pt-BR', label: 'Português (Brasil)' },
  { id: 'ar', locale: 'ar-EG', label: 'العربية' },
];

export function isDocsLanguage(value: unknown): value is DocsLanguage {
  return DOCS_LANGUAGES.some((l) => l.id === value);
}

export function docsLocale(language: DocsLanguage): string {
  return DOCS_LANGUAGES.find((l) => l.id === language)?.locale ?? 'it-IT';
}

export interface DocsSettings {
  /** Portal language: prose, navigation and labels. */
  lang: PortalLang;
  /** Also switches the library system strings to the same language. */
  setLang: (lang: PortalLang) => void;
  /** Language of the library system strings (defaults to the portal language). */
  language: DocsLanguage;
  setLanguage: (language: DocsLanguage) => void;
  /** RTL preview: switches the library locale to an RTL locale (ar-EG) keeping the chosen messages. */
  rtl: boolean;
  setRtl: (rtl: boolean) => void;
}

const SettingsContext = createContext<DocsSettings | null>(null);

export function DocsSettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<PortalLang>(readInitialLang);
  const [language, setLanguage] = useState<DocsLanguage>(lang);
  const [rtl, setRtl] = useState(false);
  const value = useMemo(
    () => ({
      lang,
      setLang: (next: PortalLang) => {
        setLangState(next);
        setLanguage(next);
        storeLang(next);
      },
      language,
      setLanguage,
      rtl,
      setRtl,
    }),
    [lang, language, rtl],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useDocsSettings(): DocsSettings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useDocsSettings must be used inside DocsSettingsProvider');
  return ctx;
}
/** Portal language and its UI messages. */
export function useI18n(): { lang: PortalLang; setLang: (lang: PortalLang) => void; t: Messages } {
  const { lang, setLang } = useDocsSettings();
  return { lang, setLang, t: MESSAGES[lang] };
}
