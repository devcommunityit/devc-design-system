import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { LineChart } from './LineChart';

const categories = ['Jan', 'Feb', 'Mar', 'Apr'];
const series = [
  { id: 'revenue', label: 'Revenue', data: [1200, 1500, null, 1800] },
  { id: 'costs', label: 'Costs', data: [800, 900, 950, 1000] },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('LineChart', () => {
  it('renders a figure with caption, a named focusable plot and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<LineChart ref={ref} title="Revenue 2026" description="Monthly, EUR" categories={categories} series={series} variant="area" data-testid="chart" id="c1" />);
    const figure = screen.getByTestId('chart');
    expect(figure.tagName).toBe('FIGURE');
    expect(ref.current).toBe(figure);
    expect(figure).toHaveAttribute('id', 'c1');
    expect(figure).toHaveAttribute('data-variant', 'area');
    expect(screen.getByRole('figure')).toBe(figure);
    const plot = screen.getByRole('group', { name: 'Revenue 2026' });
    expect(plot).toHaveAttribute('tabindex', '0');
    expect(plot).toHaveAccessibleDescription('Use the arrow keys to move between data points.');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    // null leaves a gap: the revenue line has two runs, one of them a single point (marker only).
    expect(container.querySelectorAll('[data-series="revenue"] path[d^="M"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-series="revenue"] path')).toHaveLength(2 + 3);
  });

  it('moves between categories with the keyboard and announces values politely', async () => {
    const user = userEvent.setup();
    const { container } = en(<LineChart title="Revenue" categories={categories} series={series} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Revenue' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Jan: Revenue 1,200, Costs 800');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(live).toHaveTextContent('Mar: Revenue —, Costs 950');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('Apr: Revenue 1,800, Costs 1,000');
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Apr:');
    await user.keyboard('{Home}');
    expect(live).toHaveTextContent('Jan:');
    expect(container.querySelector('line[class*="guide"]')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(container.querySelector('line[class*="guide"]')).not.toBeInTheDocument();
  });

  it('toggles an accessible data table', async () => {
    const user = userEvent.setup();
    en(<LineChart title="Revenue" categories={categories} series={series} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Show data table' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    const table = screen.getByRole('table', { name: 'Revenue' });
    expect(toggle).toHaveAccessibleName('Hide data table');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(within(table).getByRole('columnheader', { name: 'Category' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Apr' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '€1,800' })).toBeInTheDocument();
  });

  it('toggles series from the legend (uncontrolled and controlled)', async () => {
    const user = userEvent.setup();
    const onHiddenSeriesChange = vi.fn();
    const { container, unmount } = en(<LineChart categories={categories} series={series} onHiddenSeriesChange={onHiddenSeriesChange} />);
    const costs = screen.getByRole('button', { name: 'Costs' });
    expect(costs).toHaveAttribute('aria-pressed', 'true');
    await user.click(costs);
    expect(onHiddenSeriesChange).toHaveBeenCalledWith(['costs']);
    expect(costs).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelector('[data-series="costs"]')).not.toBeInTheDocument();
    unmount();

    const onChange = vi.fn();
    const { container: c2 } = en(<LineChart categories={categories} series={series} hiddenSeries={['revenue']} onHiddenSeriesChange={onChange} />);
    expect(c2.querySelector('[data-series="revenue"]')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Revenue' }));
    expect(onChange).toHaveBeenCalledWith([]);
    expect(c2.querySelector('[data-series="revenue"]')).not.toBeInTheDocument();
  });

  it('uses Italian strings and number formatting', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <LineChart categories={['Gen', 'Feb']} series={[{ id: 'r', label: 'Ricavi', data: [1200, 1500] }]} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Dati del grafico' })).toHaveAccessibleDescription('Usa i tasti freccia per spostarti tra i punti dati.');
    expect(screen.getByRole('button', { name: 'Mostra tabella dati' })).toBeInTheDocument();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(/Gen: Ricavi 1\.?200/);
  });

  it('has no axe violations (table open)', async () => {
    const user = userEvent.setup();
    const { container } = en(<LineChart title="Revenue" description="EUR" categories={categories} series={series} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
