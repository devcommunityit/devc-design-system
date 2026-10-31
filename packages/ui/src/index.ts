import './styles/index.css';

// Theme
export * from './theme/server';
export {
  ThemeProvider,
  useTheme,
  usePortalContainer,
  type ThemeProviderProps,
  type ThemeContextValue,
  type ThemePersistenceOptions,
  type PersistedKey,
} from './theme/ThemeProvider';

// i18n
export { LocaleProvider, useMessages, useLocale, type LocaleProviderProps, type MessageOverrides } from './i18n/LocaleProvider';
export type { ComponentMessages } from './i18n/componentMessages';
export {
  en as messagesEn,
  it as messagesIt,
  formatThemeIssue,
  type CoreLanguage,
  type Messages,
} from './i18n/messages';
export {
  es as messagesEs,
  fr as messagesFr,
  de as messagesDe,
  pt as messagesPt,
  ar as messagesAr,
  builtInMessages,
  getDefaultMessages,
  type BuiltInLanguage,
} from './i18n/builtIn';

// Components
export * from './components/layout';
export * from './components/typography';
export * from './components/actions';
export * from './components/navigation';
export * from './components/forms';
export * from './components/pickers';
export * from './components/data';
export * from './components/charts';
export * from './components/dashboard';
export * from './components/ai';
export * from './components/website';
export * from './components/community';
export * from './components/feedback';
export * from './components/overlays';

// Patterns
export * from './patterns';

// Shared react-aria / @internationalized/date types and helpers used in public props
export type { Key, Selection, SortDescriptor, PressEvent, DateValue, TimeValue } from 'react-aria-components';
/** Connect every library link to your router (React Router, Next.js…): see docs "Integrazione nei portali". */
export { RouterProvider } from 'react-aria-components';
export {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  Time,
  parseDate,
  parseDateTime,
  parseTime,
  parseZonedDateTime,
  today,
  now,
  getLocalTimeZone,
  isWeekend,
} from '@internationalized/date';

// Utilities
export { cx, useControllableState, formatBytes, type CSSVariables } from './utils';
