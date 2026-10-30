import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { DonutChart } from './DonutChart';

const data = [
  { id: 'web', label: 'Web', value: 600 },
  { id: 'mobile', label: 'Mobile', value: 300 },
  { id: 'store', label: 'Store', value: 100 },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('DonutChart', () => {
  it('renders slices, the total in the center and a legend with values and percentages', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<DonutChart ref={ref} title="Channels" data={data} data-testid="donut" />);
    expect(ref.current).toBe(screen.getByTestId('donut'));
    expect(container.querySelectorAll('svg path[class*="slice"]')).toHaveLength(3);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toHaveTextContent('1,000');
    expect(svg).toHaveTextContent('Total');
    const legend = screen.getByRole('list');
    expect(within(legend).getByText('600 (60%)')).toBeInTheDocument();
    expect(within(legend).getByText('100 (10%)')).toBeInTheDocument();
  });

  it('moves across slices with arrow keys (wrapping) and announces them', async () => {
    const user = userEvent.setup();
    const { container } = en(<DonutChart title="Channels" data={data} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Channels' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Web: 600 (60%)');
    await user.keyboard('{ArrowLeft}');
    expect(live).toHaveTextContent('Store: 100 (10%)');
    await user.keyboard('{ArrowRight}');
    expect(live).toHaveTextContent('Web: 600 (60%)');
    expect(container.querySelector('g[data-active]')).toBeInTheDocument();
  });

  it('toggles a data table with values and total', async () => {
    const user = userEvent.setup();
    en(<DonutChart title="Channels" data={data} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Channels' });
    expect(within(table).getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Total' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '300 (30%)' })).toBeInTheDocument();
  });

  it('uses Italian strings and formatting', () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <DonutChart data={[{ id: 'a', label: 'Negozio', value: 12500 }]} />
      </LocaleProvider>,
    );
    expect(container.querySelector('svg')).toHaveTextContent('Totale');
    expect(container.querySelector('svg')).toHaveTextContent('12.500');
    expect(screen.getByRole('button', { name: 'Mostra tabella dati' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = en(<DonutChart title="Channels" description="Share of orders" data={data} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
