import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['FunnelChart', 'FunnelChartProps', 'FunnelChartDatum'],
  name: 'FunnelChart',
  slug: 'funnel-chart',
  category: 'charts',
  summary:
    'Grafico a imbuto in SVG: una barra centrata per ogni fase, proporzionale alla prima, con valore e tasso di conversione, navigazione da tastiera e tabella dati accessibile.',
  whenToUse: [
    'Mostrare quante persone o quanto valore passano da una fase alla successiva di un processo (acquisto, iscrizione, pipeline commerciale).',
    'Individuare la fase con la perdita maggiore.',
  ],
  whenNotToUse: [
    'Categorie senza un ordine di processo: usa BarChart.',
    'Parti di un totale: usa DonutChart.',
    'Andamenti nel tempo: usa LineChart.',
  ],
  props: [
    { name: 'data', type: '{ id: string; label: string; value: number }[]', required: true, description: 'Fasi dall’alto verso il basso; la prima vale 100% di conversione. I valori negativi contano come 0.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei valori nel locale corrente; le conversioni usano sempre Intl con style percent.' },
    { name: 'height', type: 'number', default: '44', description: 'Altezza in px di ogni fase (minimo 16).' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid usa gradienti, angoli arrotondati e raccordi colorati; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico, poi sul pulsante della tabella.' },
    { keys: 'Frecce', action: 'Fase successiva/precedente: evidenzia la fase e annuncia etichetta, valore e conversione.' },
    { keys: 'Home / Fine', action: 'Prima / ultima fase.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    '<figure> con <figcaption>; area role="group" focalizzabile con suggerimento e annunci aria-live="polite".',
    'Etichette, valori e conversioni sono scritti accanto a ogni barra: il colore non è necessario per leggere il grafico.',
    'Tabella dati con colonne "Valore" e "Conversione" (quota sulla prima fase).',
    'In forced-colors le barre diventano Canvas con bordo CanvasText; la fase attiva ha bordo Highlight.',
  ],
  responsive: [
    'Larghezza misurata con ResizeObserver: colonne di etichette e valori al massimo al 30% ciascuna, le etichette lunghe vengono troncate (testo completo nella lettura attiva e nella tabella).',
    'Animazione di comparsa solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Aspetto vivid: appearance="vivid" (o look expressive) dipinge le barre con gradienti tra --dc-color-data-N e --dc-color-accent-default; in forced-colors torna piatto.',
    'Colori: --dc-color-data-1…6 (ciclici, uno per fase); raccordi --dc-color-surface-subtle.',
    'Selettori stabili: .dc-funnel-chart-funnelChart (fase attiva: g[data-active]), .dc-funnel-chart-connector, .dc-chart-table.',
  ],
  commonMistakes: [
    'Fasi non ordinate o non sequenziali: la conversione è sempre calcolata sulla prima fase.',
    'Usare valori in crescita: l’imbuto perde significato, usa BarChart.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Currency', title: 'Valuta e altezza delle fasi' },
    { name: 'InCard', title: 'In una card' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Gradienti e raccordi colorati con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/FunnelChart/FunnelChart.test.tsx'],
    limits: [
      'La conversione è solo rispetto alla prima fase (non tra fasi consecutive).',
      'Se una fase supera la prima, le larghezze sono scalate sul valore massimo.',
      'Su schermi molto stretti etichette e valori occupano fino al 60% della larghezza.',
    ],
  },
};
