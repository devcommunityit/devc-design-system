export interface ShowcaseEntry {
  slug: string;
  title: string;
  description: string;
}

/** Full-page templates built only with library components (rendered at /showcase/:slug). */
export const SHOWCASE: ShowcaseEntry[] = [
  { slug: 'landing', title: 'Landing page', description: 'Hero, feature, piani e prezzi, FAQ e call to action.' },
  { slug: 'dashboard', title: 'Dashboard', description: 'KPI, attività recenti, avanzamento e tabella sintetica.' },
  { slug: 'admin', title: 'Dashboard di amministrazione', description: 'HeroCard, KpiCard con sparkline, grafici a linee, barre e ciambella, PromoBanner, NavList e azioni rapide.' },
  { slug: 'elenco', title: 'Elenco con filtri', description: 'Filtri, ricerca, DataTable con selezione e azioni di massa.' },
  { slug: 'dettaglio', title: 'Pagina dettaglio', description: 'Intestazione, schede, dati descrittivi e cronologia.' },
  { slug: 'modulo', title: 'Form articolato', description: 'Form multi-sezione con validazione e riepilogo errori.' },
  { slug: 'impostazioni', title: 'Impostazioni', description: 'Preferenze applicate davvero: tema, densità, notifiche.' },
  { slug: 'account', title: 'Area account', description: 'Profilo, sicurezza, sessioni e fatturazione (simulate).' },
  { slug: 'accesso', title: 'Accesso e registrazione', description: 'Login, registrazione e recupero password dimostrativi.' },
  { slug: 'errori', title: 'Errori e stati vuoti', description: 'Pagine 404, 500, accesso negato e stati vuoti.' },
];