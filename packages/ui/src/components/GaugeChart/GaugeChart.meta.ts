import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['GaugeChart', 'GaugeChartProps', 'GaugeChartBand', 'GaugeChartTone'],
  name: 'GaugeChart',
  slug: 'gauge-chart',
  category: 'charts',
  summary:
    'Indicatore a semicerchio in SVG per un singolo valore su una scala limitata, con obiettivo opzionale e fasce di stato; esposto come role="meter".',
  whenToUse: [
    'Mostrare un solo valore rispetto a minimo e massimo noti (utilizzo, punteggio, avanzamento verso un budget).',
    'Evidenziare in che fascia (ok, attenzione, critico) si trova un indicatore di dashboard.',
  ],
  whenNotToUse: [
    'Confrontare più valori: usa BarChart o RadialBarChart.',
    'Valori senza un massimo significativo: usa KpiCard o Statistic.',
    'Andamenti nel tempo: usa LineChart o Sparkline.',
  ],
  props: [
    { name: 'value', type: 'number', required: true, description: 'Valore corrente; l’arco è limitato a [min, max], il testo mostra il valore reale.' },
    { name: 'min', type: 'number', default: '0', description: 'Inizio della scala (ore 9).' },
    { name: 'max', type: 'number', default: '100', description: 'Fine della scala (ore 3); se non è maggiore di min si usa min + 1.' },
    { name: 'target', type: 'number', description: 'Obiettivo, disegnato come tacca sull’arco con l’etichetta "Obiettivo".' },
    {
      name: 'bands',
      type: "{ to: number; tone: 'success' | 'warning' | 'danger' | 'neutral' }[]",
      description: 'Fasce colorate della scala con i colori di stato; ogni fascia parte dove finisce la precedente (la prima da min).',
    },
    { name: 'label', type: 'string', description: 'Didascalia sotto il valore al centro; dà il nome al meter quando manca il titolo.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al meter.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valore, obiettivo, minimo e massimo nel locale corrente.' },
    { name: 'size', type: 'number', default: '240', description: 'Diametro dell’arco in px (più i margini per l’etichetta dell’obiettivo); il grafico si restringe con il contenitore.' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid usa un gradiente e un bagliore sull’arco del valore; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [{ keys: '—', action: 'Non interattivo: il meter non riceve il focus; il valore è letto dagli screen reader nella navigazione normale.' }],
  accessibility: [
    '<figure> con <figcaption>; l’area del grafico ha role="meter" con aria-valuenow, aria-valuemin, aria-valuemax e aria-valuetext (valore formattato e obiettivo).',
    'Il nome del meter è il titolo (aria-labelledby) oppure label.',
    'L’SVG è aria-hidden: tutte le informazioni sono nel meter, quindi non c’è tabella dati.',
    'In forced-colors l’arco del valore usa Highlight, traccia e fasce Canvas con bordo CanvasText.',
  ],
  responsive: [
    'SVG con viewBox: si ridimensiona fino a size px mantenendo le proporzioni; i margini si adattano all’etichetta dell’obiettivo.',
    'Animazione di riempimento dell’arco solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Aspetto vivid: appearance="vivid" (o look expressive) dipinge l’arco con un gradiente tra --dc-color-data-1 e --dc-color-accent-default; in forced-colors torna piatto.',
    'Colori: arco --dc-color-data-1; traccia --dc-color-surface-subtle; fasce --dc-color-feedback-success/warning/danger (neutral: --dc-color-border-subtle).',
    'Selettori stabili: .dc-gauge-chart-gaugeChart, .dc-gauge-chart-value, .dc-gauge-chart-band[data-tone], .dc-gauge-chart-centerValue.',
  ],
  commonMistakes: [
    'Usare il gauge per valori senza un massimo naturale: la posizione sull’arco non ha significato.',
    'Affidare lo stato solo al colore delle fasce: indica la soglia anche nel testo (label o descrizione).',
    'Mettere molti gauge affiancati per confrontare valori: un RadialBarChart o un BarChart è più leggibile.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'WithTargetAndBands', title: 'Obiettivo e fasce di stato' },
    { name: 'Currency', title: 'Valuta e scala personalizzata' },
    { name: 'InCard', title: 'In una card' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Gradiente e bagliore con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/GaugeChart/GaugeChart.test.tsx'],
    limits: ['Solo semicerchio (180°): niente archi a 270° né lancetta.', 'Le fasce non sono annunciate dagli screen reader: descrivi le soglie nel testo se sono importanti.'],
  },
};
