import type { Localized } from '../i18n/lang';

export interface ShowcaseEntry {
  slug: string;
  title: Localized;
  description: Localized;
}

/** Full-page templates built only with library components (rendered at /showcase/:slug). Their sample content is Italian. */
export const SHOWCASE: ShowcaseEntry[] = [
  {
    slug: 'kanban',
    title: { it: 'Kanban di progetto', en: 'Project kanban' },
    description: {
      it: 'Workflow completo con colonne di stato, drag & drop, riordino, selettore di stato e riepilogo attività.',
      en: 'A complete workflow with status columns, drag and drop, reordering, a status picker and an activity summary.',
    },
  },
  {
    slug: 'landing',
    title: { it: 'Landing page', en: 'Landing page' },
    description: { it: 'Hero, feature, piani e prezzi, FAQ e call to action.', en: 'Hero, features, plans and pricing, FAQ and call to action.' },
  },
  {
    slug: 'community',
    title: { it: 'Community di sviluppatori', en: 'Developer community' },
    description: {
      it: 'Eventi, articoli, discussioni, speaker, learning path, newsletter, badge, ribbon, etichette Beta/Demo e social.',
      en: 'Events, articles, discussions, speakers, learning paths, newsletter, badges, ribbons, Beta/Demo labels and social links.',
    },
  },
  {
    slug: 'editor',
    title: { it: 'Studio contenuti', en: 'Content studio' },
    description: {
      it: 'RichTextEditor in modalità blocchi o barra con anteprima, ed EmailBuilder per newsletter con esportazione HTML.',
      en: 'RichTextEditor in block or toolbar mode with preview, and EmailBuilder for newsletters with HTML export.',
    },
  },
  {
    slug: 'dashboard',
    title: { it: 'Dashboard', en: 'Dashboard' },
    description: { it: 'KPI, attività recenti, avanzamento e tabella sintetica.', en: 'KPIs, recent activity, progress and a summary table.' },
  },
  {
    slug: 'admin',
    title: { it: 'Dashboard di amministrazione', en: 'Admin dashboard' },
    description: {
      it: 'HeroCard, KpiCard con sparkline, grafici a linee, barre e ciambella, PromoBanner, NavList e azioni rapide.',
      en: 'HeroCard, KpiCard with sparklines, line, bar and donut charts, PromoBanner, NavList and quick actions.',
    },
  },
  {
    slug: 'elenco',
    title: { it: 'Elenco con filtri', en: 'Filtered list' },
    description: { it: 'Filtri, ricerca, DataTable con selezione e azioni di massa.', en: 'Filters, search, DataTable with selection and bulk actions.' },
  },
  {
    slug: 'dettaglio',
    title: { it: 'Pagina dettaglio', en: 'Detail page' },
    description: { it: 'Intestazione, schede, dati descrittivi e cronologia.', en: 'Header, tabs, descriptive data and history.' },
  },
  {
    slug: 'modulo',
    title: { it: 'Form articolato', en: 'Complex form' },
    description: { it: 'Form multi-sezione con validazione e riepilogo errori.', en: 'Multi-section form with validation and an error summary.' },
  },
  {
    slug: 'impostazioni',
    title: { it: 'Impostazioni', en: 'Settings' },
    description: { it: 'Preferenze applicate davvero: tema, densità, notifiche.', en: 'Preferences that really apply: theme, density, notifications.' },
  },
  {
    slug: 'account',
    title: { it: 'Area account', en: 'Account area' },
    description: { it: 'Profilo, sicurezza, sessioni e fatturazione (simulate).', en: 'Profile, security, sessions and billing (simulated).' },
  },
  {
    slug: 'accesso',
    title: { it: 'Accesso e registrazione', en: 'Sign-in and sign-up' },
    description: { it: 'Login, registrazione e recupero password dimostrativi.', en: 'Demo sign-in, sign-up and password recovery.' },
  },
  {
    slug: 'errori',
    title: { it: 'Errori e stati vuoti', en: 'Errors and empty states' },
    description: { it: 'Pagine 404, 500, accesso negato e stati vuoti.', en: '404, 500, access denied pages and empty states.' },
  },
];
