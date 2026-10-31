import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Agenda, AgendaItem } from './Agenda';

describe('Agenda', () => {
  it('renders a labelled section and compositional event list', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Agenda ref={ref} title="Thursday schedule" data-testid="agenda">
        <AgendaItem
          title="Opening keynote"
          href="/keynote"
          startTime="09:30"
          endTime="10:15"
          startDateTime="2026-11-12T09:30"
          endDateTime="2026-11-12T10:15"
          location="Main stage"
        />
      </Agenda>,
    );

    expect(ref.current).toBe(screen.getByTestId('agenda'));
    expect(screen.getByRole('region', { name: 'Thursday schedule' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Opening keynote' })).toHaveAttribute('href', '/keynote');
    expect(container.querySelector('time[datetime="2026-11-12T09:30"]')).toHaveTextContent('09:30');
    expect(container.querySelector('time[datetime="2026-11-12T10:15"]')).toHaveTextContent('10:15');
  });

  it('renders an empty state without an empty list', () => {
    const { container } = render(<Agenda title="Upcoming events" emptyState="No events scheduled." />);
    expect(screen.getByText('No events scheduled.')).toBeInTheDocument();
    expect(container.querySelector('ol')).toBeNull();
  });

  it('treats conditional false and null children as empty', () => {
    const { container } = render(<Agenda title="Upcoming events" emptyState="No events">{false}{null}</Agenda>);
    expect(screen.getByText('No events')).toBeInTheDocument();
    expect(container.querySelector('ol')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Agenda title="Today’s agenda">
        <AgendaItem title="Opening keynote" startTime="09:30" description="Welcome to the event." />
      </Agenda>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
