import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ScatterChart } from './ScatterChart';

const series = [
  {
    id: 'north',
    label: 'North',
    points: [
      { x: 120, y: 48000, label: 'Milan' },
      { x: 40, y: 19000, label: 'Verona' },
    ],
  },
  { id: 'south', label: 'South', points: [{ x: 90, y: 31000 }] },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('ScatterChart', () => {
  it('renders a marker per point, axis titles and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<ScatterChart ref={ref} title="Stores" series={series} xLabel="Area" yLabel="Revenue" appearance="vivid" data-testid="scatter" id="s1" />);
    const figure = screen.getByTestId('scatter');
    expect(figure.tagName).toBe('FIGURE');
    expect(ref.current).toBe(figure);
    expect(figure).toHaveAttribute('id', 's1');
    expect(figure).toHaveAttribute('data-chart-appearance', 'vivid');
    expect(screen.getByRole('group', { name: 'Stores' })).toHaveAttribute('tabindex', '0');
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toHaveTextContent('Area');
    expect(svg).toHaveTextContent('Revenue');
    expect(container.querySelectorAll('[data-series="north"] path')).toHaveLength(2);
    expect(container.querySelectorAll('[data-series="south"] path')).toHaveLength(1);
    expect(container.querySelector('path[class*="bubble"]')).not.toBeInTheDocument();
  });

  it('draws bubbles sized by a sqrt scale', () => {
    const { container } = en(
      <ScatterChart
        series={[
          {
            id: 'p',
            label: 'Projects',
            points: [
              { x: 1, y: 1, size: 100 },
              { x: 2, y: 2, size: 25 },
            ],
          },
        ]}
      />,
    );
    const bubbles = container.querySelectorAll('path[class*="bubble"]');
    expect(bubbles).toHaveLength(2);
    // Circle path: "M{x - r},{y}a{r},{r} …"; radius 18 for the largest value, 4 + 0.5 × 14 = 11 for a quarter of it.
    expect(bubbles[0]?.getAttribute('d')).toMatch(/a18,18 /);
    expect(bubbles[1]?.getAttribute('d')).toMatch(/a11,11 /);
  });

  it('moves across points sorted by x and shows crosshair guides', async () => {
    const user = userEvent.setup();
    const { container } = en(<ScatterChart title="Stores" series={series} xLabel="Area" yLabel="Revenue" />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Stores' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('North — Verona: Area 40, Revenue 19,000');
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('South — 1: Area 90, Revenue 31,000');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('North — Milan: Area 120, Revenue 48,000');
    expect(container.querySelectorAll('line[class*="guide"]')).toHaveLength(2);
    expect(container.querySelector('path[class*="markerActive"]')).toBeInTheDocument();
    await user.keyboard('{Home}');
    expect(live).toHaveTextContent('North — Verona:');
    await user.keyboard('{Escape}');
    expect(container.querySelector('line[class*="guide"]')).not.toBeInTheDocument();
  });

  it('toggles an accessible data table (point, series, x, y)', async () => {
    const user = userEvent.setup();
    en(<ScatterChart title="Stores" series={series} xLabel="Area" yLabel="Revenue" yFormatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Stores' });
    expect(within(table).getByRole('columnheader', { name: 'Series' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Area' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Revenue' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Milan' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: '1' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '€48,000' })).toBeInTheDocument();
  });

  it('toggles series from the legend (uncontrolled and controlled)', async () => {
    const user = userEvent.setup();
    const onHiddenSeriesChange = vi.fn();
    const { container, unmount } = en(<ScatterChart series={series} onHiddenSeriesChange={onHiddenSeriesChange} />);
    const south = screen.getByRole('button', { name: 'South' });
    await user.click(south);
    expect(onHiddenSeriesChange).toHaveBeenCalledWith(['south']);
    expect(south).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelector('[data-series="south"]')).not.toBeInTheDocument();
    unmount();

    const onChange = vi.fn();
    const { container: c2 } = en(<ScatterChart series={series} hiddenSeries={['north']} onHiddenSeriesChange={onChange} />);
    expect(c2.querySelector('[data-series="north"]')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'North' }));
    expect(onChange).toHaveBeenCalledWith([]);
    expect(c2.querySelector('[data-series="north"]')).not.toBeInTheDocument();
  });

  it('uses Italian strings and number formatting', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <ScatterChart series={[{ id: 'a', label: 'Negozi', points: [{ x: 1200.5, y: 3, label: 'Roma' }] }]} showLegend={false} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Dati del grafico' })).toBeInTheDocument();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(/Negozi — Roma: 1\.?200,5, 3/);
  });

  it('has no axe violations (table open)', async () => {
    const user = userEvent.setup();
    const { container } = en(<ScatterChart title="Stores" description="2026" series={series} xLabel="Area" yLabel="Revenue" />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
