import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { OrderSummary } from './OrderSummary';

describe('OrderSummary', () => {
  it('formats the provided totals and is accessible', async () => {
    const { container } = render(<OrderSummary title="Order summary" items={[{ id: 'plan', label: 'Plan', amount: 20 }]} subtotal={20} total={20} currency="USD" />);
    expect(screen.getByRole('region', { name: 'Order summary' })).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
