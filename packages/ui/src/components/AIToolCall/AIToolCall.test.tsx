import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { AIToolCall } from './AIToolCall';

describe('AIToolCall', () => {
  it('shows tool status and approval actions', async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(<AIToolCall title="Run deployment" status="approval" onApprove={onApprove} onReject={onReject} />);
    expect(screen.getByRole('article', { name: 'Run deployment: Approval required' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onReject).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AIToolCall title="Search" status="running" description="Searching sources" details={<code>query</code>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
