import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SearchInput'],
  name: 'SearchInput',
  slug: 'search-input',
  category: 'forms',
  summary: 'Campo di ricerca (type="search") con icona, pulsante di cancellazione, invio con Enter e indicatore di caricamento. Ricerca, debounce e richieste sono a carico del consumer.',
  whenToUse: ['Filtro locale di liste e tabelle.', 'Ricerca globale che produce una pagina di risultati.'],
  whenNotToUse: ['Selezione di un valore da suggerimenti: usa Combobox.', 'Ricerca di comandi: usa CommandPalette.'],
  props: [
    { name: 'value / defaultValue / onChange', type: 'string', description: 'Testo della ricerca.' },
    { name: 'onSubmit', type: '(value: string) => void', description: 'Chiamato su Enter.' },
    { name: 'onClear', type: '() => void', description: 'Chiamato con il pulsante o con Escape.' },
    { name: 'isPending', type: 'boolean', default: 'false', description: 'Mostra uno Spinner con annuncio “Caricamento…”.' },
    { name: 'label / aria-label', type: 'ReactNode / string', description: 'Etichetta visibile o accessibile (obbligatoria una delle due).' },
  ],
  inherits: 'Props di react-aria-components SearchField.',
  keyboard: [
    { keys: 'Enter', action: 'Invia (onSubmit).' },
    { keys: 'Escape', action: 'Svuota il campo.' },
  ],
  accessibility: ['role="searchbox" nativo; pulsante “Cancella” etichettato e nascosto quando vuoto.', 'Annuncia il numero di risultati con una regione aria-live nel consumer.'],
  responsive: ['Occupa la larghezza del contenitore.'],
  customization: ['Il pulsante di cancellazione nativo di WebKit è nascosto per evitare duplicati.'],
  commonMistakes: ['Lanciare una richiesta a ogni tasto senza debounce.', 'Non annunciare il numero di risultati.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'LiveFilter', title: 'Filtro locale' },
    { name: 'SubmitAndPending', title: 'Invio e caricamento' },
    { name: 'Controlled', title: 'Valore controllato e onClear', description: 'Il valore vive nello stato dell’esempio: i pulsanti lo modificano dall’esterno e onClear conta le cancellazioni.' },
    { name: 'States', title: 'Stati: disabilitato, sola lettura, non valido', description: 'Errore con descrizione e campo obbligatorio; l’ultimo campo mostra contenuti in inglese.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/SearchInput/SearchInput.test.tsx'], limits: [] },
};
