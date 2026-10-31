import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['RadarChart'],
  name: 'RadarChart',
  slug: 'radar-chart',
  category: 'charts',
  summary:
    'Grafico radar (a ragnatela) in SVG, senza dipendenze: confronta una o più serie su tre o più dimensioni disposte attorno a un centro, con navigazione da tastiera tra gli assi e tabella dati accessibile.',
  whenToUse: [
    'Profili multidimensionali: competenze, punteggi di valutazione, caratteristiche di un prodotto.',
    'Confronto di poche serie (2–4) sulle stesse dimensioni, tutte espresse sulla stessa scala.',
    'Evidenziare punti di forza e lacune a colpo d’occhio.',
  ],
  whenNotToUse: [
    'Dimensioni con unità o scale diverse: normalizza i dati o usa più BarChart.',
    'Andamenti nel tempo: usa LineChart.',
    'Valori precisi da confrontare o molte serie sovrapposte: usa BarChart o una tabella.',
    'Meno di tre dimensioni: il poligono non ha senso, usa BarChart.',
  ],
  props: [
    { name: 'axes', type: 'string[]', required: true, description: 'Dimensioni disposte in senso orario a partire dalle ore 12 (almeno 3).' },
    { name: 'series', type: '{ id: string; label: string; data: (number | null)[] }[]', required: true, description: 'Serie; data[i] corrisponde a axes[i]. null salta l’asse (il poligono collega gli assi disponibili).' },
    { name: 'max', type: 'number', description: 'Valore dell’anello esterno; di default è il massimo “arrotondato” dei dati visibili. I valori sono limitati a 0…max.' },
    { name: 'title', type: 'ReactNode', description: 'Titolo visibile (figcaption); dà il nome al grafico e alla tabella dati.' },
    { name: 'description', type: 'ReactNode', description: 'Descrizione visibile sotto il titolo (scala, periodo, fonte).' },
    { name: 'size', type: 'number', default: '280', description: 'Diametro massimo del radar in px; il grafico si riduce con il contenitore.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato di valori ed etichette degli anelli (percentuale, unità, decimali…) nel locale corrente.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Legenda; con più serie ogni voce è un pulsante che mostra/nasconde la serie.' },
    { name: 'hiddenSeries / defaultHiddenSeries', type: 'string[]', description: 'Id delle serie nascoste (controllato / non controllato).' },
    { name: 'onHiddenSeriesChange', type: '(ids: string[]) => void', description: 'Chiamata quando la legenda cambia le serie visibili.' },
    { name: 'appearance', type: "'auto' | 'flat' | 'vivid'", default: "'auto'", description: 'Stile grafico: vivid usa aree sfumate, bagliori e anelli tenui con gli stessi colori del tema; auto diventa vivid nel look expressive.' },
  ],
  inherits: 'Attributi HTML di <figure> (id, style, data-*, aria-*…); il ref punta alla <figure>.',
  keyboard: [
    { keys: 'Tab', action: 'Porta il focus sull’area del grafico (e poi sulla legenda e sul pulsante della tabella).' },
    { keys: 'Freccia destra / giù', action: 'Asse successivo in senso orario (dall’ultimo torna al primo): mostra e annuncia i valori di tutte le serie visibili.' },
    { keys: 'Freccia sinistra / su', action: 'Asse precedente.' },
    { keys: 'Home / Fine', action: 'Primo / ultimo asse.' },
    { keys: 'Esc', action: 'Chiude la lettura attiva.' },
  ],
  accessibility: [
    'Struttura <figure> + <figcaption>; l’area del grafico è un role="group" focalizzabile, nominato dal titolo e descritto da un suggerimento sull’uso delle frecce.',
    'Lo spostamento da tastiera aggiorna una regione aria-live="polite" con asse e valori formattati; l’asse attivo è evidenziato (raggio ed etichetta).',
    'L’SVG è decorativo (aria-hidden): i dati completi sono nella tabella (righe = assi, colonne = serie) aperta dal pulsante "Mostra tabella dati".',
    'Le serie non dipendono solo dal colore: tratteggio del contorno e forma dei marker cambiano per serie; la legenda usa aria-pressed.',
    'In forced-colors contorni e aree usano CanvasText, l’asse attivo Highlight.',
  ],
  responsive: [
    'L’SVG usa un viewBox: si riduce proporzionalmente con il contenitore fino a size px di diametro, lasciando spazio alle etichette degli assi.',
    'Animazione di comparsa solo con prefers-reduced-motion: no-preference.',
  ],
  customization: [
    'Aspetto vivid: appearance="vivid" (o look expressive) dipinge le aree con gradienti tra --dc-color-data-N e --dc-color-accent-default, anelli riempiti con --dc-color-surface-subtle e raggio attivo in --dc-color-action-primary.',
    'Colori delle serie: token --dc-color-data-1…6, assegnati ciclicamente.',
    'Griglia e testo: --dc-color-border-subtle, --dc-color-border-strong, --dc-color-text-muted, --dc-color-text-secondary.',
    'Selettori stabili: .dc-radar-chart-radarChart, .dc-chart-area, .dc-chart-line, .dc-chart-marker, [data-series].',
  ],
  commonMistakes: [
    'Mescolare dimensioni con scale diverse (es. euro e percentuali) sullo stesso radar.',
    'Passare meno di tre assi o data con lunghezza diversa da axes.',
    'Lasciare max automatico quando la scala è nota (es. 100 o 5): imposta max per confronti coerenti tra grafici.',
    'Sovrapporre troppe serie: oltre 3–4 i poligoni diventano illeggibili.',
  ],
  examples: [
    { name: 'Basic', title: 'Confronto tra serie' },
    { name: 'SingleSeries', title: 'Serie singola senza legenda' },
    { name: 'WithMissingValues', title: 'Valori mancanti', description: 'null salta l’asse; il poligono collega i valori disponibili.' },
    { name: 'ControlledSeries', title: 'Serie visibili controllate' },
    { name: 'Vivid', title: 'Aspetto vivid', description: 'Aree sfumate e bagliori con i colori del tema.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/RadarChart/RadarChart.test.tsx'],
    limits: [
      'Un’unica scala radiale lineare da 0 a max per tutti gli assi; valori negativi trattati come 0.',
      'Larghezza delle etichette stimata (nessuna misura del testo): etichette molto lunghe riducono lo spazio del radar.',
      'Gli assi sono disposti in senso orario anche in RTL.',
    ],
  },
};
