import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  entry: 'widgets',
  exports: ['KanbanBoard', 'type KanbanBoardProps', 'type KanbanColumn', 'type KanbanCard', 'type KanbanMove'],
  name: 'KanbanBoard',
  slug: 'kanban-board',
  category: 'data',
  summary: 'Bacheca Kanban con drag & drop tra colonne, riordino delle schede, selettore di stato opzionale e controlli alternativi senza trascinamento.',
  whenToUse: ['Workflow visuali con un numero contenuto di colonne e schede.', 'Gestione di attività quando gli utenti devono poter spostare le schede anche senza trascinamento.'],
  whenNotToUse: ['Liste o tabelle molto lunghe: preferisci DataTable o una lista virtualizzata.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome accessibile della regione della bacheca.' },
    { name: 'columns / defaultColumns', type: 'KanbanColumn<TCard>[]', default: '— / []', description: 'Colonne controllate o iniziali; ogni colonna contiene le proprie schede.' },
    { name: 'onColumnsChange', type: '(columns: KanbanColumn<TCard>[]) => void', description: 'Riceve il nuovo stato dopo lo spostamento di una scheda.' },
    { name: 'onCardMove', type: '(move: KanbanMove<TCard>) => void', description: 'Identifica la scheda spostata, colonne e posizioni precedenti e nuove.' },
    { name: 'showStatusSelect', type: 'boolean', default: 'false', description: 'Mostra un selettore per spostare direttamente una card in qualsiasi colonna. La colonna di appartenenza rappresenta lo stato.' },
    { name: 'renderCard', type: '(card: TCard) => ReactNode', description: 'Contenuto personalizzato per la scheda; i controlli di spostamento restano gestiti dal componente.' },
    { name: 'emptyState', type: 'ReactNode', default: 'Messaggio localizzato', description: 'Contenuto mostrato nelle colonne vuote.' },
    { name: 'className', type: 'string', description: 'Classe CSS applicata al contenitore della bacheca.' },
  ],
  inherits: 'KanbanCard include id e title obbligatori, description ReactNode opzionale e labels string[] opzionali. KanbanColumn include id, title, description opzionale e cards.',
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'Raggiunge le azioni di spostamento di ogni scheda.' },
    { keys: 'Invio sulla maniglia, Tab, frecce, Invio', action: 'Avvia il trascinamento, sceglie colonna e posizione e rilascia. Esc annulla.' },
    { keys: 'Enter / Spazio', action: 'Attiva l’azione e sposta la scheda nella colonna adiacente indicata; il focus resta sulla scheda spostata.' },
  ],
  accessibility: [
    'La bacheca è una regione nominata; ogni colonna è una sezione con intestazione e lista di schede.',
    'Ogni azione ha un nome accessibile che specifica scheda e colonna di destinazione.',
    'Drag & drop tramite React Aria: puntatore, touch e tastiera, indicatori di inserimento e annunci accessibili.',
    'Pulsanti di spostamento e selettore opzionale sono alternative senza trascinamento.',
  ],
  responsive: ['Le colonne scorrono orizzontalmente sui viewport stretti; il contenuto lungo va a capo.'],
  customization: ['Usa renderCard per personalizzare il contenuto della scheda e className per lo stile esterno.'],
  commonMistakes: ['Usare id non stabili o duplicati per colonne e schede.', 'Aspettarsi persistenza automatica: salva columns nel consumer tramite onColumnsChange.'],
  examples: [
    { name: 'Basic', title: 'Bacheca iniziale' },
    { name: 'Controlled', title: 'Stato controllato' },
    { name: 'CustomCards', title: 'Contenuto personalizzato delle schede' },
    { name: 'Workflow', title: 'Workflow completo con cambio di stato' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/KanbanBoard/KanbanBoard.test.tsx'],
    limits: ['Nessuna persistenza o gestione di rete; salva il nuovo stato nel consumer.', 'Nessun riordino delle colonne o virtualizzazione. Il trascinamento è limitato alla stessa bacheca.'],
  },
};
