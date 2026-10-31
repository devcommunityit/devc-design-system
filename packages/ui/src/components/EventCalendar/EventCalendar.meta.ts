import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['EventCalendar', 'type EventCalendarProps', 'type EventCalendarEvent', 'type EventCalendarView'],
  name: 'EventCalendar',
  slug: 'event-calendar',
  category: 'community',
  summary: 'Calendario di eventi con viste giornaliera, settimanale e mensile.',
  whenToUse: ['Mostrare eventi su più date e navigare fra periodi.'],
  whenNotToUse: ['Per scegliere una data usa Calendar; per un programma lineare usa Agenda.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome del calendario.' },
    { name: 'events', type: 'readonly EventCalendarEvent[]', required: true, description: 'Eventi con date CalendarDate e fine inclusiva opzionale.' },
    { name: 'date / defaultDate / onDateChange', type: 'CalendarDate / (date) => void', description: 'Data visibile controllata o iniziale.' },
    { name: 'view / defaultView / onViewChange', type: "'day' | 'week' | 'month'", default: "'month'", description: 'Vista controllata o iniziale.' },
    { name: 'firstDayOfWeek', type: 'DayOfWeek', description: 'Sostituisce il primo giorno dedotto dalla locale.' },
    { name: 'onEventPress', type: '(event) => void', description: 'Azione per eventi senza href.' },
    { name: 'emptyState', type: 'ReactNode', description: 'Messaggio nella vista giorno senza eventi.' },
  ],
  keyboard: [{ keys: 'Tab / Invio', action: 'Naviga periodi, cambia vista e attiva gli eventi interattivi.' }],
  accessibility: ['Usa una tabella con intestazioni e date leggibili, con annunci del periodo corrente.'],
  responsive: ['Le viste a sette colonne scorrono nel proprio contenitore sui viewport stretti.'],
  customization: ['Colori e spaziature usano i token del design system.'],
  commonMistakes: ['Usa CalendarDate per date senza fuso; la fine di un evento è inclusiva.'],
  examples: [{ name: 'Events', title: 'Calendario eventi' }],
  status: { implemented: true, documented: true, tests: ['components/EventCalendar/EventCalendar.test.tsx'], limits: ['Non gestisce prenotazioni, fusi orari, ricorrenze o persistenza.'] },
};
