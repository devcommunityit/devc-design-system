import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { I18nProvider, useLocale as useRacLocale } from 'react-aria-components';
import { getDefaultMessages, type Messages } from './messages';

const MessagesContext = createContext<Messages | null>(null);

export interface LocaleProviderProps {
  /** BCP 47 tag, e.g. `it-IT`, `en-US`, `ar-EG`. Default: inherited, then the browser locale. */
  locale?: string;
  /** Override some or all system strings. Unspecified strings come from the built-in bundle for the locale. */
  messages?: Partial<Messages>;
  children?: ReactNode;
}

/**
 * Sets locale, direction and system strings for the subtree. Date/number formatting and
 * built-in react-aria strings follow `locale`. It does not change `<html lang|dir>`.
 */
export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  if (!locale) return <MessagesScope messages={messages} inherit>{children}</MessagesScope>;
  return (
    <I18nProvider locale={locale}>
      <MessagesScope messages={messages} inherit={false}>
        {children}
      </MessagesScope>
    </I18nProvider>
  );
}

function MessagesScope({ messages, inherit, children }: { messages?: Partial<Messages>; inherit: boolean; children?: ReactNode }) {
  const { locale } = useRacLocale();
  const parent = useContext(MessagesContext);
  const value = useMemo<Messages>(() => {
    const base = inherit && parent ? parent : getDefaultMessages(locale);
    return messages ? { ...base, ...messages } : base;
  }, [locale, parent, messages, inherit]);
  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

/** System strings for the current locale. Works without a provider (uses the browser locale). */
export function useMessages(): Messages {
  const ctx = useContext(MessagesContext);
  const { locale } = useRacLocale();
  return ctx ?? getDefaultMessages(locale);
}

/** Current locale and direction (`ltr` | `rtl`). */
export function useLocale(): { locale: string; direction: 'ltr' | 'rtl' } {
  return useRacLocale();
}
