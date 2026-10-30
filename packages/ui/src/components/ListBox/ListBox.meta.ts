import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ListBox', 'ListBoxItem', 'ListBoxSection'],
  name: 'ListBox',
  slug: 'list-box',
  category: 'forms',
  summary: 'Elenco di opzioni selezionabili sempre visibile (pattern APG Listbox). È anche la superficie usata da Select, Combobox e MultiSelect.',
  whenToUse: ['Scelta tra opzioni che devono restare visibili, ad esempio in un pannello laterale.', 'Opzioni con descrizione o icona.'],
  whenNotToUse: ['Navigazione o azioni: usa NavigationMenu o DropdownMenu.', 'Poche opzioni esclusive in un form: RadioGroup è più semplice.'],
  props: [
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Modalità di selezione.' },
    { name: 'selectedKeys / defaultSelectedKeys / onSelectionChange', type: 'Selection', description: 'Selezione controllata o non controllata.' },
    { name: 'items', type: 'Iterable<T>', description: 'Collezione dinamica con render function come children.' },
    { name: 'variant', type: "'bordered' | 'plain'", default: "'bordered'", description: 'plain è usato all’interno dei popover.' },
    { name: 'renderEmptyState', type: '() => ReactNode', description: 'Contenuto se la collezione è vuota; predefinito: messaggio localizzato “nessuna opzione”.' },
    { name: 'ListBoxItem: description / icon / isDisabled', type: 'ReactNode / boolean', description: 'Testo secondario, icona iniziale, opzione disabilitata.' },
    { name: 'ListBoxSection: title', type: 'ReactNode', required: true, description: 'Intestazione del gruppo.' },
  ],
  inherits: 'Props di ListBox di react-aria-components (aria-label obbligatorio senza etichetta visibile).',
  keyboard: [
    { keys: 'Frecce su/giù, Home, End', action: 'Sposta il focus tra le opzioni.' },
    { keys: 'Spazio / Invio', action: 'Seleziona l’opzione.' },
    { keys: 'Lettere', action: 'Typeahead sul testo dell’opzione.' },
    { keys: 'Shift + frecce', action: 'Estende la selezione in modalità multiple.' },
  ],
  accessibility: ['role="listbox" con aria-selected; le opzioni selezionate hanno anche un segno di spunta (non solo colore).', 'Fornisci aria-label o aria-labelledby.'],
  responsive: ['Larghezza fluida; le righe vanno a capo con testi lunghi.'],
  customization: ['Token --dc-color-action-*, --dc-radius-*; data-selected / data-focus-visible per gli stati.'],
  commonMistakes: ['Usare ListBox come menu di azioni.', 'Omettere textValue quando il contenuto dell’opzione non è testo semplice.'],
  examples: [
    { name: 'Basic', title: 'Selezione singola' },
    { name: 'MultipleControlled', title: 'Multipla controllata' },
    { name: 'Sections', title: 'Sezioni' },
    { name: 'Empty', title: 'Stato vuoto' },
  ],
  status: { implemented: true, documented: true, tests: ['components/ListBox/ListBox.test.tsx'], limits: ['Nessuna virtualizzazione: pensato per elenchi di dimensione moderata.'] },
};