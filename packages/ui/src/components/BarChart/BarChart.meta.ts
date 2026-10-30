import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['BarChart'],
  name: 'BarChart',
  slug: 'bar-chart',
  category: 'charts',
  summary:
    'Grafico a barre in SVG, senza dipendenze: verticale o orizzontale, raggruppato o impilato, con texture per serie, navigazione da tastiera e tabella dati accessibile.',
  whenToUse: [
    'Confrontare quantità tra categorie (regioni, prodotti, trimestri).',
    'Impilato per mostrare composizione e totale per categoria.',
    'Orizzontale quando le etichette delle categorie sono lunghe o numerose.',
  ],
  whenNotToUse: [
    'Andamenti continui nel tempo con molti punti: usa LineChart.',
    'Quote di un unico totale: usa DonutChart.',
    'Un singolo valore rispetto a un massimo: usa Meter o Progress.',
  ],
  props: [
    { name: 'categories', type: 'string[]', required: true, description: 'Categorie (un gruppo di barre ciascuna), in ordine.' },
    { name: 'series', type: '{ id: string; label: string; data: (number | null)[] }[]', required: true, description: 'Serie; data[i] corrisponde a categories[i]. null non disegna la barra.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Colonne verticali o barre orizzontali.' },
    { name: 'layout', type: "'grouped' | 'stacked'", default: "'grouped'", description: 'Serie affiancate o impilate (positivi e negativi impilati separatamente).' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo.' },
    { name: 'height', type: 'number', default: '240 (orizzontale: 40 px per categoria, min 160)', description: 'Altezza in px; la larghezza segue il contenitore.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valori e tacche nel locale corrente.' },
    { name: 'showGrid', type: 'boolean', default: 'true', description: 'Linee guida in corrispondenza delle tacche dei valori.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Legenda; con più serie ogni voce è un pulsante che mostra/nasconde la serie.' },
    { name: 'hiddenSeries / defaultHiddenSeries', type: 'string[]', description: 'Id delle serie nascoste (controllato / non controllato).' },
    { name: 'onHiddenSeriesChange', type: '(ids: string[]) => void', description: 'Chiamata quando la legenda cambia le serie visibili.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico, poi sulla legenda e sul pulsante della tabella.' },
    { keys: 'Freccia destra / giù', action: 'Categoria successiva: evidenzia la fascia e annuncia i valori.' },
    { keys: 'Freccia sinistra / su', action: 'Categoria precedente.' },
    { keys: 'Home / Fine', action: 'Prima / ultima categoria.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    '<figure> con <figcaption>; area del grafico role="group" focalizzabile con suggerimento (aria-describedby) e annunci aria-live="polite".',
    'Le serie si distinguono anche senza colore: ogni serie dopo la prima ha una texture (tratteggio, puntini, righe) ripetuta nella legenda.',
    'Tabella dati completa (caption, intestazioni di colonna e di riga) aperta da un pulsante con aria-expanded.',
    'In forced-colors le barre diventano Canvas con bordo e texture CanvasText; la categoria attiva ha un contorno Highlight.',
  ],
  responsive: [
    'Larghezza misurata con ResizeObserver (fallback SSR 560 px); etichette diradate quando non c’è spazio.',
    'In orizzontale le etichette lunghe vengono troncate con "…" (al massimo 40% della larghezza); il testo completo è nella tabella.',
    'Animazione di comparsa solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Colori: --dc-color-data-1…6 (ciclici); fascia attiva --dc-color-surface-subtle; griglia --dc-color-border-subtle.',
    'Selettori stabili: .dc-bar-chart-barChart[data-orientation][data-layout], .dc-chart-fill, .dc-chart-activeBand, .dc-chart-table.',
  ],
  commonMistakes: [
    'Impilare serie con unità diverse: il totale non ha significato.',
    'Usare l’orientamento verticale con etichette lunghe: preferisci orientation="horizontal".',
    'Usare 0 al posto di null per i dati mancanti.',
  ],
  examples: [
    { name: 'Grouped', title: 'Raggruppato' },
    { name: 'Stacked', title: 'Impilato' },
    { name: 'Horizontal', title: 'Orizzontale con etichette lunghe' },
    { name: 'NegativeValues', title: 'Valori negativi' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/BarChart/BarChart.test.tsx'],
    limits: [
      'Un solo asse dei valori lineare; nessuna etichetta di valore sopra le barre.',
      'Larghezza delle etichette stimata, non misurata: con font molto larghi possono sovrapporsi.',
      'Nessuno zoom né virtualizzazione; l’SVG resta disegnato da sinistra a destra anche in RTL.',
    ],
  },
};
