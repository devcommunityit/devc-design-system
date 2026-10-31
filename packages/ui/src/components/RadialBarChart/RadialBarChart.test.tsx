import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RadialBarChart } from './RadialBarChart';

const data = [
  { id: 'sales', label: 'Sales', value: 80 },
  { id: 'leads', label: 'Leads', value: 30, max: 60 },
  { id: 'churn', label: 'Retention', value: 0 },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('RadialBarChart', () => {
  it('renders one track per item, arcs for non-zero values and a legend', () => {
    const ref = createRef<HTMLElement>();
    const { container } = en(<RadialBarChart ref={ref} title="Goals" data={data} data-testid="radial" />);
    expect(ref.current).toBe(screen.getByTestId('radial'));
    expect(container.querySelectorAll('svg path[class*="track"]')).toHaveLength(3);
    expect(container.querySelectorAll('svg path[class*="bar"]')).toHaveLength(2);
    const legend = screen.getByRole('list');
    expect(within(legend).getByText('80 / 100 (80%)')).toBeInTheDocument();
    expect(within(legend).getByText('30 / 60 (50%)')).toBeInTheDocument();
  });

  it('moves across rings with arrow keys and announces them', async () => {
    const user = userEvent.setup();
    const { container } = en(<RadialBarChart title="Goals" data={data} />);
    const live = container.querySelector('[aria-live="polite"]');
    await user.tab();
    expect(screen.getByRole('group', { name: 'Goals' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('Sales: 80 / 100 (80%)');
    await user.keyboard('{ArrowDown}');
    expect(live).toHaveTextContent('Leads: 30 / 60 (50%)');
    await user.keyboard('{End}');
    expect(live).toHaveTextContent('Retention: 0 / 100 (0%)');
    expect(container.querySelector('g[data-active]')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(container.querySelector('g[data-active]')).not.toBeInTheDocument();
  });

  it('toggles a data table with value, target and percent', async () => {
    const user = userEvent.setup();
    en(<RadialBarChart title="Goals" data={data} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    const table = screen.getByRole('table', { name: 'Goals' });
    expect(within(table).getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Target' })).toBeInTheDocument();
    const row = within(table).getByRole('rowheader', { name: 'Leads' }).closest('tr');
    expect(row).toHaveTextContent('306050%');
  });

  it('sets the appearance attribute and hides the legend on request', () => {
    en(<RadialBarChart title="Goals" data={data} appearance="vivid" showLegend={false} data-testid="radial" />);
    expect(screen.getByTestId('radial')).toHaveAttribute('data-chart-appearance', 'vivid');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = en(<RadialBarChart title="Goals" description="Q4" data={data} />);
    await user.click(screen.getByRole('button', { name: 'Show data table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
