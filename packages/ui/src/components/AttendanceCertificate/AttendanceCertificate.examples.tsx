import { AttendanceCertificate } from './AttendanceCertificate';

export function Basic() {
  return (
    <AttendanceCertificate
      recipient="Taylor Morgan"
      eventName="Community Summit 2026"
      issuedDate="2026-11-12"
      certificateHref="/certificates/taylor-morgan"
    />
  );
}
