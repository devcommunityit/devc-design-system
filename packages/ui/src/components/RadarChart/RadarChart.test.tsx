import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RadarChart } from './RadarChart';

const axes = ['Speed', 'Quality', 'Cost', 'Support'];
const series = [
  { id: 'alpha', label: 'Alpha', data: [80, 60, null, 90] },
  { id: 'beta', label: 'Beta', data: [50, 70, 65, 40] },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('RadarChart', () => {
  it('renders rings, spokes, axis labels and one polygon per series; forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<RadarChart ref={ref} title="Vendors" axes={axes} series={series} max={100} appearance="vivid" data-testid="radar" id="r1" />);
    const figure = screen.getByTestId('radar');
    expect(figure.tagName).toBe('FIGURE');
    expect(ref.current).toBe(figure);
    expect(figure).toHaveAttribute('id', 'r1');
    expect(figure).toHaveAttribute('data-chart-appearance', 'vivid');
    const plot = screen.getByRole('group', { name: 'Vendors' });
    expect(plot).toHaveAttribute('tabindex', '0');
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toHaveTextContent('Speed');
    expect(svg).toHaveTextContent('100');
    expect(container.querySelectorAll('path[class*="ring"]')).toHaveLength(4);
    expect(container.querySelectorAll('line[class*="spoke"]')).toHaveLength(4);
    // area + outline + 3 markers (the null value is skipped).
    expect(container.querySelectorAll('[data-series="alpha"] path')).toHaveLength(2 + 3);
    expect(container.querySelectorAll('[data-series="beta"] path')).toHaveLength(2 + 4);
    expect(container.querySelector('[data-series="alpha"]')?.getAttribute('style')).toContain('--_area');
  });

  it('moves between axes with the keyboard (wrapping) and highlights the active spoke', async () => {
    const user = userEvent.setup();
    const { container } = en(<RadarChart title="Vendors" axes={axes} series={series} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Vendors' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Speed: Alpha 80, Beta 50');
    expect(container.querySelector('line[data-active]')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(live).toHaveTextContent('Cost: Alpha —, Beta 65');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('Support: Alpha 90, Beta 40');
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Speed:');
    await user.keyboard('{ArrowLeft}');
    expect(live).toHaveTextContent('Support:');
    await user.keyboard('{Escape}');
    expect(container.querySelector('line[data-active]')).not.toBeInTheDocument();
  });

  it('toggles an accessible data table (rows = axes, columns = series)', async () => {
    const user = userEvent.setup();
    en(<RadarChart title="Vendors" axes={axes} series={series} formatOptions={{ style: 'percent' }} max={1} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Vendors' });
    expect(within(table).getByRole('columnheader', { name: 'Alpha' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Beta' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Support' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '9,000%' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '—' })).toBeInTheDocument();
  });

  it('toggles series from the legend (uncontrolled and controlled)', async () => {
    const user = userEvent.setup();
    const onHiddenSeriesChange = vi.fn();
    const { container, unmount } = en(<RadarChart axes={axes} series={series} onHiddenSeriesChange={onHiddenSeriesChange} />);
    const beta = screen.getByRole('button', { name: 'Beta' });
    expect(beta).toHaveAttribute('aria-pressed', 'true');
    await user.click(beta);
    expect(onHiddenSeriesChange).toHaveBeenCalledWith(['beta']);
    expect(beta).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelector('[data-series="beta"]')).not.toBeInTheDocument();
    unmount();

    const onChange = vi.fn();
    const { container: c2 } = en(<RadarChart axes={axes} series={series} hiddenSeries={['alpha']} onHiddenSeriesChange={onChange} />);
    expect(c2.querySelector('[data-series="alpha"]')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Alpha' }));
    expect(onChange).toHaveBeenCalledWith([]);
    expect(c2.querySelector('[data-series="alpha"]')).not.toBeInTheDocument();
  });

  it('uses Italian strings and number formatting', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <RadarChart axes={['A', 'B', 'C']} series={[{ id: 'r', label: 'Ricavi', data: [1200.5, 900, 1000] }]} showLegend={false} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Dati del grafico' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostra tabella dati' })).toBeInTheDocument();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(/A: Ricavi 1\.?200,5/);
  });

  it('has no axe violations (table open)', async () => {
    const user = userEvent.setup();
    const { container } = en(<RadarChart title="Vendors" description="Score" axes={axes} series={series} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
