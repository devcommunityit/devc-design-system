/**
 * System strings used by components. Every string is replaceable through
 * `<LocaleProvider messages={...}>`; nothing is hard-coded in components.
 */
import type { ThemeIssue, ThemeIssueCode, ThemeIssueParams } from '../theme/types';
import { ar } from './locales/ar';
import { de } from './locales/de';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { pt } from './locales/pt';

export { ar, de, es, fr, pt };

export interface Messages {
  close: string;
  cancel: string;
  confirm: string;
  dismiss: string;
  loading: string;
  clear: string;
  remove: (label: string) => string;
  required: string;
  optional: string;
  showMore: string;
  showLess: string;
  copy: string;
  copied: string;
  showPassword: string;
  hidePassword: string;
  search: string;
  noResults: string;
  noOptions: string;
  selectedCount: (count: number) => string;
  breadcrumb: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  firstPage: string;
  lastPage: string;
  goToPage: (page: number) => string;
  pageOf: (page: number, total: number) => string;
  rowsPerPage: string;
  rangeOf: (start: number, end: number, total: number) => string;
  selectAll: string;
  selectRow: string;
  noData: string;
  loadError: string;
  retry: string;
  openMenu: string;
  closeMenu: string;
  mainNavigation: string;
  notifications: string;
  stepOf: (step: number, total: number) => string;
  stepCompleted: string;
  stepCurrent: string;
  moreItems: (count: number) => string;
  commandPalette: string;
  commandPlaceholder: string;
  dropFiles: string;
  browseFiles: string;
  fileConstraints: (parts: { accept?: string; maxSize?: string; maxFiles?: number }) => string;
  fileTooLarge: (name: string, max: string) => string;
  fileInvalidType: (name: string) => string;
  tooManyFiles: (max: number) => string;
  fileStatus: { pending: string; uploading: string; success: string; error: string };
  filesSelected: (count: number) => string;
  colorPicker: string;
  hue: string;
  sortAscending: string;
  sortDescending: string;
  filters: string;
  clearFilters: string;
  skipToContent: string;
  sidebar: string;
  opensInNewTab: string;
  codeBlock: string;
  scrollableRegion: string;
  more: string;
  stepError: string;
  trendUp: string;
  trendDown: string;
  trendNeutral: string;
  minimum: string;
  maximum: string;
  previousMonth: string;
  nextMonth: string;
  chooseDate: string;
  openCalendar: string;
  selectedItems: string;
  increase: string;
  decrease: string;
  info: string;
  success: string;
  warning: string;
  error: string;
  progress: string;
  status: string;
  wrapLines: string;
  /** Accessible name of the UserMenu trigger. */
  accountMenu: (name: string) => string;
  signOut: string;
  siteNavigation: string;
  authEmail: string;
  authUsername: string;
  authPassword: string;
  authConfirmPassword: string;
  authFullName: string;
  authRememberMe: string;
  authForgotPassword: string;
  authSignIn: string;
  authSignUp: string;
  authSendResetLink: string;
  authOrContinueWith: string;
  authRequiredField: string;
  authInvalidEmail: string;
  authPasswordTooShort: (min: number) => string;
  authPasswordHint: (min: number) => string;
  authPasswordsDoNotMatch: string;
  authAcceptTermsRequired: string;
  authResetLinkSent: string;
  authResetLinkSentTitle: string;
  copyFailed: string;
  moreActions: string;
  pinDigit: (index: number, total: number) => string;
  ratingValue: (value: number, max: number) => string;
  moveUp: (label: string) => string;
  moveDown: (label: string) => string;
  itemMoved: (label: string, position: number, total: number) => string;
  notificationsUnread: (count: number) => string;
  markAllRead: string;
  markAsRead: (title: string) => string;
  unread: string;
  noNotifications: string;
  /**
   * End-user messages for theme validation issues, one per `ThemeIssue.code`. The JSON path
   * (`issue.path`) is not included: show it separately. Use `formatThemeIssue(issue, messages)`.
   */
  themeIssue: { readonly [C in ThemeIssueCode]: (params: ThemeIssueParams) => string };
}

