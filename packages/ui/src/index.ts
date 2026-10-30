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
export { LocaleProvider, useMessages, useLocale, type LocaleProviderProps } from './i18n/LocaleProvider';
export {
  en as messagesEn,
  it as messagesIt,
  es as messagesEs,
  fr as messagesFr,
  de as messagesDe,
  pt as messagesPt,
  ar as messagesAr,
  builtInMessages,
  getDefaultMessages,
  formatThemeIssue,
  type BuiltInLanguage,
  type Messages,
} from './i18n/messages';

// Components
export * from './components/layout';
export * from './components/typography';
export * from './components/actions';
export * from './components/navigation';
export * from './components/forms';
export * from './components/pickers';
export * from './components/data';
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
  parseTime,
  parseZonedDateTime,
  today,
  getLocalTimeZone,
  isWeekend,
} from '@internationalized/date';

// Utilities
export { cx, useControllableState, formatBytes, type CSSVariables } from './utils';
