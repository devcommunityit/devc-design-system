import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { ScheduleGrid } from './ScheduleGrid';

const tracks = [
  { id: 'a', name: 'Main stage', sessions: [{ id: 'one', title: 'Opening talk', startTime: '09:30', endTime: '10:00' }] },
  { id: 'b', name: 'Workshop', sessions: [{ id: 'two', title: 'Hands-on lab', startTime: '09:30' }] },
];

describe('ScheduleGrid', () => {
  it('renders each track using agenda list semantics', () => {
    render(<ScheduleGrid title="Schedule" tracks={tracks} />);
    expect(screen.getByRole('region', { name: 'Schedule' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Main stage' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Workshop' })).toBeInTheDocument();
    expect(screen.getAllByRole('list')).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(<ScheduleGrid title="Schedule" tracks={tracks} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
