import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ResponseFeedback } from './ResponseFeedback';

describe('ResponseFeedback', () => {
  it('selects, switches and clears a single feedback value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ResponseFeedback onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Helpful' }));
    expect(screen.getByRole('button', { name: 'Helpful' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(screen.getByRole('button', { name: 'Helpful' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['helpful', 'unhelpful', null]);
  });

  it('honors controlled and disabled states', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<ResponseFeedback value="helpful" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Not helpful' }));
    expect(onChange).toHaveBeenCalledWith('unhelpful');
    expect(screen.getByRole('button', { name: 'Helpful' })).toHaveAttribute('aria-pressed', 'true');
    rerender(<ResponseFeedback value="helpful" onChange={onChange} isDisabled />);
    expect(screen.getByRole('button', { name: 'Not helpful' })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ResponseFeedback />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