export const en: Messages = {
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'Confirm',
  dismiss: 'Dismiss',
  loading: 'Loading…',
  clear: 'Clear',
  remove: (label) => `Remove ${label}`,
  required: 'required',
  optional: 'optional',
  showMore: 'Show more',
  showLess: 'Show less',
  copy: 'Copy',
  copied: 'Copied',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  search: 'Search',
  noResults: 'No results',
  noOptions: 'No options',
  selectedCount: (n) => (n === 1 ? '1 selected' : `${n} selected`),
  breadcrumb: 'Breadcrumb',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  firstPage: 'First page',
  lastPage: 'Last page',
  goToPage: (p) => `Page ${p}`,
  pageOf: (p, t) => `Page ${p} of ${t}`,
  rowsPerPage: 'Rows per page',
  rangeOf: (s, e, t) => `${s}–${e} of ${t}`,
  selectAll: 'Select all',
  selectRow: 'Select row',
  noData: 'No data yet',
  loadError: 'Data could not be loaded',
  retry: 'Retry',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainNavigation: 'Main',
  notifications: 'Notifications',
  stepOf: (s, t) => `Step ${s} of ${t}`,
  stepCompleted: 'completed',
  stepCurrent: 'current',
  moreItems: (n) => `${n} more`,
  commandPalette: 'Command palette',
  commandPlaceholder: 'Type a command or search…',
  dropFiles: 'Drag files here',
  browseFiles: 'Browse files',
  fileConstraints: ({ accept, maxSize, maxFiles }) =>
    [accept && `Allowed: ${accept}`, maxSize && `max ${maxSize} each`, maxFiles !== undefined && `up to ${maxFiles} files`].filter(Boolean).join(' · '),
  fileTooLarge: (name, max) => `${name} is larger than ${max}.`,
  fileInvalidType: (name) => `${name} has a file type that is not allowed.`,
  tooManyFiles: (max) => `You can add up to ${max} files.`,
  fileStatus: { pending: 'Ready', uploading: 'Uploading', success: 'Uploaded', error: 'Failed' },
  filesSelected: (n) => (n === 1 ? '1 file' : `${n} files`),
  colorPicker: 'Color picker',
  hue: 'Hue',
  sortAscending: 'sorted ascending',
  sortDescending: 'sorted descending',
  filters: 'Filters',
  clearFilters: 'Clear filters',
  skipToContent: 'Skip to content',
  sidebar: 'Sidebar',
  opensInNewTab: '(opens in a new tab)',
  codeBlock: 'Code',
  scrollableRegion: 'Scrollable content',
  more: 'More',
  stepError: 'error',
  trendUp: 'increase',
  trendDown: 'decrease',
  trendNeutral: 'no change',
  minimum: 'Minimum',
  maximum: 'Maximum',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseDate: 'Choose date',
  openCalendar: 'Open calendar',
  selectedItems: 'Selected items',
  increase: 'Increase',
  decrease: 'Decrease',
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  progress: 'Progress',
  status: 'Status',
  wrapLines: 'Wrap lines',
  accountMenu: (name) => `Account menu, ${name}`,
  signOut: 'Sign out',
  siteNavigation: 'Site',
  authEmail: 'Email',
  authUsername: 'Username',
  authPassword: 'Password',
  authConfirmPassword: 'Confirm password',
  authFullName: 'Full name',
  authRememberMe: 'Keep me signed in',
  authForgotPassword: 'Forgot password?',
  authSignIn: 'Sign in',
  authSignUp: 'Create account',
  authSendResetLink: 'Send reset link',
  authOrContinueWith: 'or continue with',
  authRequiredField: 'This field is required.',
  authInvalidEmail: 'Enter a valid email address, e.g. name@example.com.',
  authPasswordTooShort: (min) => `Use at least ${min} characters.`,
  authPasswordHint: (min) => `At least ${min} characters. Passphrases are welcome.`,
  authPasswordsDoNotMatch: 'The passwords do not match.',
  authAcceptTermsRequired: 'You must accept the terms to continue.',
  authResetLinkSentTitle: 'Check your inbox',
  authResetLinkSent: 'If an account exists for this address, you will receive a link to reset your password.',
  copyFailed: 'Copy failed',
  moreActions: 'More actions',
  pinDigit: (index, total) => `Character ${index} of ${total}`,
  ratingValue: (value, max) => (value === 1 ? `1 star out of ${max}` : `${value} stars out of ${max}`),
  moveUp: (label) => `Move ${label} up`,
  moveDown: (label) => `Move ${label} down`,
  itemMoved: (label, position, total) => `${label} moved to position ${position} of ${total}`,
  notificationsUnread: (count) => (count === 0 ? 'Notifications' : count === 1 ? 'Notifications, 1 unread' : `Notifications, ${count} unread`),
  markAllRead: 'Mark all as read',
  markAsRead: (title) => `Mark "${title}" as read`,
  unread: 'Unread',
  noNotifications: 'No notifications',
  themeIssue: {
    invalid_json: () => 'The file is not valid JSON.',
    too_large: ({ limitKb }) => `The file exceeds ${limitKb ?? ''} KB.`,
    invalid_type: ({ expected }) => `Wrong type: expected ${expected === 'string' ? 'a string' : 'an object'}.`,
    missing_field: () => 'A required field is missing.',
    unsupported_version: ({ version, supported }) => `Schema version ${version ?? '?'} is not supported (up to ${supported ?? '?'}). Update @dev-community/ui.`,
    invalid_version: () => 'The schema version must be a positive integer.',
    unknown_key: () => 'Unknown key.',
    unknown_token: () => 'Unknown or non-customizable token.',
    unknown_preset: ({ allowed }) => `Unknown preset. Available: ${(allowed ?? []).join(', ')}.`,
    invalid_name: () => 'The name must start with a letter and contain only a–z, 0–9 and "-" (max 48 characters).',
    reserved_name: () => 'This name belongs to a built-in preset; choose another one.',
    invalid_color: ({ value }) => `Expected a hex color such as #1a73e8, got ${value ?? '—'}.`,
    invalid_length: ({ value }) => `Expected a length such as 8px or 0.5rem, got ${value ?? '—'}.`,
    invalid_font_family: () => 'The font family may contain only letters, digits, spaces, commas, dashes and balanced quotes.',
    invalid_label: () => 'The label must be at most 80 characters, without "<" or ">".',
  },
};

