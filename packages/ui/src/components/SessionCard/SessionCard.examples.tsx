import { SessionCard } from './SessionCard';

export function Basic() {
  return (
    <SessionCard
      title="Building better community tools"
      href="#session"
      startTime="10:30"
      endTime="11:15"
      track="Design track"
      location="Room 2"
      speakers="Sam Lee · Jordan Kim"
      description="Practical patterns for accessible community experiences."
      action={<button type="button">Add to schedule</button>}
    />
  );
}
