import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: [
    'PostList',
    'PostListProps',
    'PostListItem',
    'PostListItemProps',
    'PostListItemData',
    'PostListTone',
    'VoteButton',
    'VoteButtonProps',
  ],
  name: 'PostList',
  slug: 'post-list',
  category: 'community',
  summary:
    'Elenco di post della community: miniatura con gradiente ed etichetta, titolo cliccabile, riga di metadati (autore, durata, tag) e box di voto. Accetta un array items o figli PostListItem; VoteButton è esportato anche da solo.',
  whenToUse: [
    'Feed di post o articoli in tendenza con voto della community.',
    'Liste compatte di contenuti dove il titolo è il protagonista.',
    'VoteButton: votare una domanda, un’idea o una proposta.',
  ],
  whenNotToUse: [
    'Un singolo articolo da mettere in evidenza con copertina ed estratto: usa ArticleCard.',
    'Thread numerati con risposte e orario: usa DiscussionList.',
    'Classifiche di persone con punti: usa Leaderboard.',
  ],
  props: [
    { name: 'items', type: 'PostListItemData[] ({ id, title, href?, thumbLabel?, tone?, author?, meta?, tags?, votes?, isVoted? })', description: 'Post da mostrare; in alternativa passa figli PostListItem.' },
    { name: 'onVote', type: '(id: string, isVoted: boolean) => void', description: 'Chiamata al cambio di voto di una riga di items.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', description: 'Se impostato, i titoli diventano heading di quel livello.' },
    { name: 'variant', type: "'card' | 'plain'", default: "'card'", description: 'card: superficie con bordo e raggio; plain: solo i divisori tra le righe.' },
    { name: 'PostListItem.thumb', type: 'ReactNode', description: 'Contenuto personalizzato della miniatura (immagine, icona) al posto di thumbLabel.' },
    { name: 'PostListItem.tone', type: "'brand' | 'accent' | 'data-1' … 'data-6'", default: "'brand'", description: 'Gradiente della miniatura.' },
    { name: 'PostListItem.onVoteChange', type: '(isVoted: boolean) => void', description: 'Cambio di voto della riga (figli composti).' },
    { name: 'VoteButton.count', type: 'number', required: true, description: 'Voti totali, compreso quello dell’utente se attivo.' },
    { name: 'VoteButton.isSelected / defaultSelected / onChange', type: 'boolean / boolean / (isSelected: boolean) => void', default: 'defaultSelected: false', description: 'Stato del voto, controllato o non controllato.' },
    { name: 'VoteButton.formatOptions', type: 'Intl.NumberFormatOptions', default: "{ notation: 'compact' }", description: 'Formato del conteggio visibile.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Sostituisce le righe con uno SkeletonList (aria-busy) mantenendo l’elemento <ul> e la cornice.' },
    { name: 'loadingRows', type: 'number', default: '4', description: 'Righe scheletro durante isLoading.' },
  ],
  inherits: 'PostList: attributi HTML di <ul>. PostListItem: attributi di <li>. VoteButton: props del ToggleButton di React Aria (isDisabled, autoFocus…).',
  keyboard: [
    { keys: 'Tab', action: 'Passa dal link del titolo al voto della riga, poi alla riga successiva.' },
    { keys: 'Invio', action: 'Apre il post dal link del titolo.' },
    { keys: 'Spazio / Invio', action: 'Aggiunge o rimuove il voto.' },
  ],
  accessibility: [
    'Lista semantica <ul>/<li>; dai un nome alla lista con aria-label o aria-labelledby quando ce n’è più d’una.',
    'Il link del titolo copre la riga (stretched link); voto e tag restano sopra e cliccabili.',
    'VoteButton è un ToggleButton con aria-pressed; il nome è “Vota” o “Rimuovi voto” e la descrizione (aria-describedby) riporta il conteggio completo (“186 voti”). Il numero visibile è in notazione compatta.',
    'La miniatura con etichetta è decorativa (aria-hidden); una miniatura personalizzata resta esposta, quindi dai un alt alle immagini o rendile decorative.',
    'In forced-colors miniature e voto usano colori di sistema e il voto attivo Highlight.',
  ],
  responsive: [
    'Container query: sotto i 24rem miniatura da 48px e spaziature ridotte; il box di voto resta di almeno 52 × 44px.',
    'I metadati vanno a capo; il titolo usa tutto lo spazio disponibile.',
  ],
  customization: [
    'Token: --dc-look-radius-container (lista), --dc-look-radius-control (voto), --dc-color-action-primary, --dc-color-accent-default e --dc-color-data-1…6 per le miniature, --dc-gradient-accent per il voto attivo.',
    'Selettori stabili: .dc-post-list-list[data-variant], .dc-post-list-item[data-tone], .dc-post-list-thumb, .dc-post-list-vote[data-selected].',
  ],
  commonMistakes: [
    'Passare isVoted senza aggiornarlo in onVote: lo stato controllato non cambia da solo.',
    'Aspettarsi che il conteggio cambi da solo: count/votes è sempre il totale passato dal padre.',
    'Mettere testo importante solo nella miniatura: è decorativa.',
  ],
  examples: [
    { name: 'Basic', title: 'Base', description: 'Array items con voti gestiti nel padre.' },
    { name: 'Composable', title: 'Composizione', description: 'Figli PostListItem senza cornice.' },
    { name: 'StandaloneVote', title: 'VoteButton da solo' },
    { name: 'Loading', title: 'Caricamento', description: 'Attiva/disattiva isLoading: lo skeleton ha la stessa forma del contenuto.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/PostList/PostList.test.tsx'],
    limits: [
      'headingLevel di PostList si applica solo alle righe create da items; i figli composti lo ricevono singolarmente.',
      'Nessun ordinamento o paginazione interna.',
    ],
  },
};
