import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { I18nProvider, useLocale as useRacLocale } from 'react-aria-components';
import { getCoreMessages, type Messages } from './messages';
import type { ComponentMessages } from './componentMessages';

const MessagesContext = createContext<Messages | null>(null);

export type MessageOverrides = Omit<Partial<Messages>, 'components'> & { components?: Partial<ComponentMessages> };

export interface LocaleProviderProps {
  /** BCP 47 tag, e.g. `it-IT`, `en-US`, `ar-EG`. Default: inherited, then the browser locale. */
  locale?: string;
  /**
   * Override some or all system strings. Unspecified strings come from the core bundle for the locale
   * (`it` or `en`, English fallback). For other languages pass a bundle, e.g. `messages={messagesFr}`.
   */
  messages?: MessageOverrides;
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

function MessagesScope({ messages, inherit, children }: { messages?: MessageOverrides; inherit: boolean; children?: ReactNode }) {
  const { locale } = useRacLocale();
  const parent = useContext(MessagesContext);
  const value = useMemo<Messages>(() => {
    const base = inherit && parent ? parent : getCoreMessages(locale);
    return messages ? { ...base, ...messages, components: { ...base.components, ...messages.components } } : base;
  }, [locale, parent, messages, inherit]);
  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

/** System strings for the current locale. Works without a provider (uses the browser locale). */
export function useMessages(): Messages {
  const ctx = useContext(MessagesContext);
  const { locale } = useRacLocale();
  return ctx ?? getCoreMessages(locale);
}

/** Current locale and direction (`ltr` | `rtl`). */
export function useLocale(): { locale: string; direction: 'ltr' | 'rtl' } {
  return useRacLocale();
}
