import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Confetti', 'ConfettiProps'],
  name: 'Confetti',
  slug: 'confetti',
  category: 'community',
  summary: 'Decorazione CSS di coriandoli deterministici per una celebrazione, non interattiva e ignorata dagli screen reader.',
  whenToUse: ['Aggiungere un accento decorativo a un risultato o a una celebrazione.', 'Usare solo quando il movimento non è necessario per comprendere il contenuto.'],
  whenNotToUse: ['Comunicare un risultato o uno stato con la sola animazione.', 'In ambienti con movimento ridotto o forced-colors, dove viene nascosto.'],
  props: [
    { name: 'particleCount', type: 'number', default: '12', description: 'Numero deterministico di elementi decorativi, limitato a 1–16.' },
    { name: 'className', type: 'string', description: 'Classe CSS aggiuntiva.' },
  ],
  inherits: 'Attributi HTML di <span> (senza children).',
  keyboard: [],
  accessibility: [
    'Il contenitore decorativo ha aria-hidden="true" e non riceve focus.',
    'L’animazione è disabilitata nascondendo l’effetto con prefers-reduced-motion.',
    'L’effetto è nascosto anche in forced-colors.',
  ],
  responsive: ['Riempie il contenitore posizionato dal chiamante senza intercettare puntatore o touch.'],
  customization: ['Colori e misure derivano dai token --dc-*; particleCount è limitato a 16.'],
  commonMistakes: ['Usare l’effetto per trasmettere informazioni importanti o renderlo interattivo.'],
  examples: [
    { name: 'Basic', title: 'Celebrazione decorativa' },
    { name: 'FewerPieces', title: 'Meno elementi' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Confetti/Confetti.test.tsx'], limits: ['CSS-only: non sceglie colori o posizioni casuali; l’effetto si nasconde con movimento ridotto.'] },
};
