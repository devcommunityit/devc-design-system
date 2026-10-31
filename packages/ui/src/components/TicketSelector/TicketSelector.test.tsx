import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { TicketSelector } from './TicketSelector';

const tickets = [
  { id: 'standard', name: 'Standard', price: '$20' },
  { id: 'premium', name: 'Premium', price: '$30' },
  { id: 'sold', name: 'Sold out', price: '$40', unavailable: true },
];

describe('TicketSelector', () => {
  it('shows controlled choices and reports changes', () => {
    const onTicketChange = vi.fn();
    const onQuantityChange = vi.fn();
    render(<TicketSelector title="Tickets" tickets={tickets} selectedTicketId="standard" quantity={1} onTicketChange={onTicketChange} onQuantityChange={onQuantityChange} />);
    expect(screen.getByRole('radio', { name: /Standard/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /Sold out/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('radio', { name: /Premium/ }));
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });
    expect(onTicketChange).toHaveBeenCalledWith('premium');
    expect(onQuantityChange).toHaveBeenCalledWith(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(<TicketSelector title="Tickets" tickets={tickets} selectedTicketId="standard" quantity={1} onTicketChange={() => {}} onQuantityChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
