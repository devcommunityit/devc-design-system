import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Sparkline'],
  name: 'Sparkline',
  slug: 'sparkline',
  category: 'charts',
  summary: 'Micro-grafico in linea (linea o area) per mostrare una tendenza accanto a un numero; il nome accessibile riassume primo, ultimo, minimo e massimo.',
  whenToUse: ['Tendenza compatta dentro KPI, tabelle o card.', 'Quando conta la forma dell’andamento più dei singoli valori.'],
  whenNotToUse: ['Quando servono assi, valori puntuali o più serie: usa LineChart.', 'Come unico veicolo di un dato importante: affianca sempre il valore in testo.'],
  props: [
    { name: 'data', type: 'number[]', required: true, description: 'Valori in ordine; i valori non finiti lasciano un vuoto.' },
    { name: 'label', type: 'string', required: true, description: 'Cosa rappresentano i dati; diventa il nome accessibile insieme al riepilogo localizzato.' },
    { name: 'variant', type: "'line' | 'area'", default: "'line'", description: 'Solo linea o linea con area.' },
    { name: 'width', type: 'number', default: '120', description: 'Larghezza in px (mai oltre il contenitore).' },
    { name: 'height', type: 'number', default: '32', description: 'Altezza in px.' },
    { name: 'colorIndex', type: 'number', default: '0', description: 'Indice del colore dati (--dc-color-data-N, ciclico).' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei valori nel riepilogo accessibile.' },
  ],
  inherits: 'Attributi SVG di <svg> (className, style, data-*, aria-*…); il ref punta all’<svg>.',
  keyboard: [],
  accessibility: [
    'role="img" con aria-label "<label>: Da <primo> a <ultimo>; minimo <min>, massimo <max>." (messaggio chartSummary, localizzato, numeri formattati con Intl).',
    'Non è focalizzabile e non ha interazioni: il valore attuale va mostrato anche in testo.',
    'In forced-colors linea e punto finale usano CanvasText.',
  ],
  responsive: ['max-inline-size: 100% e altezza proporzionale: si restringe nei contenitori stretti.'],
  customization: ['Colore: colorIndex o la variabile --_series sull’elemento.', 'Selettori stabili: .dc-sparkline-sparkline[data-variant], .dc-chart-line, .dc-chart-area.'],
  commonMistakes: ['Usare una label generica come "grafico": descrivi la metrica e il periodo.', 'Affidare alla sola sparkline un dato che l’utente deve leggere con precisione.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Area', title: 'Area e valuta' },
    { name: 'Colors', title: 'Colori dati' },
    { name: 'InCard', title: 'In una KPI' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Sparkline/Sparkline.test.tsx'],
    limits: ['Una sola serie, nessun asse né interazione.'],
  },
};
