import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SortableList', 'type SortableItem'],
  name: 'SortableList',
  slug: 'sortable-list',
  category: 'data',
  summary:
    'Lista riordinabile (role="grid") con trascinamento del puntatore, trascinamento da tastiera tramite la maniglia e pulsanti “Sposta su/giù” come alternativa a puntatore singolo. Ogni spostamento chiama onReorder ed è annunciato.',
  whenToUse: ['Priorità, ordine delle colonne, fasi di un processo, preferiti.'],
  whenNotToUse: ['Liste lunghe (centinaia di elementi): offri un campo “posizione” o un ordinamento per criterio.', 'Ordinamento di dati tabellari: usa l’ordinamento per colonna di DataTable.'],
  props: [
    { name: 'items / defaultItems', type: 'T[] (T extends { id: Key })', default: '— / []', description: 'Ordine controllato / iniziale.' },
    { name: 'onReorder', type: '(items: T[]) => void', description: 'Nuovo array completo dopo ogni spostamento.' },
    { name: 'getLabel', type: '(item: T) => string', required: true, description: 'Testo dell’elemento per typeahead, maniglia e annunci.' },
    { name: 'children', type: '(item: T) => ReactNode', default: 'getLabel(item)', description: 'Contenuto della riga.' },
    { name: 'showMoveButtons', type: 'boolean', default: 'true', description: 'Pulsanti Sposta su/giù (WCAG 2.5.7, alternativa al trascinamento).' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disattiva il riordino; le righe restano leggibili e navigabili.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Contenuto quando la lista è vuota.' },
    { name: 'aria-label', type: 'string', required: true, description: 'Nome accessibile della lista.' },
  ],
  inherits: 'Props di react-aria-components GridList tranne items, children, selectionMode e dragAndDropHooks.',
  keyboard: [
    { keys: '↑ / ↓', action: 'Riga precedente / successiva.' },
    { keys: '← / →', action: 'Tra maniglia e pulsanti della riga.' },
    { keys: 'Enter sulla maniglia', action: 'Avvia il trascinamento da tastiera; frecce per scegliere la posizione, Enter per rilasciare, Esc per annullare.' },
    { keys: 'Enter / Spazio su Sposta su/giù', action: 'Sposta di una posizione; il focus resta sul pulsante della riga spostata (all’estremo passa all’altro pulsante).' },
  ],
  accessibility: [
    'Drag-and-drop accessibile di react-aria-components (maniglia con nome localizzato e annunci del trascinamento).',
    'Pulsanti Sposta su/giù come alternativa senza trascinamento (WCAG 2.2, 2.5.7 Dragging Movements).',
    'Una regione role="status" annuncia la nuova posizione (messages.itemMoved).',
  ],
  responsive: ['Su touch la maniglia e i pulsanti hanno target adeguati; il contenuto della riga va a capo.'],
  customization: ['Contenuto delle righe tramite children; selettori [data-dragging], [data-drop-target], [data-disabled].'],
  commonMistakes: ['Usare indici come id: dopo uno spostamento gli id devono restare stabili.', 'Non persistere l’ordine: onReorder non salva nulla da solo.'],
  examples: [
    { name: 'Basic', title: 'Non controllata' },
    { name: 'Controlled', title: 'Controllata con contenuto personalizzato' },
    { name: 'Variants', title: 'Senza pulsanti, disabilitata e vuota (English)' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/SortableList/SortableList.test.tsx'],
    limits: [
      'Il trascinamento con puntatore e da tastiera è fornito da react-aria e non è coperto dai test unitari (jsdom); i test coprono pulsanti, annunci, stati e onReorder.',
      'Nessun trascinamento tra liste diverse né virtualizzazione.',
    ],
  },
};
