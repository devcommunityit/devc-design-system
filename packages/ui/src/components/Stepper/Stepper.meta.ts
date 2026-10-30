import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Stepper', 'StepperStep'],
  name: 'Stepper',
  slug: 'stepper',
  category: 'navigation',
  summary: 'Mostra l’avanzamento in un processo a passaggi e, opzionalmente, permette di tornare ai passaggi completati.',
  whenToUse: ['Procedure guidate (registrazione, checkout, onboarding).'],
  whenNotToUse: ['Sezioni indipendenti consultabili in qualsiasi ordine: usa Tabs.', 'Gerarchia di pagine: usa Breadcrumb.'],
  props: [
    { name: 'steps', type: 'StepperStep[]', required: true, description: '{ id, label, description?, hasError? }.' },
    { name: 'currentStep', type: 'number', required: true, description: 'Indice (0-based) del passaggio corrente. Lo stato è sempre del consumer.' },
    { name: 'onStepPress', type: '(index, step) => void', description: 'Se presente, i passaggi completati diventano pulsanti.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Sotto 560 px di contenitore diventa comunque verticale.' },
  ],
  inherits: 'Attributi HTML di <nav>.',
  keyboard: [{ keys: 'Tab / Enter / Space', action: 'Raggiunge e attiva i passaggi completati (se onStepPress è fornito).' }],
  accessibility: [
    'Lista ordinata; il passaggio corrente ha aria-current="step".',
    'Lo stato (completato, corrente, errore) è annunciato con testo nascosto traducibile, oltre a icona e colore.',
  ],
  responsive: ['Container query: sotto 560 px passa automaticamente al layout verticale.'],
  customization: ['Selettori: .dc-stepper-step[data-status=complete|current|upcoming|error].'],
  commonMistakes: ['Permettere di saltare a passaggi futuri non validati.', 'Non spostare il focus all’inizio del nuovo contenuto al cambio di passaggio.'],
  examples: [
    { name: 'Interactive', title: 'Interattivo' },
    { name: 'WithError', title: 'Con errore' },
    { name: 'Vertical', title: 'Verticale' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Stepper/Stepper.test.tsx'], limits: [] },
};
