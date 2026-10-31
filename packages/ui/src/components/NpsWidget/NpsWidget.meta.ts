import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['NpsWidget', 'NpsWidgetProps'],
  name: 'NpsWidget',
  slug: 'nps-widget',
  category: 'feedback',
  summary: 'Scala controllata da 0 a 10 per una domanda di raccomandazione.',
  whenToUse: ['Raccogliere una risposta numerica NPS da elaborare nel consumer.'],
  whenNotToUse: ['Per valutazioni a stelle usa Rating; il punteggio NPS non viene calcolato qui.'],
  props: [
    { name: 'label', type: 'string', required: true, description: 'Domanda associata alla scala.' },
    { name: 'value', type: 'number | null', required: true, description: 'Valore selezionato da 0 a 10 o null.' },
    { name: 'onChange', type: '(value: number | null) => void', required: true, description: 'Richiesta di modifica della risposta.' },
    { name: 'lowLabel', type: 'ReactNode', required: true, description: 'Descrizione dell’estremo inferiore.' },
    { name: 'highLabel', type: 'ReactNode', required: true, description: 'Descrizione dell’estremo superiore.' },
  ],
  keyboard: [{ keys: 'Tab / Frecce / Spazio', action: 'Naviga e seleziona un valore tramite RadioGroup.' }],
  accessibility: ['La domanda nomina il gruppo radio; ciascun valore ha un nome accessibile numerico.'],
  responsive: ['La scala può andare a capo su viewport e contenitori stretti.'],
  customization: ['Il gruppo radio usa componenti e token del design system.'],
  commonMistakes: ['Non interpretare il valore selezionato come un punteggio aggregato.'],
  examples: [{ name: 'Basic', title: 'Scala NPS' }],
  status: { implemented: true, documented: true, tests: ['components/NpsWidget/NpsWidget.test.tsx'], limits: ['Nessun calcolo, invio o tracking incluso.'] },
};
