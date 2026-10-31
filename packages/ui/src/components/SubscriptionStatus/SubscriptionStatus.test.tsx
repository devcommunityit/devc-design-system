import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { SubscriptionStatus } from './SubscriptionStatus';

describe('SubscriptionStatus', () => {
  it('shows the externally supplied state and actions', async () => {
    const { container } = render(<SubscriptionStatus title="Community Pro" status="past-due" statusLabel="Payment due" primaryActionLabel="Update billing" onPrimaryAction={() => undefined} />);
    expect(screen.getByText('Payment due')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update billing' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
