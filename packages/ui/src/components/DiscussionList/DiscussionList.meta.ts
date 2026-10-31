import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DiscussionList', 'DiscussionListProps', 'DiscussionListItem'],
  name: 'DiscussionList',
  slug: 'discussion-list',
  category: 'community',
  summary:
    'Elenco numerato (01, 02…) di discussioni del forum: titolo cliccabile, numero di risposte, ultima attività (testo o RelativeTime), tag opzionale e indicatore “Nuovo”.',
  whenToUse: [
    'Sidebar “Discussioni calde” o “Domande recenti” di un portale community.',
    'Elenchi brevi di thread dove l’ordine conta (classifica di attività, top della settimana).',
  ],
  whenNotToUse: [
    'Post con miniatura e voto: usa PostList.',
    'Articoli con copertina ed estratto: usa ArticleCard.',
    'Elenchi lunghi da filtrare o ordinare: usa DataTable.',
  ],
  props: [
    { name: 'items', type: 'DiscussionListItem[] ({ id, title, href?, replies?, time?, tag?, isNew? })', required: true, description: 'Thread già nell’ordine di visualizzazione.' },
    { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', description: 'Se impostato, i titoli diventano heading di quel livello.' },
    { name: 'start', type: 'number', default: '1', description: 'Numero del primo elemento (anche start nativo della lista), utile nella paginazione.' },
    { name: 'items[].time', type: 'ReactNode | Date', description: 'Ultima attività: un Date diventa RelativeTime.' },
    { name: 'items[].replies', type: 'number', description: 'Numero di risposte, formattato con Intl e pluralizzato (“84 risposte”).' },
    { name: 'items[].isNew', type: 'boolean', description: 'Mostra l’etichetta “Nuovo” accanto al titolo.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Sostituisce le righe con uno SkeletonList (aria-busy) mantenendo l’elemento <ol>.' },
    { name: 'loadingRows', type: 'number', default: '4', description: 'Righe scheletro durante isLoading.' },
  ],
  inherits: 'Attributi HTML di <ol> (id, aria-label, aria-labelledby, data-*).',
  keyboard: [{ keys: 'Tab', action: 'Passa da un link di discussione al successivo (e agli eventuali tag interattivi).' }],
  accessibility: [
    'Lista ordinata <ol>: la posizione è annunciata dalla lista; i numeri visibili a due cifre sono decorativi (aria-hidden).',
    'Il link del titolo copre la riga (stretched link); il tag resta sopra e cliccabile.',
    'Dai un nome alla lista con aria-label o aria-labelledby che punta al titolo della sezione.',
    'Le risposte sono testo localizzato e pluralizzato; RelativeTime espone la data esatta in datetime e title.',
  ],
  responsive: [
    'Numero a larghezza fissa, titolo e metadati vanno a capo: usabile fino a 320px.',
    'Pensata per sidebar e colonne strette; nessuna cornice, mettila in una Card se serve.',
  ],
  customization: [
    'Token: --dc-font-family-mono per i numeri, --dc-color-border-subtle per i divisori tratteggiati, --dc-color-accent-container per “Nuovo”.',
    'Selettori stabili: .dc-discussion-list-list, .dc-discussion-list-item, .dc-discussion-list-number, .dc-discussion-list-new.',
  ],
  commonMistakes: [
    'Scrivere il numero nel titolo: la numerazione è automatica (usa start per continuare da una pagina precedente).',
    'Lasciare la lista senza nome quando la sezione ha un titolo visibile: collegalo con aria-labelledby.',
    'Formattare a mano “84 risposte”: passa il numero in replies.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'InCard', title: 'In una Card', description: 'Titolo della sezione collegato con aria-labelledby e date con RelativeTime.' },
    { name: 'StartNumber', title: 'Numerazione da start', description: 'Seconda pagina che riparte da 11.' },
    { name: 'Loading', title: 'Caricamento', description: 'Attiva/disattiva isLoading: lo skeleton ha la stessa forma del contenuto.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/DiscussionList/DiscussionList.test.tsx'],
    limits: ['I numeri hanno almeno due cifre (01…99, poi 100…).', 'Nessuna paginazione o ordinamento interno.'],
  },
};
