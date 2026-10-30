import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type DocsLanguage = 'it' | 'en';

export interface DocsSettings {
  /** Language of the library system strings (examples stay in Italian). */
  language: DocsLanguage;
  setLanguage: (language: DocsLanguage) => void;
  /** RTL preview: switches the library locale to an RTL locale (ar-EG) keeping the chosen messages. */
  rtl: boolean;
  setRtl: (rtl: boolean) => void;
}

const SettingsContext = createContext<DocsSettings | null>(null);

export function DocsSettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<DocsLanguage>('it');
  const [rtl, setRtl] = useState(false);
  const value = useMemo(() => ({ language, setLanguage, rtl, setRtl }), [language, rtl]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useDocsSettings(): DocsSettings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useDocsSettings must be used inside DocsSettingsProvider');
  return ctx;
}