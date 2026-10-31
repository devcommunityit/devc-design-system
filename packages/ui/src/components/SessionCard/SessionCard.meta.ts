import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SessionCard', 'SessionCardProps'],
  name: 'SessionCard',
  slug: 'session-card',
  category: 'community',
  summary: 'Card autonoma per una sessione, con orario, contenuto, speaker e slot azione.',
  whenToUse: ['Mostrare una sessione indipendentemente da una griglia di programma.'],
  whenNotToUse: ['Programmi in sequenza lineare: usa Agenda e AgendaItem. Per speaker usa ProfileCard.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo della sessione.' },
    { name: 'startTime', type: 'string', required: true, description: 'Ora di inizio visibile.' },
    { name: 'endTime', type: 'string', description: 'Ora di fine opzionale.' },
    { name: 'speakers', type: 'ReactNode', description: 'Slot per nomi o link speaker.' },
    { name: 'action', type: 'ReactNode', description: 'Azione controllata dal consumer.' },
  ],
  inherits: 'Attributi HTML di <article> eccetto title.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge il link titolo, se presente, e i controlli forniti nell’azione.' }],
  accessibility: ['Usa un article etichettato dal titolo; il titolo può essere collegato senza estendere il link alle azioni.'],
  responsive: ['I metadati e gli slot si adattano alla larghezza disponibile.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Non duplicare la presentazione del profilo speaker: riusa ProfileCard quando serve una vera scheda speaker.'],
  examples: [{ name: 'Basic', title: 'Sessione con speaker e azione' }],
  status: { implemented: true, documented: true, tests: ['components/SessionCard/SessionCard.test.tsx'], limits: ['Non gestisce prenotazione o sincronizzazione calendario.'] },
};
