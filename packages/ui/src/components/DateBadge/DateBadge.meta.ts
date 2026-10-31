import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DateBadge', 'DateBadgeProps', 'DateBadgeValue', 'DateBadgeVariant'],
  name: 'DateBadge',
  slug: 'date-badge',
  category: 'community',
  summary:
    'Riquadro compatto con la data di un evento: giorno in evidenza, mese abbreviato in maiuscolo e, se serve, il giorno della settimana. Formattato con Intl secondo il locale e reso come <time dateTime>.',
  whenToUse: [
    'Copertine e righe di eventi, meetup, webinar, scadenze.',
    'Liste compatte in cui la data è il primo elemento da scorrere.',
  ],
  whenNotToUse: [
    'Date con orario o intervalli complessi nel testo: usa Intl.DateTimeFormat in un normale <time>.',
    'Selezione di una data: usa DatePicker o Calendar.',
  ],
  props: [
    { name: 'date', type: 'Date | string | { year: number; month: number; day: number }', required: true, description: 'Giorno da mostrare: Date, stringa ISO (“2026-11-12”) o oggetto tipo CalendarDate (mese da 1).' },
    { name: 'variant', type: "'solid' | 'gradient'", default: "'solid'", description: 'solid: riquadro chiaro da appoggiare su copertine colorate; gradient: riquadro con il gradiente brand.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Dimensione del riquadro.' },
    { name: 'showWeekday', type: 'boolean', default: 'false', description: 'Mostra il giorno della settimana abbreviato sopra al numero.' },
    { name: 'timeZone', type: 'string', description: 'Fuso IANA con cui leggere il giorno da un oggetto Date (predefinito: quello dell’utente).' },
  ],
  inherits: 'Attributi HTML di <time> (id, style, data-*, aria-*); ref all’elemento <time>.',
  keyboard: [],
  accessibility: [
    'Reso come <time dateTime="YYYY-MM-DD">, leggibile da motori di ricerca e tecnologie assistive.',
    'Le parti visive abbreviate sono aria-hidden: i lettori di schermo leggono la data completa localizzata (es. “giovedì 12 novembre 2026”).',
    'In forced-colors il riquadro usa Canvas/CanvasText con bordo visibile.',
  ],
  responsive: ['Dimensione intrinseca: non si allarga; usa size="sm" in liste dense o sidebar.'],
  customization: [
    'Token: --dc-color-surface-default e --dc-color-text-link (solid), --dc-gradient-accent con --dc-color-action-primary-foreground (gradient), --dc-radius-md.',
    'Selettori stabili: .dc-date-badge-date-badge[data-variant][data-size], .dc-date-badge-day, .dc-date-badge-month.',
  ],
  commonMistakes: [
    'Passare una stringa con orario UTC (“2026-11-12T23:30:00Z”) aspettandosi il giorno UTC: le date con orario seguono il fuso dell’utente o timeZone.',
    'Ripetere la stessa data in testo accanto al badge: è già annunciata per intero.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Variants', title: 'Varianti', description: 'solid su copertina colorata e gradient su superficie neutra.' },
    { name: 'Sizes', title: 'Dimensioni e giorno della settimana' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/DateBadge/DateBadge.test.tsx'],
    limits: ['Mostra un solo giorno: per intervalli di più giorni affianca due badge o usa il testo.', 'Valori non validi non renderizzano nulla.'],
  },
};
