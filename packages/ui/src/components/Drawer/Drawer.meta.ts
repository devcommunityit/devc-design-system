import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Drawer'],
  name: 'Drawer / Sheet',
  slug: 'drawer',
  category: 'overlay',
  summary: 'Pannello modale che entra da un bordo dello schermo; con placement="bottom" funziona come bottom sheet.',
  whenToUse: ['Filtri, dettagli secondari, navigazione mobile.', 'Contenuti più alti di un dialogo che beneficiano del contesto della pagina.'],
  whenNotToUse: ['Conferme: usa AlertDialog.', 'Contenuti principali della pagina.'],
  props: [
    { name: 'placement', type: "'start' | 'end' | 'bottom'", default: "'end'", description: 'Bordo di ingresso; start/end seguono la direzione di scrittura.' },
    { name: 'title / description / children / footer', type: 'come Dialog', description: 'Stessa struttura di Dialog.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: 'Controllato o non controllato.' },
  ],
  inherits: 'Tutte le props di Dialog tranne size.',
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'Focus contenuto nel pannello.' },
    { keys: 'Escape', action: 'Chiude e riporta il focus al trigger.' },
  ],
  accessibility: ['Semantica e gestione del focus identiche a Dialog modale.', 'Animazione di ingresso disattivata con prefers-reduced-motion.'],
  responsive: ['Larghezza limitata su desktop, quasi piena su mobile; bottom sheet con altezza massima e scroll interno.'],
  customization: ['className/style; token di superficie ed elevazione.'],
  commonMistakes: ['Usare left/right fissi: usa start/end per supportare RTL.'],
  examples: [
    { name: 'Filters', title: 'Pannello filtri' },
    { name: 'Placements', title: 'Posizioni' },
    { name: 'Controlled', title: 'Controllato con descrizione e contenuto lungo', description: 'isOpen + onOpenChange senza DialogTrigger; le righe lunghe vanno a capo dentro il pannello.' },
    { name: 'NestedConfirm', title: 'AlertDialog annidato nel pannello', description: 'La conferma distruttiva si apre sopra il Drawer; con Annulla o Esc il focus torna al pulsante Rimuovi nel pannello.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Dialog/Dialog.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
};