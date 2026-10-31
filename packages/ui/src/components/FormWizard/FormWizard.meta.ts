import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['FormWizard', 'type FormWizardProps', 'type FormWizardStep'],
  name: 'FormWizard',
  slug: 'form-wizard',
  category: 'forms',
  summary: 'Flusso di form a più passaggi con validazione, navigazione e completamento.',
  whenToUse: ['Guidare una registrazione o un processo articolato in passaggi.'],
  whenNotToUse: ['Per mostrare solo l’avanzamento usa Stepper.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome del form e dello stepper.' },
    { name: 'steps', type: 'readonly FormWizardStep[]', required: true, description: 'Passaggi con contenuto e validazione opzionale, anche asincrona.' },
    { name: 'currentStep / defaultCurrentStep / onStepChange', type: 'number / (index) => void', description: 'Passaggio controllato o iniziale.' },
    { name: 'onComplete', type: '() => void | Promise<void>', required: true, description: 'Chiamato dopo la validazione dell’ultimo passaggio.' },
    { name: 'onError / validationMessage / errorMessage', type: 'funzioni e ReactNode', description: 'Gestione e messaggi degli errori.' },
  ],
  keyboard: [{ keys: 'Tab / Invio', action: 'Naviga e invia il passaggio corrente.' }],
  accessibility: ['Lo stepper indica il passaggio corrente; il focus segue il contenuto e gli errori sono annunciati.'],
  responsive: ['Lo stepper si adatta al contenitore e le azioni vanno a capo.'],
  customization: ['Il consumer fornisce contenuti, stato dei campi e messaggi di errore.'],
  commonMistakes: ['Conserva i valori nel consumer: i contenuti dei passaggi non attivi vengono smontati.'],
  examples: [{ name: 'Registration', title: 'Registrazione guidata' }],
  status: { implemented: true, documented: true, tests: ['components/FormWizard/FormWizard.test.tsx'], limits: ['Non persiste i dati e non invia richieste di rete.'] },
};
