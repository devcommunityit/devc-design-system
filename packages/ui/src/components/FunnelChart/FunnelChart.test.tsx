import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { FunnelChart } from './FunnelChart';

const data = [
  { id: 'visits', label: 'Visits', value: 1000 },
  { id: 'cart', label: 'Cart', value: 400 },
  { id: 'orders', label: 'Orders', value: 150 },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('FunnelChart', () => {
  it('renders one bar per step, connectors, values and conversions', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<FunnelChart ref={ref} title="Checkout" data={data} data-testid="funnel" />);
    expect(ref.current).toBe(screen.getByTestId('funnel'));
    const bars = container.querySelectorAll('svg rect[class*="bar"]');
    expect(bars).toHaveLength(3);
    const widths = [...bars].map((b) => Number(b.getAttribute('width')));
    expect(widths[1]! / widths[0]!).toBeCloseTo(0.4);
    expect(container.querySelectorAll('svg polygon')).toHaveLength(2);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toHaveTextContent('Visits');
    expect(svg).toHaveTextContent('1,000 100%');
    expect(svg).toHaveTextContent('150 15%');
  });

  it('moves across steps with arrow keys and announces them', async () => {
    const user = userEvent.setup();
    const { container } = en(<FunnelChart title="Checkout" data={data} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Checkout' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('Visits: 1,000, Conversion: 100%');
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('Cart: 400, Conversion: 40%');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('Orders: 150, Conversion: 15%');
    expect(container.querySelector('g[data-active]')).toBeInTheDocument();
  });

  it('toggles a data table with value and conversion', async () => {
    const user = userEvent.setup();
    en(<FunnelChart title="Checkout" data={data} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Checkout' });
    expect(within(table).getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Conversion' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '40%' })).toBeInTheDocument();
  });

  it('sets the appearance attribute', () => {
    en(<FunnelChart title="Checkout" data={data} appearance="vivid" data-testid="funnel" />);
    expect(screen.getByTestId('funnel')).toHaveAttribute('data-chart-appearance', 'vivid');
  });

  it('uses Italian strings and formatting', () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <FunnelChart data={[{ id: 'a', label: 'Visite', value: 12500 }]} />
      </LocaleProvider>,
    );
    expect(container.querySelector('svg')).toHaveTextContent('12.500');
    expect(screen.getByRole('button', { name: 'Mostra tabella dati' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = en(<FunnelChart title="Checkout" description="October" data={data} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
