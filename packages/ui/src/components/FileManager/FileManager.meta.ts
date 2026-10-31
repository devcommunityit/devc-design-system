import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['FileManager', 'type FileManagerProps', 'type FileManagerFile'],
  name: 'FileManager',
  slug: 'file-manager',
  category: 'data',
  summary: 'Elenco accessibile di file con selezione tramite checkbox e azioni fornite dal consumer; non carica, scarica o invia file.',
  whenToUse: ['Mostrare documenti già disponibili con metadati e azioni contestuali.', 'Consentire selezione singola o multipla in una lista di file.'],
  whenNotToUse: ['Per scegliere o caricare file locali: usa FileUpload.', 'Per esplorare gerarchie di cartelle: usa TreeView o un file browser dedicato.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome accessibile dell’elenco.' },
    { name: 'files', type: 'FileManagerFile[]', required: true, description: 'File da mostrare con id e nome obbligatori; descrizione, dimensione e data sono opzionali.' },
    { name: 'selectedIds / defaultSelectedIds', type: 'string[]', default: '— / []', description: 'Selezione controllata o iniziale basata sugli id dei file.' },
    { name: 'onSelectionChange', type: '(selectedIds: string[]) => void', description: 'Riceve l’elenco aggiornato degli id selezionati.' },
    { name: 'renderActions', type: '(file: FileManagerFile) => ReactNode', description: 'Restituisce azioni controllate dal consumer per ogni file.' },
    { name: 'emptyState', type: 'ReactNode', default: '"No files"', description: 'Contenuto mostrato se files è vuoto.' },
    { name: 'className', type: 'string', description: 'Classe CSS applicata alla lista.' },
  ],
  inherits: 'FileManagerFile: { id: string; name: string; description?: string; size?: string; modified?: string }.',
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'Raggiunge i controlli di selezione e le azioni fornite dal consumer.' },
    { keys: 'Spazio', action: 'Seleziona o deseleziona il file quando il checkbox ha il focus.' },
  ],
  accessibility: [
    'La lista ha un nome accessibile e ciascun checkbox è nominato con il file corrispondente.',
    'Le azioni passate da renderActions restano normali controlli raggiungibili da tastiera.',
    'La selezione non è comunicata solo tramite colore e può essere controllata dall’applicazione.',
  ],
  responsive: ['I nomi e i metadati lunghi vanno a capo; sui viewport stretti le azioni passano a una nuova riga.'],
  customization: ['renderActions consente di fornire pulsanti o menu gestiti dal consumer.'],
  commonMistakes: ['Usare id duplicati o instabili.', 'Aspettarsi upload, download o richieste di rete: tutte le operazioni restano responsabilità del consumer.'],
  examples: [
    { name: 'Basic', title: 'Elenco di file' },
    { name: 'WithActions', title: 'Azioni fornite dal consumer' },
    { name: 'ControlledSelection', title: 'Selezione controllata' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/FileManager/FileManager.test.tsx'],
    limits: ['Nessuna gestione di file system, upload, download o rete.', 'Non include selezione multipla con shift o navigazione virtualizzata.'],
  },
};
