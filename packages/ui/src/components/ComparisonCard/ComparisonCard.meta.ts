import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ComparisonCard', 'ComparisonCardProps', 'ComparisonPeriod'],
  name: 'ComparisonCard',
  slug: 'comparison-card',
  category: 'dashboard',
  summary:
    'Confronto tra due periodi: valore attuale e precedente con barre proporzionali e badge di variazione percentuale, con direzione scritta per gli screen reader.',
  whenToUse: [
    'Confrontare una metrica tra periodo attuale e precedente (mese, trimestre, anno).',
    'Evidenziare se una variazione è positiva o negativa rispetto all’obiettivo di business.',
  ],
  whenNotToUse: [
    'Andamento su molti periodi: usa LineChart o KpiCard con linea di tendenza.',
    'Confronti tra più di due valori: usa BarChart o RankingCard.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Nome della metrica.' },
    { name: 'current', type: 'ComparisonPeriod ({ label, value })', required: true, description: 'Periodo attuale.' },
    { name: 'previous', type: 'ComparisonPeriod ({ label, value })', required: true, description: 'Periodo di confronto.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei valori (e della differenza assoluta quando il precedente è 0).' },
    { name: 'higherIsBetter', type: 'boolean', default: 'true', description: 'Se un aumento è positivo; con false un calo è mostrato come positivo (es. errori, tempi).' },
    { name: 'description', type: 'ReactNode', description: 'Contesto (fonte, nota).' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', description: 'Se impostato, l’etichetta diventa un titolo di quel livello.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'Periodi e valori sono una lista di definizioni (<dl>): nome del periodo in <dt>, valore formattato in <dd>.',
    'La direzione della variazione è scritta per gli screen reader (“aumento”, “diminuzione”, “invariato”), non solo freccia o colore.',
    'Le barre sono aria-hidden: i valori sono sempre testo.',
    'In forced-colors il badge ha un bordo e le barre usano Highlight/GrayText.',
  ],
  responsive: [
    'Le righe occupano tutta la larghezza; il badge va a capo sotto l’etichetta nei contenitori stretti.',
    'Usa Grid con minItemWidth per affiancare più confronti.',
  ],
  customization: [
    'Token: --dc-look-radius-container, --dc-gradient-accent / --dc-color-data-1 per la barra attuale, --dc-color-border-strong per la precedente, superfici e foreground feedback per il badge.',
    'Selettori stabili: .dc-comparison-card-comparison[data-direction][data-sentiment], .dc-comparison-card-delta, .dc-comparison-card-row[data-period], .dc-comparison-card-bar.',
  ],
  commonMistakes: [
    'Dimenticare higherIsBetter={false} per metriche dove il calo è positivo.',
    'Passare valori già formattati come stringhe: servono numeri per calcolare barre e variazione.',
    'Confrontare periodi di durata diversa senza dirlo nell’etichetta del periodo.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'LowerIsBetter', title: 'Calo positivo', description: 'higherIsBetter={false} con valori in ore.' },
    { name: 'Dashboard', title: 'Più confronti', description: 'Griglia responsive, incluso un periodo precedente pari a 0.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/ComparisonCard/ComparisonCard.test.tsx'],
    limits: [
      'Con valore precedente pari a 0 la percentuale non è definita: il badge mostra la differenza assoluta formattata.',
      'Le barre sono proporzionali ai valori assoluti: con valori negativi indicano solo la grandezza.',
    ],
  },
};
