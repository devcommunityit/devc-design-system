import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { HeatmapChart } from './HeatmapChart';

const rows = ['Mon', 'Tue'];
const columns = ['Morning', 'Afternoon', 'Evening'];
const values = [
  [10, 50, null],
  [30, 90, 1200],
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('HeatmapChart', () => {
  it('renders a cell per value with opacity scaled by value, empty cells and a min–max scale', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<HeatmapChart ref={ref} title="Visits" rows={rows} columns={columns} values={values} appearance="vivid" data-testid="heat" />);
    const figure = screen.getByTestId('heat');
    expect(figure.tagName).toBe('FIGURE');
    expect(ref.current).toBe(figure);
    expect(figure).toHaveAttribute('data-chart-appearance', 'vivid');
    expect(container.querySelectorAll('[data-cell]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-empty]')).toHaveLength(1);
    const overlays = container.querySelectorAll('rect[class*="cell"][fill-opacity]');
    expect(overlays).toHaveLength(5);
    expect(container.querySelector('[data-cell="0-0"] rect[fill-opacity]')).toHaveAttribute('fill-opacity', '0.12');
    expect(container.querySelector('[data-cell="1-2"] rect[fill-opacity]')).toHaveAttribute('fill-opacity', '1');
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toHaveTextContent('Mon');
    expect(svg).toHaveTextContent('Evening');
    const scale = container.querySelector('div[class*="scale"]');
    expect(scale).toHaveTextContent('10');
    expect(scale).toHaveTextContent('1,200');
  });

  it('moves across cells in two dimensions and announces row · column: value', async () => {
    const user = userEvent.setup();
    const { container } = en(<HeatmapChart title="Visits" rows={rows} columns={columns} values={values} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Visits' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Mon · Morning: 10');
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Mon · Afternoon: 50');
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('Tue · Afternoon: 90');
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('Tue · Afternoon: 90');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('Tue · Evening: 1,200');
    await user.keyboard('{ArrowUp}');
    expect(live).toHaveTextContent('Mon · Evening: —');
    await user.keyboard('{Home}');
    expect(live).toHaveTextContent('Mon · Morning: 10');
    expect(container.querySelector('rect[class*="activeCell"]')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(container.querySelector('rect[class*="activeCell"]')).not.toBeInTheDocument();
  });

  it('toggles an accessible data table (rows × columns)', async () => {
    const user = userEvent.setup();
    en(<HeatmapChart title="Visits" rows={rows} columns={columns} values={values} showLegend={false} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Visits' });
    expect(within(table).getByRole('columnheader', { name: 'Evening' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Tue' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '1,200' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '—' })).toBeInTheDocument();
  });

  it('uses Italian strings and number formatting', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <HeatmapChart rows={['Lun']} columns={['Mattina']} values={[[1200.5]]} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Dati del grafico' })).toBeInTheDocument();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(/Lun · Mattina: 1\.?200,5/);
  });

  it('has no axe violations (table open)', async () => {
    const user = userEvent.setup();
    const { container } = en(<HeatmapChart title="Visits" description="Weekly" rows={rows} columns={columns} values={values} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
