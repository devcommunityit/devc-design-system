import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['FileUpload', 'validateFiles', 'matchesAccept'],
  name: 'FileUpload',
  slug: 'file-upload',
  category: 'forms',
  summary: 'Selezione di file con pulsante o drag-and-drop, controlli di tipo, dimensione e numero, elenco con stato e rimozione. L’upload è delegato al consumer.',
  whenToUse: ['Allegati in form, caricamento documenti o immagini.'],
  whenNotToUse: ['Avatar o immagini con ritaglio: serve un editor dedicato.', 'Caricamenti di cartelle intere.'],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Anatomia di campo; il gruppo è etichettato dalla label.' },
    { name: 'value / defaultValue / onChange', type: 'FileUploadItem[]', description: 'Elenco controllato o non controllato ({ id, file, status, progress?, error? }).' },
    { name: 'onFilesAdded', type: '(items) => void', description: 'Nuovi file accettati: avvia qui l’upload e aggiorna lo stato tramite value.' },
    { name: 'onReject', type: '(rejections) => void', description: 'File scartati con motivo: type, size o count.' },
    { name: 'accept', type: 'string[]', description: 'MIME (image/png), wildcard (image/*) o estensioni (.pdf).' },
    { name: 'maxSize', type: 'number', description: 'Dimensione massima di ciascun file in byte.' },
    { name: 'maxFiles', type: 'number', description: 'Numero massimo complessivo di file.' },
    { name: 'allowsMultiple', type: 'boolean', default: 'true', description: 'Con false un nuovo file sostituisce il precedente.' },
    { name: 'showPreviews', type: 'boolean', default: 'false', description: 'Miniature delle immagini: le object URL sono revocate a rimozione/smontaggio.' },
    { name: 'isDisabled / isInvalid', type: 'boolean', description: 'Stati del campo.' },
  ],
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge “Sfoglia file” e i pulsanti di rimozione.' },
    { keys: 'Invio / Spazio', action: 'Apre la selezione file del sistema.' },
  ],
  accessibility: [
    'Il drag-and-drop è un’alternativa: tutto è possibile anche con il pulsante.',
    'Vincoli ed errore sono collegati al pulsante tramite aria-describedby; i file scartati sono annunciati in una regione live.',
    'Lo stato di ogni file è testuale (Pronto, Caricamento, Caricato, Non riuscito), non solo colore.',
  ],
  responsive: ['Area di rilascio e elenco a tutta larghezza; nomi lunghi vanno a capo.'],
  customization: ['className e style sul contenitore; tutti i testi di sistema sono traducibili con LocaleProvider.'],
  commonMistakes: [
    'Considerare sufficiente la validazione client: tipo e dimensione vanno verificati di nuovo sul server (anche il contenuto, non solo l’estensione).',
    'Dimenticare di aggiornare lo stato dopo l’upload: il componente non effettua richieste di rete.',
  ],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Constraints', title: 'Tipo, dimensione, numero e anteprime' },
    { name: 'SimulatedUpload', title: 'Upload simulato (controllato)' },
    { name: 'States', title: 'Stati' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/FileUpload/FileUpload.test.tsx'],
    limits: ['La validazione client non sostituisce quella server.', 'Il controllo del tipo si basa su MIME/estensione dichiarati dal browser, non sul contenuto.'],
  },
};