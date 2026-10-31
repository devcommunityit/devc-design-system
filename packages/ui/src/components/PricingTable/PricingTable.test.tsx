import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PricingTable, type PricingFeature, type PricingPlan } from './PricingTable';

const plans: PricingPlan[] = [
  { id: 'basic', name: 'Basic', price: '$0', billingPeriod: 'per month' },
  { id: 'pro', name: 'Pro', price: '$12', billingPeriod: 'per month' },
];
const features: PricingFeature[] = [
  { id: 'storage', label: 'Storage', values: { basic: '5 GB', pro: '50 GB' } },
  { id: 'support', label: 'Priority support', values: { basic: false, pro: true } },
];

describe('PricingTable', () => {
  it('renders a semantic comparison table and exposes boolean values accessibly', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PricingTable ref={ref} caption="Plans" plans={plans} features={features} data-testid="pricing" />);

    expect(ref.current).toBe(screen.getByTestId('pricing'));
    expect(screen.getByRole('table', { name: 'Plans' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Basic/ })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Storage' })).toBeInTheDocument();
    expect(screen.getByText('50 GB')).toBeInTheDocument();
    expect(screen.getByLabelText('Not included')).toBeInTheDocument();
    expect(screen.getByLabelText('Included')).toBeInTheDocument();
  });

  it('reports plan selection and reflects controlled selection state', () => {
    const onSelectPlan = vi.fn();
    const { rerender } = render(
      <PricingTable caption="Plans" plans={plans} features={features} onSelectPlan={onSelectPlan} selectedPlanId="basic" />,
    );

    const selectButtons = screen.getAllByRole('button', { name: /^Select plan / });
    expect(selectButtons.map((button) => button.getAttribute('aria-labelledby'))[0]).not.toBe(selectButtons[1]?.getAttribute('aria-labelledby'));
    expect(screen.getByRole('button', { name: 'Select plan Basic' })).toBe(selectButtons[0]);
    expect(screen.getByRole('button', { name: 'Select plan Pro' })).toBe(selectButtons[1]);
    expect(selectButtons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(selectButtons[1]).toHaveAttribute('aria-pressed', 'false');
    const proButton = selectButtons[1];
    if (!proButton) throw new Error('Expected the Pro selection button.');
    fireEvent.click(proButton);
    expect(onSelectPlan).toHaveBeenCalledWith('pro');

    rerender(
      <PricingTable caption="Plans" plans={plans} features={features} onSelectPlan={onSelectPlan} selectedPlanId="pro" />,
    );
    expect(screen.getByRole('button', { name: 'Select plan Pro' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('localizes built-in labels through LocaleProvider', () => {
    render(
      <LocaleProvider locale="it-IT">
        <PricingTable caption="Piani" plans={plans} features={features} onSelectPlan={() => undefined} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Seleziona piano Basic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seleziona piano Pro' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Funzionalità' })).toBeInTheDocument();
    expect(screen.getByLabelText('Non incluso')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PricingTable caption="Plans" plans={plans} features={features} onSelectPlan={() => undefined} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
