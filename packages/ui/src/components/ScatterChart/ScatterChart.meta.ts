import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ScatterChart', 'type ScatterChartSeries', 'type ScatterChartPoint'],
  name: 'ScatterChart',
  slug: 'scatter-chart',
  category: 'charts',
  summary:
    'Grafico a dispersione (e a bolle) in SVG, senza dipendenze: punti su due assi numerici lineari, serie distinte da colore e forma dei marker, navigazione da tastiera tra i punti e tabella dati accessibile.',
  whenToUse: [
    'Mostrare la relazione tra due grandezze numeriche (superficie e fatturato, impegno e valore).',
    'Individuare correlazioni, gruppi e valori anomali.',
    'Aggiungere una terza grandezza con la dimensione della bolla (size).',
  ],
  whenNotToUse: [
    'Andamenti lungo categorie ordinate o nel tempo: usa LineChart.',
    'Confronto di quantità tra categorie: usa BarChart.',
    'Migliaia di punti o zoom interattivo: serve una libreria dedicata.',
  ],
  props: [
    { name: 'series', type: '{ id: string; label: string; points: { x: number; y: number; label?: string; size?: number }[] }[]', required: true, description: 'Serie di punti; label dà il nome al punto (altrimenti la sua posizione), size lo trasforma in una bolla.' },
    { name: 'xLabel / yLabel', type: 'string', description: 'Titoli degli assi orizzontale e verticale; sono anche le intestazioni della tabella dati.' },
    { name: 'xFormatOptions / yFormatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valori e tacche di ciascun asse (valuta, percentuale, compact…) nel locale corrente.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo (periodo, unità, fonte).' },
    { name: 'height', type: 'number', default: '280', description: 'Altezza del grafico in px; la larghezza segue il contenitore.' },
    { name: 'showGrid', type: 'boolean', default: 'true', description: 'Linee guida orizzontali e verticali in corrispondenza delle tacche.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Legenda; con più serie ogni voce è un pulsante che mostra/nasconde la serie.' },
    { name: 'hiddenSeries / defaultHiddenSeries', type: 'string[]', description: 'Id delle serie nascoste (controllato / non controllato).' },
    { name: 'onHiddenSeriesChange', type: '(ids: string[]) => void', description: 'Chiamata quando la legenda cambia le serie visibili.' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid riempie marker e bolle con gradienti e bagliori con gli stessi colori del tema; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico (e poi sulla legenda e sul pulsante della tabella).' },
    { keys: 'Freccia destra / giù', action: 'Punto successivo in ordine di x crescente (tra tutte le serie visibili): mostra e annuncia serie, punto e valori.' },
    { keys: 'Freccia sinistra / su', action: 'Punto precedente.' },
    { keys: 'Home / Fine', action: 'Punto con x minima / massima.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    'Struttura <figure> + <figcaption>; l’area del grafico è un role="group" focalizzabile, nominato dal titolo e descritto da un suggerimento sull’uso delle frecce.',
    'Lo spostamento da tastiera annuncia "serie — punto: x, y" in una regione aria-live="polite"; il punto attivo è ingrandito e indicato da linee guida su entrambi gli assi.',
    'L’SVG è decorativo (aria-hidden): tutti i punti sono nella tabella (punto, serie, x, y) aperta dal pulsante "Mostra tabella dati".',
    'Le serie non dipendono solo dal colore: la forma dei marker cambia per serie; la legenda usa aria-pressed.',
    'In forced-colors marker e bolle usano CanvasText, il punto attivo Highlight.',
  ],
  responsive: [
    'La larghezza è misurata con ResizeObserver (fallback a 560 px in SSR); il numero di tacche dell’asse X si adatta e le etichette vengono diradate quando non c’è spazio.',
    'Animazione di comparsa solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Colori delle serie: token --dc-color-data-1…6, assegnati ciclicamente; griglia e assi con --dc-color-border-subtle e --dc-color-border-strong.',
    'Bolle: raggio da 4 a 18 px proporzionale alla radice di size (l’area cresce con il valore).',
    'Aspetto vivid: appearance="vivid" (o look expressive) riempie i marker e sfuma le bolle verso --dc-color-accent-default.',
    'Selettori stabili: .dc-scatter-chart-scatterChart, [data-series], .dc-chart-marker, .dc-chart-guide, .dc-chart-table.',
  ],
  commonMistakes: [
    'Usare ScatterChart per categorie (mesi, nomi): l’asse X è numerico e lineare.',
    'Dimenticare xLabel e yLabel: senza titoli degli assi i valori sono ambigui, anche nella tabella.',
    'Passare in size valori già trasformati in raggio: size è una grandezza, la scala a radice è applicata dal componente.',
  ],
  examples: [
    { name: 'Basic', title: 'Più serie con titoli degli assi' },
    { name: 'Bubbles', title: 'Grafico a bolle', description: 'size controlla l’area di ogni bolla.' },
    { name: 'ControlledSeries', title: 'Serie visibili controllate' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Marker pieni e bagliori con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/ScatterChart/ScatterChart.test.tsx'],
    limits: [
      'Solo assi lineari (nessuna scala logaritmica) e nessuna linea di tendenza.',
      'Nessuno zoom né virtualizzazione: pensato per decine/centinaia di punti; i punti sovrapposti restano sovrapposti.',
      'Larghezza delle etichette stimata (nessuna misura del testo).',
      'L’SVG resta disegnato da sinistra a destra anche in RTL.',
    ],
  },
};
