import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DonutChart'],
  name: 'DonutChart',
  slug: 'donut-chart',
  category: 'charts',
  summary:
    'Grafico ad anello in SVG con il totale al centro, legenda con valori e percentuali, navigazione da tastiera tra le fette e tabella dati accessibile.',
  whenToUse: ['Mostrare le quote di un unico totale con poche parti (idealmente 2–6).', 'Riepiloghi di dashboard dove il totale è importante quanto la ripartizione.'],
  whenNotToUse: [
    'Confrontare valori simili tra loro o molte categorie: usa BarChart (le lunghezze si confrontano meglio degli angoli).',
    'Andamenti nel tempo: usa LineChart.',
    'Valori negativi o che non sommano a un totale significativo.',
  ],
  props: [
    { name: 'data', type: '{ id: string; label: string; value: number }[]', required: true, description: 'Fette in senso orario dalle ore 12; i valori negativi contano come 0.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei valori e del totale nel locale corrente; le percentuali usano sempre Intl con style percent.' },
    { name: 'size', type: 'number', default: '200', description: 'Diametro massimo in px; il grafico si restringe con il contenitore.' },
    { name: 'thickness', type: 'number', default: '18% di size', description: 'Spessore dell’anello in px.' },
    { name: 'centerLabel', type: 'string', default: 'messages.chartTotal ("Totale")', description: 'Etichetta sotto il totale e nella riga del totale della tabella.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Legenda con valore e percentuale di ogni fetta.' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid usa gradienti, forme arrotondate e bagliori con gli stessi colori del tema; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico, poi sul pulsante della tabella.' },
    { keys: 'Frecce', action: 'Fetta successiva/precedente (ciclico): evidenzia la fetta e annuncia etichetta, valore e percentuale.' },
    { keys: 'Home / Fine', action: 'Prima / ultima fetta.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    '<figure> con <figcaption>; area role="group" focalizzabile con suggerimento e annunci aria-live="polite".',
    'Le fette si distinguono anche senza colore (texture diverse ripetute nella legenda) e la legenda riporta sempre valori e percentuali in testo.',
    'Tabella dati con colonna "Valore" e riga del totale.',
    'In forced-colors le fette diventano Canvas con bordo e texture CanvasText; la fetta attiva ha bordo Highlight.',
  ],
  responsive: ['SVG con viewBox: si ridimensiona fino a size px mantenendo le proporzioni.', 'Animazione di comparsa solo con prefers-reduced-motion: no-preference.'],
  customization: [
    'Aspetto vivid: appearance="vivid" (o look expressive) dipinge con gradienti tra --dc-color-data-N e --dc-color-accent-default; in forced-colors torna piatto.',
    'Colori: --dc-color-data-1…6 (ciclici); traccia --dc-color-surface-subtle.',
    'Selettori stabili: .dc-donut-chart-donutChart (fetta attiva: g[data-active]), .dc-donut-chart-centerValue, .dc-chart-table.',
  ],
  commonMistakes: ['Usare più di 6 fette: i colori si ripetono e gli angoli diventano illeggibili; raggruppa le voci minori in "Altro".', 'Mostrare solo le percentuali senza il totale.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Currency', title: 'Valuta e etichetta del centro' },
    { name: 'InCard', title: 'In una card' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Gradienti e bagliori con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/DonutChart/DonutChart.test.tsx'],
    limits: ['Nessuna etichetta sulle fette: i valori sono nella legenda, nella lettura attiva e nella tabella.', 'Oltre 6 fette colori e texture si ripetono.'],
  },
};
