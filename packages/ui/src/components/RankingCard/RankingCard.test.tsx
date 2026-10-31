import { render, screen, within } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RankingCard } from './RankingCard';

const items = [
  { id: 'a', label: 'Alpha', value: 2000, description: 'Frontend' },
  { id: 'b', label: 'Beta', value: 1000 },
  { id: 'c', label: 'Gamma', value: 500 },
  { id: 'd', label: 'Delta', value: 250 },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('RankingCard', () => {
  it('renders a named ordered list with ranks, formatted values and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    en(<RankingCard ref={ref} data-testid="ranking" title="Top articles" items={items} />);
    expect(ref.current).toBe(screen.getByTestId('ranking'));
    expect(screen.getByRole('heading', { level: 3, name: 'Top articles' })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Top articles' });
    expect(list.tagName).toBe('OL');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent('1');
    expect(rows[0]).toHaveTextContent('2,000');
    expect(rows[0]).toHaveTextContent('Frontend');
    expect(rows[0]).toHaveAttribute('data-top', '1');
    expect(rows[3]).not.toHaveAttribute('data-top');
  });

  it('draws decorative bars proportional to the maximum', () => {
    const { container } = en(<RankingCard title="T" items={items} />);
    const bars = container.querySelectorAll<HTMLElement>('[aria-hidden="true"] > [data-series]');
    expect(bars).toHaveLength(4);
    expect(bars[0]?.style.getPropertyValue('--_ratio')).toBe('1');
    expect(bars[1]?.style.getPropertyValue('--_ratio')).toBe('0.5');
    expect(bars[2]).toHaveAttribute('data-series', '3');
  });

  it('limits rows with maxItems and formats with formatOptions', () => {
    en(<RankingCard title="T" items={items} maxItems={2} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} headingLevel={2} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('€2,000')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(<RankingCard title="Top" items={items} barStyle="gradient" footer={<a href="#all">All</a>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
