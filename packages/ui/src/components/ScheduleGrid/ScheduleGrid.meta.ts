import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ScheduleGrid', 'ScheduleGridProps', 'ScheduleTrack', 'ScheduleSession'],
  name: 'ScheduleGrid',
  slug: 'schedule-grid',
  category: 'community',
  summary: 'Programma multi-traccia che compone le agende semantiche esistenti.',
  whenToUse: ['Confrontare in parallelo i programmi di più track.'],
  whenNotToUse: ['Un’unica sequenza di sessioni: componi Agenda e AgendaItem direttamente.'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Titolo del programma.' },
    { name: 'tracks', type: 'ScheduleTrack[]', required: true, description: 'Tracce e sessioni.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Livello del titolo di programma.' },
  ],
  keyboard: [{ keys: 'Tab', action: 'Naviga i link e le azioni delle sessioni nell’ordine DOM.' }],
  accessibility: ['Ogni track riusa Agenda e ogni sessione riusa AgendaItem per la struttura di lista e i metadati temporali.'],
  responsive: ['Le tracce formano colonne responsive che si riducono a singola colonna quando necessario.'],
  customization: ['Usa token --dc-* e className sul contenitore.'],
  commonMistakes: ['Non assumere che colonne parallele rappresentino ordinamento cronologico globale.'],
  examples: [{ name: 'Basic', title: 'Programma a due tracce' }],
  status: { implemented: true, documented: true, tests: ['components/ScheduleGrid/ScheduleGrid.test.tsx'], limits: ['Non fornisce controlli di filtro o sincronizzazione tra tracce.'] },
};
