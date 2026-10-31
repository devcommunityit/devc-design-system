import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { CommunityOrganizerOperations } from './CommunityOrganizerOperations';

const attendees = [
  { id: '1', name: 'Taylor Park', email: 'taylor@example.org', ticket: 'General', status: 'registered' as const },
  { id: '2', name: 'Jamie Quinn', email: 'jamie@example.org', ticket: 'Speaker', status: 'checked-in' as const },
  { id: '3', name: 'Morgan Reed', email: 'morgan@example.org', ticket: 'General', status: 'no-show' as const },
];

function TestConsole(props: Partial<React.ComponentProps<typeof CommunityOrganizerOperations>> = {}) {
  return (
    <ThemeProvider>
      <CommunityOrganizerOperations communityName="Guild" eventTitle="Spring meetup" {...props} />
    </ThemeProvider>
  );
}

describe('CommunityOrganizerOperations', () => {
  it('renders the operational sections, attendee statuses, and provided callbacks', async () => {
    const user = userEvent.setup();
    const onCheckIn = vi.fn();
    const onMarkNoShow = vi.fn();
    const onReviewReport = vi.fn();
    render(
      <TestConsole
        attendees={attendees}
        reports={[{ id: 'report-1', reporter: 'Taylor', subject: 'Community post', reason: 'Spam link', submittedAt: '2025-04-15T10:00:00Z', status: 'new' }]}
        onCheckIn={onCheckIn}
        onMarkNoShow={onMarkNoShow}
        onReviewReport={onReviewReport}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Organizer operations' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: /Attendee check-in status/ });
    expect(within(table).getByText('Checked in')).toBeInTheDocument();
    expect(within(table).getAllByText('No-show')).toHaveLength(2);
    await user.click(within(table).getByRole('button', { name: 'Check in' }));
    expect(onCheckIn).toHaveBeenCalledWith('1');
    await user.click(within(table).getByRole('button', { name: 'No-show' }));
    expect(onMarkNoShow).toHaveBeenCalledWith('1');
    await user.click(screen.getByRole('button', { name: 'Review' }));
    expect(onReviewReport).toHaveBeenCalledWith('report-1');
    expect(screen.getByRole('heading', { name: 'CSV import preview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mailing audience' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Connections & integrations' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Audit timeline' })).toBeInTheDocument();
  });

  it('reports CSV mapping and audience changes without handling persistence', async () => {
    const user = userEvent.setup();
    const onCsvMappingChange = vi.fn();
    const onAudienceSegmentChange = vi.fn();
    render(
      <TestConsole
        csvPreview={{
          fileName: 'members.csv',
          rowCount: 1,
          columns: ['Name', 'Email'],
          rows: [{ Name: 'Ari', Email: 'ari@example.org' }],
          targetFields: [{ key: 'email', label: 'Email' }],
          mapping: { email: 'Email' },
        }}
        audienceSegments={[{ id: 'active', label: 'Active members', description: 'Recently active', count: 12, selected: false }]}
        onCsvMappingChange={onCsvMappingChange}
        onAudienceSegmentChange={onAudienceSegmentChange}
      />,
    );
    await user.selectOptions(screen.getByRole('combobox', { name: 'Email column' }), 'Name');
    expect(onCsvMappingChange).toHaveBeenCalledWith('email', 'Name');
    await user.click(screen.getByRole('checkbox', { name: /Active members/ }));
    expect(onAudienceSegmentChange).toHaveBeenCalledWith('active', true);
  });

  it('has no accessibility violations for populated content', async () => {
    const { baseElement } = render(
      <TestConsole
        attendees={attendees}
        reports={[{ id: 'r', reporter: 'Taylor', subject: 'Post', reason: 'Needs review', submittedAt: '2025-04-15T10:00:00Z', status: 'under-review' }]}
        audienceSegments={[{ id: 'a', label: 'Attendees', description: 'Past event attendees', count: 30, selected: true }]}
        eventMetrics={[{ label: 'Registrations', value: 45 }]}
        attendanceBreakdown={[{ label: 'Checked in', value: 30 }, { label: 'No-show', value: 10 }]}
        auditEvents={[{ id: 'e', title: 'Roster updated', actor: 'Organizer', dateTime: '2025-04-15T10:00:00Z', timeLabel: 'Apr 15, 10:00 AM', tone: 'info' }]}
        integrations={[{ id: 'i', name: 'Calendar sync', type: 'connection', status: 'connected', description: 'Connected' }]}
      />,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('renders empty states and read-only controls when data and callbacks are omitted', () => {
    render(<TestConsole />);
    expect(screen.getByText('Attendee records will appear here when provided.')).toBeInTheDocument();
    expect(screen.getByText('No reports awaiting review.')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.getByText('No integration cards supplied.')).toBeInTheDocument();
  });
});
