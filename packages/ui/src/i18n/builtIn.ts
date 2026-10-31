import { en, it, type Messages } from './messages';
import { ar } from './locales/ar';
import { de } from './locales/de';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { pt } from './locales/pt';

export { ar, de, es, fr, pt };

/** Language subtags with a built-in bundle. */
export type BuiltInLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ar';

/**
 * Built-in bundles keyed by BCP 47 language subtag. `es`, `fr`, `de`, `pt` (Brazilian usage)
 * and `ar` are first translations: have them reviewed by native speakers before production use.
 * Importing this map (or `getDefaultMessages`) ships every bundle; import a single bundle
 * (e.g. `messagesFr`) and pass it to `LocaleProvider` to keep the app small.
 */
export const builtInMessages: Readonly<Record<BuiltInLanguage, Messages>> = { en, it, es, fr, de, pt, ar };

function isBuiltInLanguage(lang: string): lang is BuiltInLanguage {
  return Object.prototype.hasOwnProperty.call(builtInMessages, lang);
}

/** Picks any built-in bundle by BCP 47 language subtag, falling back to English. Ships all seven bundles. */
export function getDefaultMessages(locale: string): Messages {
  const lang = locale.toLowerCase().split('-')[0] ?? 'en';
  return isBuiltInLanguage(lang) ? builtInMessages[lang] : en;
}
