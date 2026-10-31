import { Agenda, AgendaItem } from './index';

export function Basic() {
  return (
    <Agenda title="Today’s agenda">
      <AgendaItem
        startTime="09:30"
        endTime="10:15"
        startDateTime="2026-11-12T09:30"
        endDateTime="2026-11-12T10:15"
        title="Opening keynote"
        href="#keynote"
        location="Main stage"
        description="Welcome and the day’s opening talk."
      />
      <AgendaItem
        startTime="10:30"
        endTime="11:15"
        title="Design systems in practice"
        location="Room 2"
        action={<button type="button">Add reminder</button>}
      />
    </Agenda>
  );
}

export function Empty() {
  return <Agenda title="Upcoming events" emptyState="No events are scheduled yet." />;
}
