import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['RadialBarChart', 'RadialBarChartProps', 'RadialBarChartDatum'],
  name: 'RadialBarChart',
  slug: 'radial-bar-chart',
  category: 'charts',
  summary:
    'Grafico a barre radiali in SVG: anelli concentrici riempiti in senso orario in proporzione a valore / massimo, con legenda, navigazione da tastiera e tabella dati accessibile.',
  whenToUse: [
    'Mostrare l’avanzamento di poche voci (2–5) verso il rispettivo obiettivo in uno spazio compatto.',
    'Riepiloghi di dashboard con percentuali di completamento.',
  ],
  whenNotToUse: [
    'Confrontare con precisione valori vicini: gli anelli esterni sono più lunghi a parità di valore, usa BarChart.',
    'Un solo valore su una scala con soglie: usa GaugeChart.',
    'Parti di un totale: usa DonutChart.',
  ],
  props: [
    {
      name: 'data',
      type: '{ id: string; label: string; value: number; max?: number }[]',
      required: true,
      description: 'Anelli dall’esterno verso l’interno; i valori negativi contano come 0, max sovrascrive il massimo del grafico.',
    },
    { name: 'max', type: 'number', default: '100', description: 'Valore di un anello completo, se la voce non indica il proprio max.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valori e massimi nel locale corrente; le percentuali usano sempre Intl con style percent.' },
    { name: 'size', type: 'number', default: '220', description: 'Diametro massimo in px; il grafico si restringe con il contenitore.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Legenda con valore, massimo e percentuale di ogni anello.' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid usa gradienti e bagliori con gli stessi colori del tema; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico, poi sul pulsante della tabella.' },
    { keys: 'Frecce', action: 'Anello successivo/precedente: evidenzia l’anello e annuncia etichetta, valore, massimo e percentuale.' },
    { keys: 'Home / Fine', action: 'Primo / ultimo anello.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    '<figure> con <figcaption>; area role="group" focalizzabile con suggerimento e annunci aria-live="polite".',
    'Gli anelli si distinguono anche senza colore (texture ripetute nella legenda) e la legenda riporta valori e percentuali in testo.',
    'Tabella dati con colonne "Valore", "Obiettivo" (massimo) e percentuale.',
    'In forced-colors gli anelli diventano Canvas con bordo e texture CanvasText; l’anello attivo ha bordo Highlight.',
  ],
  responsive: ['SVG con viewBox: si ridimensiona fino a size px mantenendo le proporzioni.', 'Animazione di comparsa solo con prefers-reduced-motion: no-preference.'],
  customization: [
    'Aspetto vivid: appearance="vivid" (o look expressive) dipinge gli anelli con gradienti tra --dc-color-data-N e --dc-color-accent-default e tinge le tracce; in forced-colors torna piatto.',
    'Colori: --dc-color-data-1…6 (ciclici); traccia --dc-color-surface-subtle.',
    'Selettori stabili: .dc-radial-bar-chart-radialBarChart (anello attivo: g[data-active]), .dc-radial-bar-chart-track, .dc-chart-table.',
  ],
  commonMistakes: [
    'Usare più di 5 anelli: diventano sottili e difficili da distinguere.',
    'Confrontare voci con massimi diversi senza indicarlo: la legenda mostra sempre valore / massimo.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'PerItemMax', title: 'Massimo per voce e valuta' },
    { name: 'InCard', title: 'In una card' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Gradienti e bagliori con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/RadialBarChart/RadialBarChart.test.tsx'],
    limits: ['Valori oltre il massimo riempiono l’anello completo (la percentuale reale resta nel testo).', 'Nessuna etichetta sugli anelli: i valori sono nella legenda, nella lettura attiva e nella tabella.'],
  },
};
