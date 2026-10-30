import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Truncate'],
  name: 'Truncate',
  slug: 'truncate',
  category: 'typography',
  summary:
    'Limita un testo a un numero di righe e, solo quando il testo trabocca davvero, mostra un pulsante “Mostra di più / Mostra meno” per accedere al contenuto completo.',
  whenToUse: ['Descrizioni lunghe in card e liste; note e commenti.'],
  whenNotToUse: ['Informazioni critiche o istruzioni: mostrale per intero.'],
  props: [
    { name: 'lines', type: 'number', default: '3', description: 'Righe visibili; 1 usa l’ellissi su una riga.' },
    { name: 'isExpanded / defaultExpanded / onExpandedChange', type: 'boolean / (expanded) => void', default: 'false', description: 'Stato espanso controlled o uncontrolled.' },
    { name: 'hideToggle', type: 'boolean', default: 'false', description: 'Nasconde il pulsante (solo se il testo completo è disponibile altrove).' },
  ],
  inherits: 'Attributi HTML di <div>; ref al contenitore.',
  keyboard: [{ keys: 'Enter / Spazio', action: 'Espande o comprime il testo.' }],
  accessibility: [
    'Il pulsante è un vero <button> con aria-expanded e aria-controls: nessuna funzione disponibile solo con hover.',
    'Il testo troncato resta nel DOM: gli screen reader leggono comunque l’intero contenuto.',
  ],
  responsive: ['L’overflow è rimisurato al ridimensionamento (ResizeObserver).'],
  customization: ['Variabile --_lines; selettori .dc-truncate-content[data-expanded], .dc-truncate-toggle.'],
  commonMistakes: ['Troncare titoli che servono a distinguere elementi simili.'],
  examples: [
    { name: 'MultiLine', title: 'Più righe' },
    { name: 'SingleLine', title: 'Una riga' },
    { name: 'Controlled', title: 'Espansione controllata', description: 'Lo stato espanso di ogni recensione vive nell’esempio; un pulsante esterno le apre o chiude tutte. La seconda è in inglese.' },
    { name: 'ShortAndNoToggle', title: 'Testo breve e hideToggle', description: 'Senza overflow il pulsante non compare; con hideToggle il testo resta troncato.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Typography/Typography.test.tsx'], limits: [] },
};
