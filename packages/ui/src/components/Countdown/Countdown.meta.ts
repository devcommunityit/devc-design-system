import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Countdown', 'CountdownProps'],
  name: 'Countdown',
  slug: 'countdown',
  category: 'community',
  summary: 'Conto alla rovescia accessibile verso l’inizio di un evento, senza azioni o gestione dell’evento.',
  whenToUse: ['Mostrare il tempo rimanente verso una data e ora.'],
  whenNotToUse: ['Gestire l’apertura di registrazioni o altre azioni automatiche alla scadenza.'],
  props: [
    { name: 'targetDate', type: 'Date | string', required: true, description: 'Data e ora obiettivo.' },
    { name: 'label', type: 'ReactNode', default: "'Event starts in'", description: 'Titolo leggibile del conteggio.' },
    { name: 'expiredContent', type: 'ReactNode', description: 'Contenuto mostrato dopo la scadenza.' },
  ],
  inherits: 'Attributi HTML di <section> eccetto title.',
  keyboard: [{ keys: 'Tab', action: 'Non introduce controlli interattivi.' }],
  accessibility: ['Ogni cifra ha la propria etichetta visibile; il countdown non usa live announcement a ogni secondo per evitare annunci continui.'],
  responsive: ['Le unità si dispongono su più righe se lo spazio non basta.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Passare una data valida con fuso orario esplicito quando si usa una stringa.'],
  examples: [{ name: 'Basic', title: 'Evento futuro' }, { name: 'Expired', title: 'Evento iniziato' }],
  status: { implemented: true, documented: true, tests: ['components/Countdown/Countdown.test.tsx'], limits: ['Il conteggio è presentazionale e non attiva azioni alla scadenza.'] },
};
