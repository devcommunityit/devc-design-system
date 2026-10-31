import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { MembershipCard } from './MembershipCard';

describe('MembershipCard', () => {
  it('shows the membership and offers its controlled action', async () => {
    const onAction = () => undefined;
    const { container } = render(<MembershipCard title="Community Pro" plan="Annual" status="active" statusLabel="Active" actionLabel="Manage" onAction={onAction} />);
    expect(screen.getByRole('region', { name: 'Community Pro' })).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
