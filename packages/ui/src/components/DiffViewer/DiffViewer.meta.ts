import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  entry: 'widgets',
  exports: ['DiffViewer', 'diffLines', 'type DiffViewerProps', 'type DiffViewerMode', 'type DiffLine'],
  name: 'DiffViewer',
  slug: 'diff-viewer',
  category: 'data',
  summary: 'Confronto testuale riga per riga in vista unificata o affiancata.',
  whenToUse: ['Mostrare modifiche a testo, configurazione o codice.'],
  whenNotToUse: ['Per modificare il testo usa un editor dedicato.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome del confronto.' },
    { name: 'before', type: 'string', required: true, description: 'Testo originale, trattato come testo semplice.' },
    { name: 'after', type: 'string', required: true, description: 'Testo modificato, trattato come testo semplice.' },
    { name: 'mode / defaultMode / onModeChange', type: "'unified' | 'split'", description: 'Vista controllata o iniziale.' },
  ],
  keyboard: [{ keys: 'Tab / frecce', action: 'Cambia vista e scorri il confronto.' }],
  accessibility: ['Le righe aggiunte e rimosse hanno testo e simboli, oltre al colore.'],
  responsive: ['Il confronto scorre nel proprio contenitore sui viewport stretti.'],
  customization: ['Colori di feedback e spaziature derivano dai token.'],
  commonMistakes: ['Non usare per file molto grandi: il confronto LCS ha un limite esplicito.'],
  examples: [{ name: 'Changes', title: 'Confronto di configurazione' }],
  status: { implemented: true, documented: true, tests: ['components/DiffViewer/DiffViewer.test.tsx'], limits: ['Confronto per righe, non per parole; limite di un milione di celle LCS.'] },
};
