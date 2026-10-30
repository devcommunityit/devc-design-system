import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ChartLegend } from './ChartLegend';

const items = [
  { id: 'a', label: 'Alpha', colorIndex: 0 },
  { id: 'b', label: 'Beta', colorIndex: 1, value: '42%' },
];

describe('ChartLegend', () => {
  it('renders a static list with decorative keys and forwards ref and DOM props', () => {
    const ref = createRef<HTMLUListElement>();
    render(<ChartLegend ref={ref} items={items} data-testid="legend" />);
    const list = screen.getByRole('list');
    expect(ref.current).toBe(list);
    expect(list).toHaveAttribute('data-testid', 'legend');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(list.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
  });

  it('toggles items with aria-pressed buttons (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onHiddenItemsChange = vi.fn();
    render(<ChartLegend items={items} isToggleable onHiddenItemsChange={onHiddenItemsChange} />);
    const alpha = screen.getByRole('button', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-pressed', 'true');
    await user.click(alpha);
    expect(alpha).toHaveAttribute('aria-pressed', 'false');
    expect(onHiddenItemsChange).toHaveBeenLastCalledWith(['a']);
    alpha.focus();
    await user.keyboard('{Enter}');
    expect(alpha).toHaveAttribute('aria-pressed', 'true');
    expect(onHiddenItemsChange).toHaveBeenLastCalledWith([]);
  });

  it('respects controlled hiddenItems', async () => {
    const user = userEvent.setup();
    const onHiddenItemsChange = vi.fn();
    render(<ChartLegend items={items} isToggleable hiddenItems={['b']} onHiddenItemsChange={onHiddenItemsChange} />);
    const beta = screen.getByRole('button', { name: /Beta/ });
    expect(beta).toHaveAttribute('aria-pressed', 'false');
    await user.click(beta);
    expect(onHiddenItemsChange).toHaveBeenCalledWith([]);
    expect(beta).toHaveAttribute('aria-pressed', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(<ChartLegend items={items} isToggleable defaultHiddenItems={['a']} swatch="fill" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
