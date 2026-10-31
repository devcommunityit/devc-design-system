import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['RankingCard', 'RankingCardProps', 'RankingItem'],
  name: 'RankingCard',
  slug: 'ranking-card',
  category: 'dashboard',
  summary:
    'Classifica per dashboard: lista ordinata con badge di posizione (primi tre evidenziati), etichetta e descrizione, barra proporzionale decorativa e valore formattato con Intl.',
  whenToUse: [
    'Mostrare i primi elementi di una metrica (articoli più letti, prodotti più venduti, autori più attivi).',
    'Dare un colpo d’occhio sulle proporzioni tra i primi classificati.',
  ],
  whenNotToUse: [
    'Dati da ordinare, filtrare o paginare: usa DataTable.',
    'Confronti tra serie o nel tempo: usa BarChart o LineChart.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della card; dà anche il nome accessibile alla lista.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'items', type: 'RankingItem[] ({ id, label, value, description?, icon? })', required: true, description: 'Elementi già in ordine di classifica (il primo è il n. 1).' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei valori (valuta, percentuale, unità…).' },
    { name: 'maxItems', type: 'number', description: 'Mostra solo i primi N elementi.' },
    { name: 'barStyle', type: "'series' | 'gradient'", default: "'series'", description: 'Colore delle barre: un colore dati per riga (--dc-color-data-1…6) o il gradiente del brand.' },
    { name: 'footer', type: 'ReactNode', description: 'Link alla lista completa o nota.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*, aria-*).',
  keyboard: [],
  accessibility: [
    'Elenco <ol> con nome dal titolo (aria-labelledby): la posizione è annunciata dalla lista e scritta nel badge.',
    'Le barre sono aria-hidden: il valore è sempre testo formattato.',
    'L’evidenza dei primi tre non usa solo il colore: il numero di posizione è visibile.',
    'In forced-colors badge e barre usano Canvas/CanvasText/Highlight con bordo.',
  ],
  responsive: [
    'Etichette lunghe vanno a capo; il valore resta allineato alla fine della riga.',
    'Usa Grid con minItemWidth per affiancare più classifiche.',
  ],
  customization: [
    'Token: --dc-look-radius-container, --dc-color-data-1…6, --dc-gradient-accent, --dc-color-action-secondary per i badge.',
    'Selettori stabili: .dc-ranking-card-ranking[data-bar-style], .dc-ranking-card-item[data-top], .dc-ranking-card-rank, .dc-ranking-card-bar[data-series].',
  ],
  commonMistakes: [
    'Passare gli elementi non ordinati: il componente non riordina, la posizione segue l’ordine dell’array.',
    'Affidare un’informazione alla sola barra: riportala nel valore o nella descrizione.',
    'Mostrare decine di righe: limita con maxItems e aggiungi un link nel footer.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Gradient', title: 'Barre con gradiente', description: 'Valori in valuta e link alla lista completa.' },
    { name: 'MaxItems', title: 'Numero massimo di elementi', description: 'maxItems e griglia responsive.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/RankingCard/RankingCard.test.tsx'],
    limits: [
      'Le barre sono proporzionali al valore assoluto massimo visibile: valori negativi sono mostrati come lunghezze positive.',
      'Nessun ordinamento automatico né interazione sulle righe.',
    ],
  },
};
