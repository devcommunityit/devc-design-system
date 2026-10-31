import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { GoalCard } from './GoalCard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);
const eur = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 } as const;

describe('GoalCard', () => {
  it('exposes a labelled meter with value, target and text alternative', () => {
    const ref = createRef<HTMLDivElement>();
    en(<GoalCard ref={ref} data-testid="goal" label="October sales" value={42000} target={50000} formatOptions={eur} />);
    expect(ref.current).toBe(screen.getByTestId('goal'));
    const meter = screen.getByRole('meter', { name: 'October sales' });
    expect(meter).toHaveAttribute('aria-valuenow', '42000');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '50000');
    expect(meter).toHaveAttribute('aria-valuetext', '84% (€42,000 / Target €50,000)');
    expect(meter).toHaveTextContent('84%');
    expect(screen.getByText('€42,000')).toBeInTheDocument();
    expect(screen.getByText('€8,000 to go')).toBeInTheDocument();
    expect(screen.getByTestId('goal')).not.toHaveAttribute('data-reached');
  });

  it('announces when the target is reached and clamps the meter value', () => {
    en(<GoalCard data-testid="goal" label="Tickets" value={312} target={300} tone="success" />);
    expect(screen.getByText('Target reached')).toBeInTheDocument();
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '300');
    expect(meter).toHaveTextContent('104%');
    expect(screen.getByTestId('goal')).toHaveAttribute('data-reached', 'true');
    expect(screen.getByTestId('goal')).toHaveAttribute('data-tone', 'success');
  });

  it('uses a gradient stroke for the brand tone and renders the label as a heading', () => {
    const { container } = en(<GoalCard label="Signups" value={10} target={40} headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Signups' })).toBeInTheDocument();
    const arc = container.querySelector('circle[pathLength]');
    expect(arc?.getAttribute('stroke')).toMatch(/^url\(#/);
    expect(container.querySelectorAll('linearGradient stop')).toHaveLength(2);
  });

  it('localizes the remaining amount', () => {
    render(
      <LocaleProvider locale="it-IT">
        <GoalCard label="Vendite" value={6} target={12} />
      </LocaleProvider>,
    );
    expect(screen.getByText('Mancano 6')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(
      <div>
        <GoalCard label="Sales" value={42000} target={50000} formatOptions={eur} description="Updated yesterday" footer={<a href="#d">Details</a>} />
        <GoalCard label="Tickets" value={312} target={300} tone="success" headingLevel={2} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
