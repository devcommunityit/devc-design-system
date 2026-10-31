import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  entry: 'widgets',
  exports: ['OnboardingTour', 'type OnboardingTourProps', 'type OnboardingTourStep'],
  name: 'OnboardingTour',
  slug: 'onboarding-tour',
  category: 'overlay',
  summary: 'Guida contestuale a passaggi, ancorata agli elementi dell’interfaccia.',
  whenToUse: ['Presentare funzionalità essenziali in una guida facoltativa.'],
  whenNotToUse: ['Per un modulo multi-step usa FormWizard.', 'Non sostituire etichette o documentazione essenziali con una guida.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome della guida.' },
    { name: 'steps', type: 'readonly OnboardingTourStep[]', required: true, description: 'Passaggi con id, titolo, contenuto e selettore o funzione target.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean', description: 'Stato della guida controllato o iniziale.' },
    { name: 'currentStep / defaultCurrentStep / onStepChange', type: 'number', description: 'Passaggio corrente, indice da zero.' },
    { name: 'onFinish / onSkip / onTargetMissing / onError', type: 'function', description: 'Eventi di conclusione, uscita e mancato target.' },
  ],
  keyboard: [{ keys: 'Tab / Invio / Escape', action: 'Naviga, avanza o chiude la guida.' }],
  accessibility: ['Popover non modale con nome e focus gestiti; è possibile saltare la guida.', 'Un target mancante è annunciato e non blocca la navigazione.'],
  responsive: ['Il popover si riposiziona nel viewport; il target viene portato in vista.'],
  customization: ['Evidenziazione e superfici usano i token.'],
  commonMistakes: ['Assicurarsi che il target sia visibile e che i selettori siano univoci.', 'Gestire il completamento e la persistenza della guida nel consumer; per ricominciare, reimpostare il passaggio corrente.'],
  examples: [{ name: 'Guided', title: 'Guida introduttiva' }],
  status: { implemented: true, documented: true, tests: ['components/OnboardingTour/OnboardingTour.test.tsx'], limits: ['Non salva lo stato e non naviga automaticamente tra pagine.'] },
};
