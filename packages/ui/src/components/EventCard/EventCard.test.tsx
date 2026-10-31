import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { EventCard, type EventCardProps } from './EventCard';

function renderCard(props: Partial<EventCardProps> = {}, locale = 'it-IT') {
  return render(
    <LocaleProvider locale={locale}>
      <EventCard title="AI Agents in Production" {...props} />
    </LocaleProvider>,
  );
}

describe('EventCard', () => {
  it('renders an article labelled by the title heading', () => {
    renderCard({ headingLevel: 2 });
    const heading = screen.getByRole('heading', { level: 2, name: 'AI Agents in Production' });
    expect(screen.getByRole('article', { name: 'AI Agents in Production' })).toContainElement(heading);
  });

  it('shows date, mode tag and decorative watermark on the cover', () => {
    const { container } = renderCard({ date: '2026-11-12', mode: 'hybrid', watermark: 'AI', tone: 'violet' });
    expect(container.querySelector('time')).toHaveAttribute('dateTime', '2026-11-12');
    expect(screen.getByText('Ibrido')).toBeInTheDocument();
    expect(screen.getByText('AI')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('article')).toHaveAttribute('data-tone', 'violet');
  });

  it('localizes the mode label', () => {
    renderCard({ mode: 'online' }, 'en-US');
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('renders a capacity meter with seats text', () => {
    renderCard({ seatsTaken: 86, capacity: 120 });
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '86');
    expect(meter).toHaveAttribute('aria-valuetext', '86 / 120 posti');
    expect(screen.getByText('86 / 120 posti')).toBeInTheDocument();
  });

  it('warns when few seats are left', () => {
    renderCard({ seatsTaken: 117, capacity: 120 });
    expect(screen.getByText('Ultimi 3 posti')).toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'warning');
  });

  it('respects a custom low seats threshold', () => {
    renderCard({ seatsTaken: 100, capacity: 120, lowSeatsThreshold: 20 });
    expect(screen.getByText('Ultimi 20 posti')).toBeInTheDocument();
  });

  it('shows sold out when full', () => {
    renderCard({ seatsTaken: 130, capacity: 120 });
    expect(screen.getByText('Esaurito')).toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '120');
  });

  it('makes the title a link while keeping the action clickable', async () => {
    const onPress = vi.fn();
    renderCard({
      href: '/eventi/ai',
      action: (
        <button type="button" onClick={onPress}>
          Iscriviti
        </button>
      ),
    });
    expect(screen.getByRole('link', { name: 'AI Agents in Production' })).toHaveAttribute('href', '/eventi/ai');
    await userEvent.click(screen.getByRole('button', { name: 'Iscriviti' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders attendees with an overflow counter', () => {
    renderCard({
      attendees: [{ name: 'Giulia Rossi' }, { name: 'Marco Bianchi' }, { name: 'Sara Conti' }, { name: 'Luca Ferri' }],
      maxAttendees: 2,
      attendeesLabel: 'Partecipanti',
    });
    expect(screen.getByRole('group', { name: 'Partecipanti' })).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('forwards ref and rest props', () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <LocaleProvider locale="it-IT">
        <EventCard ref={ref} title="Evento" data-testid="card" className="custom" />
      </LocaleProvider>,
    );
    expect(ref.current).toBe(screen.getByTestId('card'));
    expect(ref.current).toHaveClass('custom');
  });

  it('has no axe violations', async () => {
    const { container } = renderCard({
      href: '/eventi/ai',
      date: '2026-11-12',
      mode: 'hybrid',
      watermark: 'AI',
      location: 'Roma',
      time: '18:30 – 21:00',
      seatsTaken: 86,
      capacity: 120,
      attendees: [{ name: 'Giulia Rossi' }, { name: 'Marco Bianchi' }],
      attendeesLabel: 'Partecipanti',
      action: <button type="button">Iscriviti</button>,
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
