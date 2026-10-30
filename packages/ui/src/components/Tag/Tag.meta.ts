import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['TagGroup', 'Tag'],
  name: 'Chip / Tag',
  slug: 'tag',
  category: 'data',
  summary: 'Gruppo di chip per etichette, filtri selezionabili o valori rimovibili, navigabile da tastiera come una griglia.',
  whenToUse: ['Mostrare categorie o parole chiave.', 'Filtri rapidi attivabili (selectionMode).', 'Valori rimovibili, ad esempio i destinatari.'],
  whenNotToUse: ['Stato non interattivo e singolo: usa Badge.', 'Azioni: usa Button o ToggleGroup.'],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Etichetta del gruppo e testi collegati (altrimenti aria-label).' },
    { name: 'items / children', type: 'Iterable<T> / ReactNode | (item) => ReactNode', required: true, description: 'Tag statici o dinamici.' },
    { name: 'onRemove', type: '(keys: Set<Key>) => void', description: 'Abilita il pulsante di rimozione e i tasti Canc/Backspace.' },
    { name: 'selectionMode / selectedKeys / onSelectionChange', type: 'Selection', description: 'Chip selezionabili (filtri).' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Dimensione.' },
    { name: 'renderEmptyState', type: '() => ReactNode', description: 'Contenuto se non ci sono tag.' },
    { name: 'Tag: icon / textValue / isDisabled', type: 'ReactNode / string / boolean', description: 'Icona iniziale, testo accessibile, stato disabilitato.' },
  ],
  inherits: 'Props di TagGroup e Tag di react-aria-components.',
  keyboard: [
    { keys: 'Tab', action: 'Entra nel gruppo (un solo punto di tabulazione).' },
    { keys: 'Frecce', action: 'Si sposta tra i tag.' },
    { keys: 'Canc / Backspace', action: 'Rimuove il tag (se onRemove).' },
    { keys: 'Spazio / Invio', action: 'Seleziona (se selectionMode).' },
  ],
  accessibility: ['role="grid": ogni tag è una riga; il pulsante di rimozione ha un nome localizzato (“Rimuovi …”).', 'I tag selezionati mostrano un segno di spunta oltre al colore.'],
  responsive: ['I tag vanno a capo; i testi lunghi sono troncati visivamente, mentre il nome accessibile contiene il testo completo.'],
  customization: ['data-selected, data-size e i token --dc-color-* per i colori.'],
  commonMistakes: ['Usare Tag per stati informativi: Badge è più leggero.', 'Dimenticare la label di gruppo.'],
  examples: [
    { name: 'Basic', title: 'Statici' },
    { name: 'Removable', title: 'Rimovibili' },
    { name: 'Selectable', title: 'Filtri selezionabili' },
    { name: 'Sizes', title: 'Dimensioni' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Tag/Tag.test.tsx'], limits: [] },
};