import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { EventTicket } from './EventTicket';

describe('EventTicket', () => {
  it('renders ticket details and consumer-supplied QR content', () => {
    render(<EventTicket eventName="Summit" attendeeName="Alex" ticketName="Standard" ticketCode="X91" qrVisual={<span>QR supplied by host</span>} />);
    expect(screen.getByRole('article', { name: 'Summit' })).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByText('QR supplied by host')).toBeInTheDocument();
    expect(screen.getByText('X91')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<EventTicket eventName="Summit" attendeeName="Alex" ticketName="Standard" ticketCode="X91" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
