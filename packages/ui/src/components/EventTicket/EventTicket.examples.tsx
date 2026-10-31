import { EventTicket } from './EventTicket';

export function Basic() {
  return (
    <EventTicket
      eventName="Community Summit"
      attendeeName="Alex Rivera"
      ticketName="General admission"
      ticketCode="SUMMIT-4821"
      dateTime="2026-11-12"
      qrVisual={<div aria-hidden="true">QR preview</div>}
      admission="All sessions"
    />
  );
}
