import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { BarChart } from './BarChart';

const categories = ['North', 'South', 'East'];
const series = [
  { id: 'q1', label: 'Q1', data: [120, 80, null] },
  { id: 'q2', label: 'Q2', data: [140, -20, 60] },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);
const bars = (container: HTMLElement) => container.querySelectorAll('[role="group"] > svg rect[class*="fill"]');

describe('BarChart', () => {
  it('renders grouped vertical bars, skips nulls and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<BarChart ref={ref} title="Sales" categories={categories} series={series} data-testid="bars" />);
    const figure = screen.getByTestId('bars');
    expect(ref.current).toBe(figure);
    expect(figure).toHaveAttribute('data-orientation', 'vertical');
    expect(figure).toHaveAttribute('data-layout', 'grouped');
    expect(bars(container)).toHaveLength(5);
    expect(screen.getByRole('group', { name: 'Sales' })).toHaveAttribute('tabindex', '0');
  });

  it('supports horizontal stacked layout', () => {
    const { container } = en(<BarChart title="Sales" orientation="horizontal" layout="stacked" categories={categories} series={series} />);
    expect(screen.getByRole('figure')).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getByRole('figure')).toHaveAttribute('data-layout', 'stacked');
    expect(bars(container)).toHaveLength(5);
    expect(container.querySelector('svg')?.textContent).toContain('North');
  });

  it('navigates categories with arrow keys and announces values', async () => {
    const user = userEvent.setup();
    const { container } = en(<BarChart title="Sales" categories={categories} series={series} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('North: Q1 120, Q2 140');
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('South: Q1 80, Q2 -20');
    await user.keyboard('{ArrowUp}{ArrowLeft}');
    expect(live).toHaveTextContent('North:');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('East: Q1 —, Q2 60');
    expect(container.querySelector('rect[class*="activeBand"]')).toBeInTheDocument();
  });

  it('toggles the data table', async () => {
    const user = userEvent.setup();
    en(<BarChart title="Sales" categories={categories} series={series} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Sales' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getByRole('columnheader', { name: 'Q2' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hide data table' }));
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('hides series from the legend', async () => {
    const user = userEvent.setup();
    const onHiddenSeriesChange = vi.fn();
    const { container } = en(<BarChart categories={categories} series={series} defaultHiddenSeries={['q2']} onHiddenSeriesChange={onHiddenSeriesChange} />);
    expect(bars(container)).toHaveLength(2);
    const q2 = screen.getByRole('button', { name: 'Q2' });
    expect(q2).toHaveAttribute('aria-pressed', 'false');
    await user.click(q2);
    expect(onHiddenSeriesChange).toHaveBeenCalledWith([]);
    expect(bars(container)).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Q1' }));
    expect(bars(container)).toHaveLength(3);
  });

  it('uses Italian strings', () => {
    render(
      <LocaleProvider locale="it-IT">
        <BarChart categories={categories} series={series} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Dati del grafico' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostra tabella dati' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = en(<BarChart title="Sales" description="Units" orientation="horizontal" categories={categories} series={series} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
