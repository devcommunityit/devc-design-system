import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['LineChart'],
  name: 'LineChart',
  slug: 'line-chart',
  category: 'charts',
  summary:
    'Grafico a linee o ad area in SVG, senza dipendenze: più serie distinte da colore, tratteggio e forma dei marker, navigazione da tastiera e tabella dati accessibile.',
  whenToUse: [
    'Andamenti nel tempo o lungo categorie ordinate (mesi, giorni, versioni).',
    'Confronto di poche serie (fino a 6 restano distinguibili per colore, tratteggio e marker).',
    'Variante area per enfatizzare il volume di una singola serie.',
  ],
  whenNotToUse: [
    'Categorie non ordinate o confronto di quantità: usa BarChart.',
    'Parti di un totale: usa DonutChart.',
    'Tendenza compatta dentro un testo o una KPI: usa Sparkline.',
    'Migliaia di punti o zoom/brush interattivi: serve una libreria dedicata.',
  ],
  props: [
    { name: 'categories', type: 'string[]', required: true, description: 'Etichette dell’asse X, in ordine.' },
    { name: 'series', type: '{ id: string; label: string; data: (number | null)[] }[]', required: true, description: 'Serie; data[i] corrisponde a categories[i]. null lascia un vuoto nella linea.' },
    { name: 'variant', type: "'line' | 'area'", default: "'line'", description: 'Solo linee o linee con area sottostante (l’asse include lo zero).' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo (periodo, unità, fonte).' },
    { name: 'height', type: 'number', default: '240', description: 'Altezza del grafico in px; la larghezza segue il contenitore.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valori e tacche (valuta, percentuale, compact…) nel locale corrente.' },
    { name: 'showGrid', type: 'boolean', default: 'true', description: 'Linee guida orizzontali in corrispondenza delle tacche.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Legenda; con più serie ogni voce è un pulsante che mostra/nasconde la serie.' },
    { name: 'hiddenSeries / defaultHiddenSeries', type: 'string[]', description: 'Id delle serie nascoste (controllato / non controllato).' },
    { name: 'onHiddenSeriesChange', type: '(ids: string[]) => void', description: 'Chiamata quando la legenda cambia le serie visibili.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico (e poi sulla legenda e sul pulsante della tabella).' },
    { keys: 'Freccia destra / giù', action: 'Categoria successiva: mostra i valori e li annuncia.' },
    { keys: 'Freccia sinistra / su', action: 'Categoria precedente.' },
    { keys: 'Home / Fine', action: 'Prima / ultima categoria.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    'Struttura <figure> + <figcaption>; l’area del grafico è un role="group" focalizzabile, nominato dal titolo e descritto da un suggerimento sull’uso delle frecce.',
    'Lo spostamento da tastiera aggiorna una regione aria-live="polite" con categoria e valori formattati; il passaggio del mouse mostra la stessa lettura senza annunci.',
    'L’SVG è decorativo (aria-hidden): i dati completi sono nella tabella con caption, intestazioni di colonna e di riga, aperta dal pulsante "Mostra tabella dati" (aria-expanded).',
    'Le serie non dipendono solo dal colore: tratteggio e forma dei marker cambiano per serie; la legenda usa aria-pressed.',
    'In forced-colors le linee usano CanvasText e la selezione Highlight.',
  ],
  responsive: [
    'La larghezza è misurata con ResizeObserver (solo dentro un effetto; fallback a 560 px in SSR) e le etichette dell’asse X vengono diradate quando non c’è spazio.',
    'Animazione di comparsa solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Colori delle serie: token --dc-color-data-1…6 (ruoli generati dal tema), assegnati ciclicamente.',
    'Griglia, assi e testo: --dc-color-border-subtle, --dc-color-border-strong, --dc-color-text-muted.',
    'Selettori stabili: .dc-line-chart-lineChart[data-variant], .dc-chart-plot, .dc-chart-line, .dc-chart-area, .dc-chart-marker, .dc-chart-table.',
  ],
  commonMistakes: [
    'Passare data con lunghezza diversa da categories: i valori mancanti vengono trattati come vuoti.',
    'Usare 0 al posto di null per i dati mancanti, falsando l’andamento.',
    'Formattare i numeri a mano invece di usare formatOptions (ignora il locale).',
  ],
  examples: [
    { name: 'Basic', title: 'Più serie' },
    { name: 'Area', title: 'Area con valuta compatta' },
    { name: 'WithGaps', title: 'Dati mancanti', description: 'I valori null interrompono la linea; i punti isolati restano visibili come marker.' },
    { name: 'ControlledSeries', title: 'Serie visibili controllate' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/LineChart/LineChart.test.tsx'],
    limits: [
      'Solo segmenti rettilinei (nessuna interpolazione curva), un solo asse Y lineare e categorie discrete sull’asse X.',
      'Nessuno zoom/brush né virtualizzazione: pensato per decine/centinaia di punti.',
      'Larghezza delle etichette stimata (nessuna misura del testo): etichette molto lunghe possono sovrapporsi o essere tagliate.',
      'L’SVG resta disegnato da sinistra a destra anche in RTL.',
    ],
  },
};
