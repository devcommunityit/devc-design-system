import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['VolunteerShiftPicker', 'VolunteerShiftPickerProps', 'VolunteerShift'],
  name: 'VolunteerShiftPicker',
  slug: 'volunteer-shift-picker',
  category: 'community',
  summary: 'Selettore controllato di un turno per volontari.',
  whenToUse: ['Lasciare scegliere un turno disponibile prima che il consumer gestisca la registrazione.'],
  whenNotToUse: ['Per pianificare eventi e orari usa Agenda.'],
  props: [
    { name: 'label', type: 'string', required: true, description: 'Etichetta del gruppo.' },
    { name: 'shifts', type: 'readonly VolunteerShift[]', required: true, description: 'Turni selezionabili o disabilitati.' },
    { name: 'value', type: 'string | null', required: true, description: 'Id del turno scelto.' },
    { name: 'onChange', type: '(shiftId: string | null) => void', required: true, description: 'Richiesta di cambio selezione.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Contenuto per la lista vuota.' },
  ],
  keyboard: [{ keys: 'Tab / Frecce / Spazio', action: 'Naviga e seleziona un turno con RadioGroup.' }],
  accessibility: ['Le opzioni usano i controlli radio accessibili del design system.'],
  responsive: ['I turni si dispongono in una colonna adattabile.'],
  customization: ['Usa RadioGroup e token --dc-* per superfici e spaziature.'],
  commonMistakes: ['La scelta non prenota un turno né registra un volontario.'],
  examples: [{ name: 'Basic', title: 'Turni' }],
  status: { implemented: true, documented: true, tests: ['components/VolunteerShiftPicker/VolunteerShiftPicker.test.tsx'], limits: ['Disponibilità e registrazione sono fornite dal consumer.'] },
};
