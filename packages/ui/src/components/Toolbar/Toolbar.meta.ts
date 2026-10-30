import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Toolbar', 'ToolbarGroup', 'ToolbarSeparator'],
  name: 'Toolbar',
  slug: 'toolbar',
  category: 'actions',
  summary:
    'Contenitore role="toolbar" con un solo tab stop: le frecce spostano il focus tra pulsanti, toggle e menu, anche attraverso gruppi e separatori.',
  whenToUse: ['Barre di formattazione di un editor.', 'Comandi di una mappa, di un canvas o di un visualizzatore.', 'Azioni compatte sopra una tabella o un documento.'],
  whenNotToUse: ['Navigazione tra pagine: usa NavigationMenu o Tabs.', 'Due o tre pulsanti indipendenti: basta ButtonGroup o Inline.', 'Campi di testo: le frecce servono al cursore e confliggono con la navigazione della toolbar.'],
  props: [
    { name: 'aria-label / aria-labelledby', type: 'string', required: true, description: 'Nome accessibile della toolbar.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Asse di navigazione con le frecce e di disposizione.' },
    { name: 'variant', type: "'plain' | 'surface'", default: "'surface'", description: 'Con o senza bordo e sfondo.' },
    { name: 'ToolbarGroup aria-label', type: 'string', description: 'Nome del gruppo (role="group"), annunciato all’ingresso.' },
    { name: 'ToolbarSeparator', type: 'component', description: 'Divisore con orientamento perpendicolare a quello della toolbar.' },
  ],
  inherits: 'Props di react-aria-components Toolbar (className, style, data-*, eventi).',
  keyboard: [
    { keys: '← / → (orizzontale), ↑ / ↓ (verticale)', action: 'Sposta il focus al controllo precedente/successivo; segue la direzione di lettura in RTL.' },
    { keys: 'Home / End', action: 'Primo / ultimo controllo.' },
    { keys: 'Tab', action: 'Esce dalla toolbar (un solo tab stop).' },
  ],
  accessibility: [
    'Pattern APG Toolbar implementato da react-aria-components.',
    'I separatori hanno role="separator" e aria-orientation corretto.',
    'I controlli disabilitati vengono saltati dalle frecce.',
  ],
  responsive: ['La toolbar va a capo su più righe in viewport stretti; con molte azioni sposta le meno usate in un DropdownMenu.'],
  customization: ['Selettori [data-variant], [data-orientation].', 'Usa IconButton e Toggle variant="ghost" per un aspetto compatto.'],
  commonMistakes: [
    'Usare ToggleGroup selectionMode="multiple" dentro la toolbar: preferisci ToolbarGroup con Toggle controllati (vedi esempio Editor).',
    'Dimenticare il nome accessibile.', 'Inserire un TextField: le frecce verrebbero catturate dalla toolbar.', 'Mettere pulsanti solo icona senza etichetta (label / aria-label).'],
  examples: [
    { name: 'Editor', title: 'Barra di formattazione' },
    { name: 'Vertical', title: 'Toolbar verticale' },
    { name: 'Plain', title: 'Variante plain (English)' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Toolbar/Toolbar.test.tsx'],
    limits: [
      'Dentro una Toolbar, ToggleGroup a selezione multipla genera in react-aria-components 1.22 role="group" con aria-orientation (attributo non ammesso, segnalato da axe): usa ToolbarGroup con Toggle indipendenti. ToggleGroup a selezione singola (radiogroup) è corretto.',
    ],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
};
