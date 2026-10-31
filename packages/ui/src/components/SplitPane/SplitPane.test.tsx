import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { SplitPane } from './SplitPane';

describe('SplitPane', () => {
  it('resizes using separator keys and enforces limits', async () => {
    const user = userEvent.setup();
    const onPrimarySizeChange = vi.fn();
    render(<SplitPane primary="Editor" secondary="Preview" defaultPrimarySize={50} minPrimarySize={30} maxPrimarySize={60} onPrimarySizeChange={onPrimarySizeChange} />);
    const separator = screen.getByRole('separator', { name: 'Resize panels' });
    await user.click(separator);
    await user.keyboard('{ArrowRight}');
    expect(onPrimarySizeChange).toHaveBeenCalledWith(55);
    await user.keyboard('{End}');
    expect(onPrimarySizeChange).toHaveBeenLastCalledWith(60);
    expect(separator).toHaveAttribute('aria-valuenow', '60');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SplitPane primaryLabel="Editor" secondaryLabel="Preview" primary="Code" secondary="Output" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('moves the separator in the direction of the arrow in RTL', async () => {
    const user = userEvent.setup();
    render(<SplitPane style={{ direction: 'rtl' }} primary="Editor" secondary="Preview" />);
    const separator = screen.getByRole('separator', { name: 'Resize panels' });
    separator.focus();
    await user.keyboard('{ArrowLeft}');
    expect(separator).toHaveAttribute('aria-valuenow', '55');
    await user.keyboard('{ArrowRight}');
    expect(separator).toHaveAttribute('aria-valuenow', '50');
  });
});
