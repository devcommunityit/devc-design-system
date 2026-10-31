import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['FilterBar', 'FilterBarProps', 'FilterBarFilter', 'FilterBarOption', 'FilterBarView'],
  name: 'FilterBar',
  slug: 'filter-bar',
  category: 'data',
  summary: 'Barra di filtri controllati con viste salvate gestite dal consumer.',
  whenToUse: ['Affiancare filtri e viste sopra una tabella o una lista.'],
  whenNotToUse: ['Filtri complessi con molte dipendenze: usa un form dedicato o DataTable.'],
  props: [
    { name: 'filters', type: 'readonly FilterBarFilter[]', required: true, description: 'Filtri controllati e relative opzioni.' },
    { name: 'views', type: 'readonly FilterBarView[]', description: 'Viste salvate fornite dal consumer.' },
    { name: 'activeViewId / onViewChange', type: 'string / (view) => void', description: 'Vista selezionata e callback di selezione.' },
    { name: 'onSaveView', type: '(values) => void', description: 'Richiesto per mostrare il comando di salvataggio; la persistenza resta al consumer.' },
    { name: 'onDeleteView', type: '(view) => void', description: 'Mostra il comando di eliminazione per la vista attiva.' },
    { name: 'onClear', type: '() => void', description: 'Azione opzionale per azzerare i filtri.' },
  ],
  keyboard: [{ keys: 'Tab / frecce', action: 'Usa i controlli select nativi per selezionare filtri e viste.' }],
  accessibility: ['Ogni select ha un’etichetta associata.', 'I controlli nativi conservano la navigazione da tastiera.'],
  responsive: ['I filtri vanno a capo e occupano la larghezza disponibile su schermi stretti.'],
  customization: ['Personalizza i colori tramite token --dc-color-* e le dimensioni con CSS esterno.'],
  commonMistakes: ['Non aspettarti persistenza automatica: salva viste e applica i relativi valori nel consumer.'],
  examples: [{ name: 'SavedViews', title: 'Filtri e viste salvate' }],
  status: { implemented: true, documented: true, tests: ['components/FilterBar/FilterBar.test.tsx'], limits: ['Le viste e la persistenza sono interamente controllate dal consumer.'] },
};
