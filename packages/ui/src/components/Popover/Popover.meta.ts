import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Popover', 'PopoverTrigger', 'PopoverSurface'],
  name: 'Popover',
  slug: 'popover',
  category: 'data',
  summary: 'Pannello flottante non modale ancorato a un trigger, con contenuto interattivo.',
  whenToUse: ['Informazioni o controlli contestuali brevi.', 'Impostazioni rapide di una vista.'],
  whenNotToUse: ['Solo una descrizione testuale: usa Tooltip.', 'Elenchi di azioni: usa DropdownMenu.', 'Contenuto che richiede attenzione esclusiva: usa Dialog.'],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Intestazione visibile, usata anche come nome accessibile.' },
    { name: 'aria-label', type: 'string', description: 'Nome accessibile se manca il titolo.' },
    { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', description: 'Contenuto.' },
    { name: 'placement', type: "Placement (es. 'bottom start')", default: "'bottom'", description: 'Posizione preferita; si ribalta se manca spazio.' },
    { name: 'showArrow', type: 'boolean', default: 'true', description: 'Freccia verso il trigger.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'su PopoverTrigger', description: 'Stato controllato o non controllato.' },
  ],
  inherits: 'Props del Popover di react-aria-components. PopoverSurface è la superficie riusata da Select, Combobox, Menu e DatePicker.',
  keyboard: [
    { keys: 'Enter / Spazio', action: 'Sul trigger apre il popover e sposta il focus all’interno.' },
    { keys: 'Escape', action: 'Chiude e riporta il focus al trigger.' },
  ],
  accessibility: ['Semantica di dialogo non modale con nome accessibile obbligatorio (title o aria-label).', 'Il trigger espone aria-expanded.', 'Renderizzato nel portal del ThemeProvider più vicino.'],
  responsive: ['Si riposiziona e limita l’altezza per restare nel viewport.'],
  customization: ['className/style; token di superficie, raggio ed elevazione.'],
  commonMistakes: ['Aprire popover solo con hover: il contenuto deve essere raggiungibile anche da tastiera e touch.'],
  examples: [
    { name: 'Basic', title: 'Informativo' },
    { name: 'Interactive', title: 'Con controlli' },
    { name: 'Controlled', title: 'Controllato con modulo di modifica', description: 'isOpen + onOpenChange su PopoverTrigger: Salva aggiorna il nome e chiude, Annulla chiude senza modifiche.' },
    { name: 'WithoutTitle', title: 'Senza titolo, senza freccia e testo lungo', description: 'Nome accessibile da aria-label; il contenuto lungo va a capo entro una larghezza massima.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Popover/Popover.test.tsx'], limits: [] },
};