import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['HeatmapChart'],
  name: 'HeatmapChart',
  slug: 'heatmap-chart',
  category: 'charts',
  summary:
    'Mappa di calore in SVG, senza dipendenze: una griglia righe × colonne in cui l’intensità del colore cresce con il valore, con navigazione da tastiera in due dimensioni, scala min–max e tabella dati accessibile.',
  whenToUse: [
    'Valori su due dimensioni categoriali: giorno × ora, canale × dispositivo, team × mese.',
    'Individuare a colpo d’occhio picchi, cali e schemi ricorrenti in una matrice.',
    'Matrici di dimensione contenuta (decine di righe e colonne).',
  ],
  whenNotToUse: [
    'Valori da confrontare con precisione: l’intensità del colore è approssimativa, usa BarChart o una tabella.',
    'Andamenti nel tempo di poche serie: usa LineChart.',
    'Valori con segno (positivi/negativi): la scala è sequenziale, a un solo colore.',
    'Matrici molto grandi (migliaia di celle): serve una visualizzazione dedicata.',
  ],
  props: [
    { name: 'rows', type: 'string[]', required: true, description: 'Etichette delle righe, dall’alto verso il basso.' },
    { name: 'columns', type: 'string[]', required: true, description: 'Etichette delle colonne, da sinistra a destra.' },
    { name: 'values', type: '(number | null)[][]', required: true, description: 'Matrice dei valori: values[r][c] corrisponde a rows[r] × columns[c]. null è una cella senza dati.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo (periodo, unità, fonte).' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei valori (percentuale, valuta, compact…) nel locale corrente.' },
    { name: 'cellHeight', type: 'number', default: '32', description: 'Altezza di ogni riga in px; la larghezza delle celle segue il contenitore.' },
    { name: 'colorIndex', type: 'number', default: '0', description: 'Colore dati della scala (0 = --dc-color-data-1 … 5 = --dc-color-data-6, ciclico).' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Scala di colore dal minimo al massimo con i valori formattati.' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid usa celle più arrotondate e distanziate e un gradiente nella cella; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico (e poi sul pulsante della tabella).' },
    { keys: 'Freccia destra / sinistra', action: 'Colonna successiva / precedente nella stessa riga (la prima pressione attiva la prima cella).' },
    { keys: 'Freccia giù / su', action: 'Riga successiva / precedente nella stessa colonna.' },
    { keys: 'Home / Fine', action: 'Prima / ultima cella della riga.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    'Struttura <figure> + <figcaption>; l’area del grafico è un role="group" focalizzabile, nominato dal titolo e descritto da un suggerimento sull’uso delle frecce.',
    'Ogni spostamento da tastiera annuncia "riga · colonna: valore" in una regione aria-live="polite"; la cella attiva è contornata e le sue etichette sono in grassetto.',
    'L’SVG è decorativo (aria-hidden): la matrice completa è nella tabella (righe e colonne con intestazioni) aperta dal pulsante "Mostra tabella dati".',
    'Le celle senza dati non sono solo “più chiare”: mostrano un trattino, distinguibile da un valore minimo.',
    'In forced-colors le celle usano CanvasText con la stessa opacità, il contorno attivo Highlight.',
  ],
  responsive: [
    'La larghezza è misurata con ResizeObserver (fallback a 560 px in SSR); le colonne si stringono e le etichette vengono diradate quando non c’è spazio.',
    'L’altezza dipende dal numero di righe (cellHeight × righe).',
    'Animazione di comparsa solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Colore della scala con colorIndex (token --dc-color-data-1…6); celle vuote e sfondo con --dc-color-surface-subtle.',
    'Aspetto vivid: appearance="vivid" (o look expressive) arrotonda e distanzia le celle e le dipinge con un gradiente verso --dc-color-accent-default.',
    'Selettori stabili: .dc-heatmap-chart-heatmapChart, [data-cell], [data-empty], .dc-chart-fill, .dc-chart-table.',
  ],
  commonMistakes: [
    'Righe di values con lunghezza diversa da columns: le celle mancanti vengono trattate come vuote.',
    'Usare 0 al posto di null per i dati mancanti, che diventano indistinguibili da un valore basso.',
    'Affidarsi solo al colore per valori critici: affianca la tabella dati o un riepilogo testuale.',
  ],
  examples: [
    { name: 'Basic', title: 'Giorni × fasce orarie' },
    { name: 'Percent', title: 'Percentuali e colore personalizzato' },
    { name: 'WithMissingValues', title: 'Celle senza dati', description: 'null mostra solo lo sfondo con un trattino.' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Celle arrotondate e sfumate con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/HeatmapChart/HeatmapChart.test.tsx'],
    limits: [
      'Scala sequenziale lineare a un solo colore (nessuna scala divergente o a soglie).',
      'Le etichette delle colonne vengono diradate e non ruotate; larghezza del testo stimata.',
      'La griglia resta disegnata da sinistra a destra anche in RTL.',
    ],
  },
};
