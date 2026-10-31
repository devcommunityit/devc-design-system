import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['GoalCard', 'GoalCardProps', 'GoalCardTone'],
  name: 'GoalCard',
  slug: 'goal-card',
  category: 'dashboard',
  summary:
    'Card obiettivo per dashboard: anello di avanzamento con percentuale al centro, valore attuale e obiettivo formattati con Intl e quanto manca al traguardo.',
  whenToUse: [
    'Mostrare l’avanzamento verso un obiettivo numerico (vendite, iscritti, budget).',
    'Affiancare a KpiCard un indicatore con traguardo esplicito.',
  ],
  whenNotToUse: [
    'Valori senza obiettivo: usa KpiCard o Statistic.',
    'Avanzamento di un’operazione in corso (upload, caricamento): usa Progress.',
    'Più obiettivi confrontati nello stesso grafico: usa un grafico a barre o radiale.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Nome dell’obiettivo; è anche il nome accessibile del meter.' },
    { name: 'value', type: 'number', required: true, description: 'Valore attuale.' },
    { name: 'target', type: 'number', required: true, description: 'Valore da raggiungere (massimo del meter).' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valore, obiettivo e quantità mancante (valuta, percentuale…).' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa.' },
    { name: 'description', type: 'ReactNode', description: 'Contesto (periodo, fonte).' },
    { name: 'footer', type: 'ReactNode', description: 'Link al dettaglio, piccola azione o nota.' },
    { name: 'tone', type: "'brand' | 'success' | 'warning' | 'neutral'", default: "'brand'", description: 'Colore dell’anello; brand usa il gradiente accent.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', description: 'Se impostato, l’etichetta diventa un titolo di quel livello.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'L’anello è un role="meter" con aria-valuemin 0, aria-valuemax pari all’obiettivo, aria-valuenow e aria-valuetext (percentuale, valore e obiettivo formattati); il nome arriva dall’etichetta tramite aria-labelledby.',
    'L’SVG è decorativo (aria-hidden): valore, obiettivo e quanto manca sono testo visibile.',
    'Il raggiungimento dell’obiettivo è scritto (“Obiettivo raggiunto”), non affidato al solo colore.',
    'Con prefers-reduced-motion l’anello non si anima; in forced-colors usa Highlight su traccia GrayText.',
  ],
  responsive: [
    'Anello e cifre stanno affiancati e vanno a capo nei contenitori stretti.',
    'Usa Grid con minItemWidth per righe di obiettivi.',
  ],
  customization: [
    'Token: --dc-look-radius-container, --dc-color-action-primary e --dc-color-accent-default (gradiente brand), colori feedback per success/warning, --dc-color-surface-muted per la traccia.',
    'Selettori stabili: .dc-goal-card-goal[data-tone][data-reached], .dc-goal-card-ring, .dc-goal-card-arc, .dc-goal-card-footer.',
  ],
  commonMistakes: [
    'Passare la percentuale come value con target 100 quando hai i valori assoluti: perdi il formato (valuta, unità).',
    'Usare tone="success" per un obiettivo lontano: il colore deve rispecchiare lo stato reale.',
    'Formattare a mano i numeri ignorando il locale.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Tones', title: 'Toni', description: 'brand, success (obiettivo superato), warning e neutral.' },
    { name: 'WithFooter', title: 'Con titolo e footer', description: 'Etichetta come titolo h3 e link al dettaglio.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/GoalCard/GoalCard.test.tsx'],
    limits: [
      'Oltre il 100% l’anello resta pieno: la percentuale reale è nel testo centrale e nell’aria-valuetext.',
      'Con target ≤ 0 la percentuale non è significativa: l’anello è pieno se value > 0.',
    ],
  },
};
