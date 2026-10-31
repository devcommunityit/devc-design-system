import { EventCalendar, parseDate } from '@dev-community/ui';

const events = [
  { id: 'meetup', title: 'Incontro community', startDate: parseDate('2026-11-12'), time: '18:00', href: '#meetup' },
  { id: 'conference', title: 'Conferenza', startDate: parseDate('2026-11-18'), endDate: parseDate('2026-11-19') },
];

export function Events() {
  return <EventCalendar aria-label="Calendario eventi" defaultDate={parseDate('2026-11-12')} events={events} />;
}
