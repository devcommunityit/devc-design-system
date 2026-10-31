import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { PaymentMethodCard } from './PaymentMethodCard';

describe('PaymentMethodCard', () => {
  it('renders only the masked details and selected state', async () => {
    const { container } = render(<PaymentMethodCard brand="Visa" lastFour="4242424242424242" expiry="Expires 08/2028" selected />);
    expect(screen.getByText('•••• 4242')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('4242424242424242');
    expect(screen.queryByLabelText(/card number/i)).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
