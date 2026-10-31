import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ReferralCard } from './ReferralCard';

describe('ReferralCard', () => {
  it('shows the referral details and delegates copy requests', async () => {
    const onCopyRequest = vi.fn();
    const { container } = render(<ReferralCard title="Invite a friend" referralCode="JOIN" referralUrl="https://example.com/join" copyLabel="Copy link" onCopyRequest={onCopyRequest} />);
    expect(screen.getByText('JOIN')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://example.com/join' })).toHaveAttribute('href', 'https://example.com/join');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Copy link' }));
    expect(onCopyRequest).toHaveBeenCalledOnce();
    expect(await axe(container)).toHaveNoViolations();
  });
});