export const it: Messages = {
  close: 'Chiudi',
  cancel: 'Annulla',
  confirm: 'Conferma',
  dismiss: 'Ignora',
  loading: 'Caricamento…',
  clear: 'Cancella',
  remove: (label) => `Rimuovi ${label}`,
  required: 'obbligatorio',
  optional: 'facoltativo',
  showMore: 'Mostra di più',
  showLess: 'Mostra meno',
  copy: 'Copia',
  copied: 'Copiato',
  showPassword: 'Mostra password',
  hidePassword: 'Nascondi password',
  search: 'Cerca',
  noResults: 'Nessun risultato',
  noOptions: 'Nessuna opzione',
  selectedCount: (n) => (n === 1 ? '1 selezionato' : `${n} selezionati`),
  breadcrumb: 'Percorso',
  pagination: 'Paginazione',
  previousPage: 'Pagina precedente',
  nextPage: 'Pagina successiva',
  firstPage: 'Prima pagina',
  lastPage: 'Ultima pagina',
  goToPage: (p) => `Pagina ${p}`,
  pageOf: (p, t) => `Pagina ${p} di ${t}`,
  rowsPerPage: 'Righe per pagina',
  rangeOf: (s, e, t) => `${s}–${e} di ${t}`,
  selectAll: 'Seleziona tutto',
  selectRow: 'Seleziona riga',
  noData: 'Ancora nessun dato',
  loadError: 'Impossibile caricare i dati',
  retry: 'Riprova',
  openMenu: 'Apri menu',
  closeMenu: 'Chiudi menu',
  mainNavigation: 'Principale',
  notifications: 'Notifiche',
  stepOf: (s, t) => `Passaggio ${s} di ${t}`,
  stepCompleted: 'completato',
  stepCurrent: 'corrente',
  moreItems: (n) => `altri ${n}`,
  commandPalette: 'Palette dei comandi',
  commandPlaceholder: 'Digita un comando o cerca…',
  dropFiles: 'Trascina qui i file',
  browseFiles: 'Sfoglia file',
  fileConstraints: ({ accept, maxSize, maxFiles }) =>
    [accept && `Consentiti: ${accept}`, maxSize && `max ${maxSize} ciascuno`, maxFiles !== undefined && `fino a ${maxFiles} file`].filter(Boolean).join(' · '),
  fileTooLarge: (name, max) => `${name} supera ${max}.`,
  fileInvalidType: (name) => `Il tipo di ${name} non è consentito.`,
  tooManyFiles: (max) => `Puoi aggiungere al massimo ${max} file.`,
  fileStatus: { pending: 'Pronto', uploading: 'Caricamento', success: 'Caricato', error: 'Non riuscito' },
  filesSelected: (n) => (n === 1 ? '1 file' : `${n} file`),
  colorPicker: 'Selettore colore',
  hue: 'Tonalità',
  sortAscending: 'ordinato in modo crescente',
  sortDescending: 'ordinato in modo decrescente',
  filters: 'Filtri',
  clearFilters: 'Rimuovi filtri',
  skipToContent: 'Vai al contenuto',
  sidebar: 'Barra laterale',
  opensInNewTab: '(si apre in una nuova scheda)',
  codeBlock: 'Codice',
  scrollableRegion: 'Contenuto scorrevole',
  more: 'Altro',
  stepError: 'errore',
  trendUp: 'aumento',
  trendDown: 'diminuzione',
  trendNeutral: 'invariato',
  minimum: 'Minimo',
  maximum: 'Massimo',
  previousMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',
  chooseDate: 'Scegli la data',
  openCalendar: 'Apri calendario',
  selectedItems: 'Elementi selezionati',
  increase: 'Aumenta',
  decrease: 'Diminuisci',
  info: 'Informazione',
  success: 'Operazione riuscita',
  warning: 'Attenzione',
  error: 'Errore',
  progress: 'Avanzamento',
  status: 'Stato',
  wrapLines: 'A capo automatico',
  accountMenu: (name) => `Menu account, ${name}`,
  signOut: 'Esci',
  siteNavigation: 'Sito',
  authEmail: 'Email',
  authUsername: 'Nome utente',
  authPassword: 'Password',
  authConfirmPassword: 'Conferma password',
  authFullName: 'Nome e cognome',
  authRememberMe: 'Resta collegato',
  authForgotPassword: 'Password dimenticata?',
  authSignIn: 'Accedi',
  authSignUp: 'Crea account',
  authSendResetLink: 'Invia link di ripristino',
  authOrContinueWith: 'oppure continua con',
  authRequiredField: 'Campo obbligatorio.',
  authInvalidEmail: 'Inserisci un indirizzo email valido, ad es. nome@esempio.it.',
  authPasswordTooShort: (min) => `Usa almeno ${min} caratteri.`,
  authPasswordHint: (min) => `Almeno ${min} caratteri. Puoi usare una frase.`,
  authPasswordsDoNotMatch: 'Le password non coincidono.',
  authAcceptTermsRequired: 'Per continuare devi accettare le condizioni.',
  authResetLinkSentTitle: 'Controlla la posta',
  authResetLinkSent: 'Se esiste un account con questo indirizzo, riceverai un link per reimpostare la password.',
  copyFailed: 'Copia non riuscita',
  moreActions: 'Altre azioni',
  pinDigit: (index, total) => `Carattere ${index} di ${total}`,
  ratingValue: (value, max) => (value === 1 ? `1 stella su ${max}` : `${value} stelle su ${max}`),
  moveUp: (label) => `Sposta ${label} in su`,
  moveDown: (label) => `Sposta ${label} in giù`,
  itemMoved: (label, position, total) => `${label} spostato in posizione ${position} di ${total}`,
  notificationsUnread: (count) => (count === 0 ? 'Notifiche' : count === 1 ? 'Notifiche, 1 non letta' : `Notifiche, ${count} non lette`),
  markAllRead: 'Segna tutte come lette',
  markAsRead: (title) => `Segna «${title}» come letta`,
  unread: 'Non letta',
  noNotifications: 'Nessuna notifica',
  themeIssue: {
    invalid_json: () => 'Il file non è un JSON valido.',
    too_large: ({ limitKb }) => `Il file supera ${limitKb ?? ''} KB.`,
    invalid_type: ({ expected }) => `Tipo non valido: atteso ${expected === 'string' ? 'un testo' : 'un oggetto'}.`,
    missing_field: () => 'Manca un campo obbligatorio.',
    unsupported_version: ({ version, supported }) =>
      `La versione dello schema ${version ?? '?'} non è supportata (massimo ${supported ?? '?'}). Aggiorna @dev-community/ui.`,
    invalid_version: () => 'La versione dello schema deve essere un intero positivo.',
    unknown_key: () => 'Chiave sconosciuta.',
    unknown_token: () => 'Token sconosciuto o non personalizzabile.',
    unknown_preset: ({ allowed }) => `Preset sconosciuto. Disponibili: ${(allowed ?? []).join(', ')}.`,
    invalid_name: () => 'Il nome deve iniziare con una lettera e contenere solo a–z, 0–9 e «-» (max 48 caratteri).',
    reserved_name: () => 'Questo nome appartiene a un preset integrato: scegline un altro.',
    invalid_color: ({ value }) => `Atteso un colore esadecimale come #1a73e8, ricevuto ${value ?? '—'}.`,
    invalid_length: ({ value }) => `Attesa una lunghezza come 8px o 0.5rem, ricevuto ${value ?? '—'}.`,
    invalid_font_family: () => 'La famiglia di caratteri può contenere solo lettere, cifre, spazi, virgole, trattini e virgolette bilanciate.',
    invalid_label: () => 'L’etichetta deve avere al massimo 80 caratteri, senza «<» o «>».',
  },
};

/** Language subtags with a built-in bundle. */
export type BuiltInLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ar';

/**
 * Built-in bundles keyed by BCP 47 language subtag. `es`, `fr`, `de`, `pt` (Brazilian usage)
 * and `ar` are first translations: have them reviewed by native speakers before production use.
 */
export const builtInMessages: Readonly<Record<BuiltInLanguage, Messages>> = { en, it, es, fr, de, pt, ar };

function isBuiltInLanguage(lang: string): lang is BuiltInLanguage {
  return Object.prototype.hasOwnProperty.call(builtInMessages, lang);
}

/** Picks built-in messages by BCP 47 language subtag, falling back to English. */
export function getDefaultMessages(locale: string): Messages {
  const lang = locale.toLowerCase().split('-')[0] ?? 'en';
  return isBuiltInLanguage(lang) ? builtInMessages[lang] : en;
}

/** Localized, end-user message for a theme validation issue (without the JSON path). */
export function formatThemeIssue(issue: ThemeIssue, messages: Messages): string {
  return messages.themeIssue[issue.code](issue.params ?? {});
}
