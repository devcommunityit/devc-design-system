import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Divider', 'Spacer'],
  name: 'Divider e Spacer',
  slug: 'divider',
  category: 'layout',
  summary: 'Divider è un separatore semantico orizzontale o verticale, anche con etichetta centrale. Spacer è spazio vuoto presentazionale.',
  whenToUse: ['Separare gruppi di contenuti correlati.', 'Spacer per spingere elementi agli estremi di una riga flex.'],
  whenNotToUse: ['Per creare spazio tra elementi: preferisci il gap di Stack/Inline/Grid.'],
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Orientamento (aria-orientation).' },
    { name: 'label', type: 'ReactNode', description: 'Testo centrale (solo orizzontale), es. “oppure”.' },
    { name: 'spacing', type: 'SpaceStep', default: '0', description: 'Margine attorno alla linea.' },
    { name: 'Spacer.size', type: 'SpaceStep', description: 'Dimensione fissa; senza, lo Spacer riempie lo spazio disponibile in un contenitore flex.' },
    { name: 'Spacer.axis', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Asse della dimensione fissa.' },
  ],
  inherits: 'Divider: props di react-aria-components Separator. Spacer: attributi HTML di <span>.',
  keyboard: [],
  accessibility: ['Divider espone role="separator"; Spacer è aria-hidden.', 'L’etichetta di Divider è testo normale, letto dagli screen reader.'],
  responsive: ['Il Divider verticale si estende all’altezza della riga flex.'],
  customization: ['Colore: token color.border.subtle; selettore .dc-layout-divider[data-orientation].'],
  commonMistakes: ['Usare molti Divider dove basterebbe più spazio bianco.'],
  examples: [
    { name: 'Horizontal', title: 'Orizzontale' },
    { name: 'WithLabel', title: 'Con etichetta' },
    { name: 'Vertical', title: 'Verticale' },
    { name: 'PushApart', title: 'Spacer flessibile' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Layout/Layout.test.tsx'], limits: [] },
};