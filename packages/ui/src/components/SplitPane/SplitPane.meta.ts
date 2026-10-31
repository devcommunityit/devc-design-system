import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  entry: 'widgets',
  exports: ['SplitPane', 'SplitPaneProps'],
  name: 'SplitPane',
  slug: 'split-pane',
  category: 'layout',
  summary: 'Due pannelli ridimensionabili con separatore accessibile da puntatore e tastiera.',
  whenToUse: ['Mostrare editor e anteprima affiancati.', 'Separare pannelli di una dashboard.'],
  whenNotToUse: ['Layout statici che si adattano già con Grid o Stack.'],
  props: [
    { name: 'primary / secondary', type: 'ReactNode', required: true, description: 'Contenuti dei due pannelli.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Orientamento del separatore e della divisione.' },
    { name: 'primarySize / defaultPrimarySize', type: 'number', default: '50', description: 'Dimensione percentuale controllata o iniziale del pannello primario.' },
    { name: 'minPrimarySize / maxPrimarySize', type: 'number', default: '20 / 80', description: 'Limiti percentuali del pannello principale.' },
    { name: 'onPrimarySizeChange', type: '(size: number) => void', description: 'Notifica le nuove dimensioni.' },
  ],
  keyboard: [{ keys: 'Frecce', action: 'Ridimensionano il pannello principale; Shift aumenta il passo.' }, { keys: 'Home / End', action: 'Portano ai limiti minimo e massimo.' }],
  accessibility: ['Il separatore espone role, orientamento, valore e limiti ARIA.', 'Entrambi i pannelli hanno un nome accessibile configurabile.'],
  responsive: ['I contenuti interni scorrono nel proprio pannello; cambia orientation sui layout stretti.'],
  customization: ['Usa i token --dc-color-* e le dimensioni intrinseche del contenuto.'],
  commonMistakes: ['Dai un’altezza al contenitore quando usi orientation="horizontal".'],
  examples: [{ name: 'EditorPreview', title: 'Editor e anteprima' }],
  status: { implemented: true, documented: true, tests: ['components/SplitPane/SplitPane.test.tsx'], limits: ['Non implementa persistenza delle dimensioni né gestione automatica del layout mobile.'] },
};
