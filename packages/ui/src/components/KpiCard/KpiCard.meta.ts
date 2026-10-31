import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['KpiCard', 'KpiCardVariant'],
  name: 'KpiCard',
  slug: 'kpi-card',
  category: 'dashboard',
  summary:
    'Riquadro KPI per dashboard: etichetta, valore formattato con Intl, variazione testuale, icona, piccola linea di tendenza decorativa e slot footer.',
  whenToUse: [
    'Righe di indicatori in testa a una dashboard amministrativa.',
    'Mostrare l’andamento recente di una metrica accanto al valore attuale.',
  ],
  whenNotToUse: [
    'Analisi dettagliate di serie temporali: usa LineChart o una tabella.',
    'Metriche senza superficie propria dentro un’altra card: usa Statistic.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Nome della metrica.' },
    { name: 'value', type: 'number | ReactNode', required: true, description: 'I numeri sono formattati con Intl.NumberFormat nel locale corrente; null mostra emptyValue.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Valuta, percentuale, decimali…' },
    { name: 'trend', type: 'StatisticTrend ({ direction, value, sentiment?, label? })', description: 'Variazione; la direzione è annunciata a parole localizzate. sentiment colora anche la linea di tendenza.' },
    { name: 'icon', type: 'ReactNode', description: 'Icona decorativa.' },
    { name: 'description', type: 'ReactNode', description: 'Contesto (periodo, fonte).' },
    { name: 'emptyValue', type: 'ReactNode', default: "'—'", description: 'Mostrato quando value è null/undefined.' },
    { name: 'sparkline', type: 'number[]', description: 'Valori recenti disegnati come linea SVG decorativa (aria-hidden); valori non finiti sono ignorati, servono almeno 2 punti.' },
    { name: 'footer', type: 'ReactNode', description: 'Link al dettaglio, piccola azione o nota.' },
    { name: 'variant', type: "'default' | 'vivid' | 'tinted'", default: "'default'", description: 'Superficie: default (neutra), vivid (gradiente del brand con testo primary-foreground, per il KPI principale), tinted (riempimento tonale).' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Mostra al suo posto uno SkeletonKpi della stessa forma (aria-busy, testo nascosto “Caricamento…” non live) mantenendo className e style, così resta nella griglia. Avvolgi l’area in SkeletonGroup per un solo annuncio. Con sparkline={[]} o icon la sagoma riserva linea e icona.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'Valore e variazione sono testo: la linea di tendenza è aria-hidden e non porta informazioni esclusive.',
    'La direzione del trend è scritta per gli screen reader (“aumento”, “diminuzione”…), non solo freccia o colore.',
    'In forced-colors la linea usa CanvasText e l’area sfumata è nascosta; le varianti vivid e tinted tornano a Canvas/CanvasText con bordo.',
    'La variante vivid usa la coppia gradiente/foreground del brand, progettata per il contrasto su entrambi gli estremi del gradiente.',
  ],
  responsive: [
    'Larghezza fluida: usa Grid con minItemWidth per righe di KPI che vanno a capo.',
    'La linea di tendenza si adatta alla larghezza mantenendo lo spessore del tratto.',
  ],
  customization: [
    'Token: --dc-look-radius-container, colori feedback per la tendenza; vivid usa --dc-gradient-accent, --dc-color-action-primary-foreground e --dc-look-shadow-primary; tinted usa --dc-look-fill-tonal su --dc-color-action-secondary.',
    'In vivid etichetta, descrizione, trend e linea di tendenza ereditano il colore primary-foreground (currentColor): il sentiment resta leggibile grazie a freccia e testo.',
    'Selettori stabili: .dc-kpi-card-kpi[data-variant], .dc-kpi-card-sparkline[data-sentiment], .dc-kpi-card-footer.',
  ],
  commonMistakes: [
    'Affidare alla sola linea di tendenza un’informazione: riportala nel trend o nella descrizione.',
    'Formattare a mano i numeri ignorando il locale.',
    'Interpretare un calo come negativo quando è positivo (es. errori): imposta sentiment.',
    'Usare vivid su tutte le card di una riga: riservalo al KPI principale, altrimenti perde enfasi.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'WithSparkline', title: 'Con linea di tendenza' },
    { name: 'Dashboard', title: 'Riga di KPI', description: 'Griglia intrinseca che va a capo nei contenitori stretti.' },
    { name: 'Periods', title: 'Cambio periodo', description: 'Serie e variazione calcolate da stato locale.' },
    { name: 'Vivid', title: 'Variante vivid', description: 'KPI principale su gradiente del brand.' },
    { name: 'Tinted', title: 'Variante tinted', description: 'Riempimento tonale accanto a card neutre.' },
    { name: 'Loading', title: 'Caricamento', description: 'Attiva/disattiva isLoading: lo skeleton ha la stessa forma del contenuto.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/KpiCard/KpiCard.test.tsx'],
    limits: [
      'La linea di tendenza interna è volutamente minimale (nessun asse, tooltip o punto evidenziato): per grafici consultabili usa Sparkline o LineChart.',
      'Il footer non è un’area cliccabile: per rendere navigabile tutta la card inserisci la KpiCard in una struttura con link esplicito.',
    ],
  },
};
