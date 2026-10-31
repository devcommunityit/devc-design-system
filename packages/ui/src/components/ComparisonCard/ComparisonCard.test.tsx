import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ComparisonCard } from './ComparisonCard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('ComparisonCard', () => {
  it('renders both periods, the percentage delta and spells out the direction', () => {
    const ref = createRef<HTMLDivElement>();
    en(
      <ComparisonCard
        ref={ref}
        data-testid="cmp"
        label="Revenue"
        current={{ label: 'October', value: 1100 }}
        previous={{ label: 'September', value: 1000 }}
        formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      />,
    );
    const card = screen.getByTestId('cmp');
    expect(ref.current).toBe(card);
    expect(screen.getByText('October')).toBeInTheDocument();
    expect(screen.getByText('€1,100')).toBeInTheDocument();
    expect(screen.getByText('€1,000')).toBeInTheDocument();
    expect(card).toHaveAttribute('data-direction', 'up');
    expect(card).toHaveAttribute('data-sentiment', 'positive');
    expect(card).toHaveTextContent('increase +10%');
  });

  it('treats a decrease as positive when lower is better', () => {
    en(<ComparisonCard data-testid="cmp" label="Errors" current={{ label: 'Now', value: 30 }} previous={{ label: 'Before', value: 40 }} higherIsBetter={false} />);
    const card = screen.getByTestId('cmp');
    expect(card).toHaveAttribute('data-direction', 'down');
    expect(card).toHaveAttribute('data-sentiment', 'positive');
    expect(card).toHaveTextContent('decrease -25%');
  });

  it('flags an increase as negative when lower is better and handles no change', () => {
    const { rerender } = en(<ComparisonCard data-testid="cmp" label="Errors" current={{ label: 'Now', value: 50 }} previous={{ label: 'Before', value: 40 }} higherIsBetter={false} />);
    expect(screen.getByTestId('cmp')).toHaveAttribute('data-sentiment', 'negative');
    rerender(
      <LocaleProvider locale="en-US">
        <ComparisonCard data-testid="cmp" label="Errors" current={{ label: 'Now', value: 40 }} previous={{ label: 'Before', value: 40 }} />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('cmp')).toHaveAttribute('data-sentiment', 'neutral');
    expect(screen.getByTestId('cmp')).toHaveTextContent('no change 0%');
  });

  it('shows the absolute difference when the previous value is zero', () => {
    const { container } = en(<ComparisonCard data-testid="cmp" label="Events" current={{ label: 'Q4', value: 3 }} previous={{ label: 'Q3', value: 0 }} />);
    expect(screen.getByTestId('cmp')).toHaveTextContent('increase +3');
    const bars = container.querySelectorAll<HTMLElement>('[aria-hidden="true"] > span');
    expect(bars[0]?.style.getPropertyValue('--_ratio')).toBe('1');
    expect(bars[1]?.style.getPropertyValue('--_ratio')).toBe('0');
  });

  it('has no axe violations', async () => {
    const { container } = en(
      <ComparisonCard label="Revenue" headingLevel={3} current={{ label: 'October', value: 1100 }} previous={{ label: 'September', value: 1000 }} description="Source: ERP" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
