import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { BulkActionBar } from './BulkActionBar';

describe('BulkActionBar', () => {
  it('is hidden without selected items and announces changing counts', () => {
    const { rerender } = render(<BulkActionBar count={0}>Action</BulkActionBar>);
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    rerender(<BulkActionBar count={2}>Action</BulkActionBar>);
    expect(screen.getByRole('status')).toHaveTextContent('2 selected');
    rerender(<BulkActionBar count={3}>Action</BulkActionBar>);
    expect(screen.getByRole('status')).toHaveTextContent('3 selected');
  });

  it('forwards ref and sticky state, invokes clear and keeps actions consumer-owned', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onAction = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<BulkActionBar ref={ref} count={1} onClear={onClear} sticky><button onClick={onAction}>Archive</button></BulkActionBar>);
    expect(ref.current).toHaveAttribute('data-sticky');
    await user.click(screen.getByRole('button', { name: 'Archive' }));
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('has no axe violations', async () => {
    const { container } = render(<BulkActionBar count={2} onClear={vi.fn()}><button>Archive</button></BulkActionBar>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
