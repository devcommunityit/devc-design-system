import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('renders label, Intl-formatted value, footer and forwards ref and DOM props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <KpiCard
        ref={ref}
        data-testid="kpi"
        id="revenue"
        label="Revenue"
        value={84250}
        formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
        footer={<a href="#details">Details</a>}
      />,
    );
    const card = screen.getByTestId('kpi');
    expect(ref.current).toBe(card);
    expect(card).toHaveAttribute('id', 'revenue');
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('€84,250')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Details' })).toBeInTheDocument();
  });

  it('draws a decorative trend line coloured by sentiment', () => {
    const { container } = render(<KpiCard label="Errori" value={12} sparkline={[30, 22, NaN, 18, 12]} trend={{ direction: 'down', value: '−18%', sentiment: 'positive' }} />);
    const svg = container.querySelector('svg[data-sentiment]');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-sentiment', 'positive');
    const points = svg?.querySelector('polyline')?.getAttribute('points')?.split(' ') ?? [];
    expect(points).toHaveLength(4);
    expect(points[0]).toBe('0,2');
    expect(points[3]).toBe('100,30');
  });

  it('draws a flat line for constant data and nothing for fewer than two points', () => {
    const { container, rerender } = render(<KpiCard label="A" value={1} sparkline={[5, 5, 5]} />);
    expect(container.querySelector('polyline')).toHaveAttribute('points', '0,16 50,16 100,16');
    rerender(<KpiCard label="A" value={1} sparkline={[5]} />);
    expect(container.querySelector('svg[data-sentiment]')).not.toBeInTheDocument();
  });

  it('spells out the trend direction in the current locale', () => {
    render(
      <LocaleProvider locale="it-IT">
        <KpiCard label="Ricavi" value={1234.5} trend={{ direction: 'up', value: '+8%' }} />
      </LocaleProvider>,
    );
    expect(screen.getByText('1234,5')).toBeInTheDocument();
    expect(screen.getByText(/aumento/)).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <KpiCard label="Utenti attivi" value={12480} sparkline={[1, 3, 2, 5]} trend={{ direction: 'up', value: '+4%' }} footer="Ultimi 30 giorni" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
