import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Leaderboard', 'LeaderboardProps', 'LeaderboardEntry'],
  name: 'Leaderboard',
  slug: 'leaderboard',
  category: 'community',
  summary:
    'Classifica di persone per la community: posizione, avatar, nome, sottotitolo e punti formattati con Intl. I primi tre hanno badge oro, argento e bronzo; highlightId evidenzia l’utente corrente.',
  whenToUse: [
    'Top contributor, speaker o membri più attivi di un portale community.',
    'Gamification: mostrare all’utente la sua posizione tra gli altri (highlightId).',
  ],
  whenNotToUse: [
    'Classifiche di metriche non legate a persone (articoli più letti, prodotti): usa RankingCard, che mostra barre proporzionali e non ha avatar.',
    'Dati da ordinare, filtrare o paginare: usa DataTable.',
    'Profilo dettagliato di una sola persona: usa una card profilo.',
  ],
  props: [
    { name: 'items', type: 'LeaderboardEntry[] ({ id, name, src?, subtitle?, points, href? })', required: true, description: 'Persone già in ordine di classifica (la prima è la n. 1, o start).' },
    { name: 'title', type: 'ReactNode', description: 'Titolo; dà anche il nome alla lista. Senza titolo passa aria-label o aria-labelledby (vengono applicati alla lista).' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Livello del titolo.' },
    { name: 'highlightId', type: 'string', description: 'Id della riga da evidenziare (es. l’utente corrente), marcata con aria-current.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', description: 'Formato dei punti.' },
    { name: 'maxItems', type: 'number', description: 'Mostra solo i primi N elementi.' },
    { name: 'start', type: 'number', default: '1', description: 'Posizione del primo elemento, per le pagine successive.' },
    { name: 'variant', type: "'card' | 'plain'", default: "'card'", description: 'card: superficie con bordo; plain: senza cornice.' },
    { name: 'footer', type: 'ReactNode', description: 'Link alla classifica completa o nota.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Sostituisce le righe con uno SkeletonList (aria-busy) mantenendo titolo e footer.' },
    { name: 'loadingRows', type: 'number', default: '5', description: 'Righe scheletro durante isLoading.' },
  ],
  inherits: 'Attributi HTML di <div> (id, style, data-*); aria-label e aria-labelledby vanno sulla lista <ol>.',
  keyboard: [{ keys: 'Tab', action: 'Passa da un link al profilo al successivo (solo per le righe con href).' }],
  accessibility: [
    'Lista ordinata <ol> con nome dal titolo (aria-labelledby) o da aria-label; la posizione è anche testo visibile.',
    'Oro, argento e bronzo non sono l’unica informazione: il numero di posizione è sempre scritto.',
    'L’avatar è decorativo perché il nome è visibile; i punti sono testo localizzato (“12.840 pt”).',
    'La riga di highlightId ha aria-current="true" ed è evidenziata con bordo e sfondo, non solo con il colore.',
    'In forced-colors badge e riga corrente usano Canvas/CanvasText e Highlight.',
  ],
  responsive: [
    'Nome e sottotitolo vanno a capo; posizione, avatar e punti restano fissi: usabile a 320px.',
    'Variante plain per inserirla in sidebar o Card esistenti.',
  ],
  customization: [
    'Token: --dc-color-feedback-warning-* (oro), --dc-color-surface-strong (argento), --dc-color-data-5 (bronzo), --dc-color-action-secondary e --dc-look-fill-tonal per la riga corrente, --dc-gradient-accent per il badge dell’utente fuori dal podio.',
    'Selettori stabili: .dc-leaderboard-leaderboard[data-variant], .dc-leaderboard-item[data-top][data-current], .dc-leaderboard-rank, .dc-leaderboard-points.',
  ],
  commonMistakes: [
    'Passare gli elementi non ordinati: il componente non riordina.',
    'Usare Leaderboard per metriche senza persone: RankingCard è più adatta.',
    'Dimenticare il nome della lista quando non c’è title.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'HighlightCurrentUser', title: 'Utente corrente e footer', description: 'highlightId e link alla classifica completa.' },
    { name: 'PlainWithStart', title: 'Senza cornice, da start', description: 'Posizioni 11–13 con l’utente corrente evidenziato.' },
    { name: 'Loading', title: 'Caricamento', description: 'Attiva/disattiva isLoading: lo skeleton ha la stessa forma del contenuto.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Leaderboard/Leaderboard.test.tsx'],
    limits: ['I badge podio dipendono dalla posizione reale (start + indice): con start > 3 non ci sono medaglie.', 'Nessun ordinamento automatico né gestione dei pari merito.'],
  },
};
