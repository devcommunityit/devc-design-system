import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ActivityCard', 'ActivityCardProps', 'ActivityItem', 'ActivityTone'],
  name: 'ActivityCard',
  slug: 'activity-card',
  category: 'dashboard',
  summary:
    'Feed di attività per dashboard: timeline verticale con avatar, autore, azione, orario in un elemento <time> e un punto colorato decorativo per lo stato.',
  whenToUse: [
    'Mostrare le ultime azioni di utenti o sistema (pubblicazioni, commenti, approvazioni).',
    'Dare contesto recente accanto ai KPI di una dashboard.',
  ],
  whenNotToUse: [
    'Passaggi di un processo o cronologia di un singolo oggetto: usa Timeline.',
    'Notifiche che richiedono un’azione: usa Toast, Alert o un centro notifiche.',
    'Registri lunghi da filtrare: usa DataTable con paginazione.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della card; dà anche il nome accessibile alla lista.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'items', type: 'ActivityItem[] ({ id, actor, avatarSrc?, action, time, dateTime?, tone? })', required: true, description: 'Attività in ordine cronologico inverso; time è testo già formattato, dateTime il valore ISO per <time>.' },
    { name: 'footer', type: 'ReactNode', description: 'Link al registro completo o nota.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Mostrato al posto della lista quando items è vuoto.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'Elenco <ul> con nome dal titolo (aria-labelledby); ogni voce è una frase completa “autore + azione”.',
    'Avatar, punto di stato e linea della timeline sono decorativi (aria-hidden): il nome dell’autore è testo visibile.',
    'Il tono non porta informazioni esclusive: scrivi l’esito nell’azione (“non riuscito”, “approvato”).',
    'L’orario usa <time dateTime> per una lettura non ambigua.',
  ],
  responsive: [
    'Testo e orario vanno a capo; avatar e linea restano allineati a inizio riga (supporto RTL con proprietà logiche).',
  ],
  customization: [
    'Token: --dc-look-radius-container, colori feedback per i punti di stato, --dc-color-border-subtle per la linea.',
    'Selettori stabili: .dc-activity-card-activity, .dc-activity-card-item[data-tone], .dc-activity-card-dot, .dc-activity-card-time, .dc-activity-card-footer.',
  ],
  commonMistakes: [
    'Affidare l’esito al solo colore del punto.',
    'Omettere dateTime con orari relativi (“ieri”): il valore macchina aiuta tecnologie assistive ed estensioni.',
    'Rendere l’intera riga cliccabile: inserisci link espliciti nell’azione.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'WithTones', title: 'Toni e link', description: 'Tutti i toni, link nell’azione e footer.' },
    { name: 'Empty', title: 'Stato vuoto' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/ActivityCard/ActivityCard.test.tsx'],
    limits: [
      'Gli orari non sono formattati dal componente: passa testo già localizzato (es. con RelativeTime).',
      'Nessuna paginazione o caricamento progressivo integrato.',
    ],
  },
};
