import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  entry: 'widgets',
  exports: ['FileBrowser', 'type FileBrowserProps', 'type FileBrowserItem', 'type FileBrowserFile', 'type FileBrowserFolder'],
  name: 'FileBrowser',
  slug: 'file-browser',
  category: 'data',
  summary: 'Navigazione di cartelle con breadcrumb, selezione file e anteprime controllate dal consumer.',
  whenToUse: ['Esplorare documenti organizzati in cartelle.'],
  whenNotToUse: ['Per caricare file locali usa FileUpload; per un elenco piatto usa FileManager.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome del browser.' },
    { name: 'items', type: 'readonly FileBrowserItem[]', required: true, description: 'Albero di file e cartelle con id globalmente univoci.' },
    { name: 'folderId / defaultFolderId / onFolderChange', type: 'string | null / (id) => void', description: 'Cartella controllata o iniziale; null indica la radice.' },
    { name: 'selectedIds / defaultSelectedIds / onSelectionChange', type: 'string[] / (ids) => void', description: 'Selezione dei file.' },
    { name: 'onOpenFile / renderPreview / renderActions', type: 'funzioni', description: 'Apertura, anteprima e azioni fornite dal consumer.' },
    { name: 'rootLabel / emptyState', type: 'string / ReactNode', description: 'Etichetta della radice e stato vuoto.' },
  ],
  keyboard: [{ keys: 'Tab / Invio / Spazio', action: 'Naviga cartelle, seleziona file e apre le anteprime.' }],
  accessibility: ['Breadcrumb, pulsanti e checkbox hanno nomi accessibili; le immagini usano alt fornito dal consumer.'],
  responsive: ['Le azioni vanno a capo e le anteprime rispettano la larghezza disponibile.'],
  customization: ['Usa renderPreview e renderActions per integrare i formati e le operazioni desiderate.'],
  commonMistakes: ['Usa id univoci nell’intero albero; non aspettarti accesso automatico al filesystem.'],
  examples: [{ name: 'Browser', title: 'Cartelle e anteprime' }],
  status: { implemented: true, documented: true, tests: ['components/FileBrowser/FileBrowser.test.tsx'], limits: ['Nessun filesystem, caricamento remoto, spostamento o persistenza integrati.'] },
};
