import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Skeleton'],
  name: 'Skeleton',
  slug: 'skeleton',
  category: 'feedback',
  summary: 'Segnaposto decorativo che anticipa la forma dei contenuti in caricamento.',
  whenToUse: ['Caricamento iniziale di card, liste e tabelle con layout noto.'],
  whenNotToUse: ['Azioni dell’utente in corso: usa Spinner o Progress.'],
  props: [
    { name: 'shape', type: "'text' | 'rect' | 'circle'", default: "'text'", description: 'Forma.' },
    { name: 'lines', type: 'number', default: '1', description: 'Righe di testo; l’ultima è più corta.' },
    { name: 'width / height', type: 'string', description: 'Dimensioni CSS.' },
  ],
  inherits: 'Attributi HTML di <span>.',
  keyboard: [],
  accessibility: ['aria-hidden: la regione che carica deve avere aria-busy e un testo di stato (es. VisuallyHidden).', 'Pulsazione disattivata con prefers-reduced-motion.'],
  responsive: ['Larghezze percentuali di default.'],
  customization: ['className/style; colore da color.surface.strong.'],
  commonMistakes: ['Lasciare lo skeleton senza alternativa testuale per gli screen reader.'],
  examples: [
    { name: 'Shapes', title: 'Forme' },
    { name: 'Toggle', title: 'Alternanza con il contenuto' },
    { name: 'CardPlaceholder', title: 'Scheda profilo in caricamento', description: 'Lo skeleton riproduce la struttura della scheda reale; il pulsante alterna i due stati.' },
    { name: 'ListPlaceholder', title: 'Elenco in caricamento', description: 'Righe con larghezze diverse per un effetto più naturale, con testo di stato nascosto.' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Alert/Feedback.test.tsx'], limits: [] },
};
