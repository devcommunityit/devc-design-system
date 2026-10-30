import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['DropdownMenu', 'Menu', 'MenuItem', 'MenuSection', 'MenuSeparator', 'SubmenuTrigger'],
  name: 'DropdownMenu',
  slug: 'dropdown-menu',
  category: 'navigation',
  summary: 'Elenco di azioni o opzioni che compare da un pulsante, con sezioni, sottomenu e selezione.',
  whenToUse: ['Azioni secondarie su un elemento (“Altre azioni”).', 'Opzioni di vista con selezione singola o multipla.'],
  whenNotToUse: ['Scelta di un valore in un form: usa Select o Combobox.', 'Navigazione del sito: usa NavigationMenu.'],
  props: [
    { name: 'DropdownMenu: isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Stato di apertura controllato o non controllato.' },
    { name: 'Menu: onAction', type: '(key: Key) => void', description: 'Voce attivata.' },
    { name: 'Menu: selectionMode, selectedKeys, onSelectionChange', type: "'single' | 'multiple', Selection", description: 'Selezione a livello di menu.' },
    { name: 'Menu: placement', type: 'Placement', default: "'bottom start'", description: 'Posizione del popover.' },
    { name: 'Menu: inline', type: 'boolean', default: 'false', description: 'Rende il menu senza popover (es. dentro altri overlay).' },
    { name: 'MenuItem: icon / description / shortcut', type: 'ReactNode', description: 'Contenuti aggiuntivi della voce.' },
    { name: 'MenuItem: tone', type: "'default' | 'danger'", default: "'default'", description: 'Evidenzia azioni distruttive.' },
    { name: 'MenuSection: title + selezione', type: 'ReactNode', description: 'Gruppo con intestazione e selezione propria.' },
  ],
  inherits: 'Props di react-aria-components MenuTrigger, Menu, MenuItem, MenuSection, SubmenuTrigger.',
  keyboard: [
    { keys: 'Enter / Space / Freccia giù', action: 'Apre il menu dal pulsante.' },
    { keys: 'Frecce su/giù, Home/End', action: 'Spostano il focus tra le voci.' },
    { keys: 'Lettere', action: 'Typeahead sulla prima voce corrispondente.' },
    { keys: 'Freccia destra / sinistra', action: 'Apre / chiude un sottomenu (invertito in RTL).' },
    { keys: 'Escape', action: 'Chiude il menu e riporta il focus sul pulsante.' },
  ],
  accessibility: [
    'Pattern APG Menu Button: role menu/menuitem, menuitemcheckbox/menuitemradio con selezione.',
    'La selezione è indicata da un’icona di spunta, non solo dal colore.',
    'Il popover è renderizzato nel portal del ThemeProvider più vicino ed eredita il tema.',
  ],
  responsive: ['Il popover si riposiziona per restare nella viewport e scorre se l’elenco è lungo.'],
  customization: ["Superficie: PopoverSurface (surface.raised, shadow-3). Voci: .dc-dropdown-menu-item[data-focused], [data-tone='danger']."],
  commonMistakes: [
    'Menu non controllato con selezione: lo stato si perde alla chiusura; usa selectedKeys + onSelectionChange.',
    'Usare un menu per la navigazione principale del sito.',
  ],
  examples: [
    { name: 'Basic', title: 'Azioni con sottomenu' },
    { name: 'IconTrigger', title: 'Trigger con IconButton' },
    { name: 'Selectable', title: 'Sezioni con selezione' },
  ],
  status: { implemented: true, documented: true, tests: ['components/DropdownMenu/DropdownMenu.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',
};
