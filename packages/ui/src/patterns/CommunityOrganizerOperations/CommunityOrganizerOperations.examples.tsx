import { useState } from 'react';
import { CommunityOrganizerOperations, type OrganizerAttendee, type OrganizerModerationReport } from './CommunityOrganizerOperations';

const attendees: OrganizerAttendee[] = [
  { id: 'a-101', name: 'Maya Chen', email: 'maya@example.org', ticket: 'Community', status: 'registered' },
  { id: 'a-102', name: 'Jordan Lee', email: 'jordan@example.org', ticket: 'Speaker', status: 'checked-in' },
  { id: 'a-103', name: 'Alex Rivera', email: 'alex@example.org', ticket: 'Community', status: 'no-show' },
];

const reports: OrganizerModerationReport[] = [
  { id: 'r-1', reporter: 'Maya Chen', subject: 'Discussion post', reason: 'Contains an unrelated promotional link.', submittedAt: '2025-04-15T10:42:00Z', status: 'new' },
];

/** Fully populated example using local state only; a real host should supply its own records and handlers. */
export function OperationsDashboard() {
  const [selectedSegments, setSelectedSegments] = useState(['attended']);
  const [checkedIn, setCheckedIn] = useState<string[]>(['a-102']);
  const controlledAttendees = attendees.map((attendee) => ({
    ...attendee,
    status: checkedIn.includes(attendee.id) ? 'checked-in' as const : attendee.status,
  }));
  return (
    <CommunityOrganizerOperations
      communityName="Design Systems Guild"
      eventTitle="Spring Community Meetup"
      attendees={controlledAttendees}
      csvPreview={{
        fileName: 'attendees-april.csv',
        rowCount: 48,
        columns: ['Full name', 'Email address', 'Pass'],
        rows: [
          { 'Full name': 'Sam Patel', 'Email address': 'sam@example.org', Pass: 'Community' },
          { 'Full name': 'Riley Kim', 'Email address': 'riley@example.org', Pass: 'Speaker' },
        ],
        targetFields: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'ticket', label: 'Ticket type' }],
        mapping: { name: 'Full name', email: 'Email address', ticket: 'Pass' },
      }}
      auditEvents={[
        { id: 'e1', title: 'Check-in completed', actor: 'Morgan organizer', dateTime: '2025-04-15T10:30:00Z', timeLabel: 'Apr 15, 10:30 AM', details: 'Front desk', tone: 'success' },
        { id: 'e2', title: 'Attendee list imported', actor: 'Morgan organizer', dateTime: '2025-04-15T09:10:00Z', timeLabel: 'Apr 15, 9:10 AM', tone: 'info' },
      ]}
      reports={reports}
      audienceSegments={[
        { id: 'attended', label: 'Past attendees', description: 'People who attended a community event', count: 384, selected: selectedSegments.includes('attended') },
        { id: 'organizers', label: 'Event organizers', description: 'Volunteer hosts and moderators', count: 28, selected: selectedSegments.includes('organizers') },
      ]}
      campaign={{ subject: 'Thanks for joining us!', preheader: 'A few notes from the meetup', body: 'Thanks for making our community meetup a success.\\n\\nSee you next time!', recipients: 384, sent: 380, opens: 246, clicks: 92, bounces: 4 }}
      integrations={[
        { id: 'calendar', name: 'Calendar sync', type: 'connection', status: 'connected', description: 'Event schedule connection is active.', detail: 'calendar.example.org/community' },
        { id: 'checkin', name: 'Check-in webhook', type: 'webhook', status: 'attention', description: 'The host system reports a recent delivery issue.', detail: '/hooks/event-check-in' },
        { id: 'public-api', name: 'Community API', type: 'api', status: 'disconnected', description: 'Read-only API integration status.' },
      ]}
      communityMetrics={[
        { label: 'Members', value: 1284, change: '+8% this month' },
        { label: 'Active this month', value: 642, change: '50% of members' },
      ]}
      eventMetrics={[
        { label: 'Registrations', value: 420 },
        { label: 'Checked in', value: 318 },
        { label: 'Attendance rate', value: 75.7, formatOptions: { style: 'percent', maximumFractionDigits: 1 } },
      ]}
      attendanceBreakdown={[{ label: 'Checked in', value: 318 }, { label: 'Registered', value: 78 }, { label: 'No-show', value: 24 }]}
      onCheckIn={(id) => setCheckedIn((current) => [...new Set([...current, id])])}
      onMarkNoShow={(id) => setCheckedIn((current) => current.filter((entry) => entry !== id))}
      onAudienceSegmentChange={(id, selected) => setSelectedSegments((current) => selected ? [...new Set([...current, id])] : current.filter((entry) => entry !== id))}
    />
  );
}

export function ReadOnlyConsole() {
  return <CommunityOrganizerOperations communityName="Community" eventTitle="Next meetup" />;
}
