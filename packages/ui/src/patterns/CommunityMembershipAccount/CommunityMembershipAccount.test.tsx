import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { CommunityMembershipAccount } from './CommunityMembershipAccount';
import type { CommunityMembershipAccountProps } from './CommunityMembershipAccount';

const props: CommunityMembershipAccountProps = {
  member: {
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    membershipNumber: 'DC-2048-119',
    tier: 'Community Plus',
    memberSince: '2022-04-15',
  },
  plans: {
    monthly: { amount: '€12.00', intervalLabel: 'per month' },
    annual: { amount: '€120.00', intervalLabel: 'per year', savingsLabel: 'Save €24' },
  },
  billingCadence: 'monthly',
  onBillingCadenceChange: vi.fn(),
  orderSummary: {
    subtotal: '€12.00',
    total: '€12.00',
    coupon: { code: 'WELCOME', status: 'expired', message: 'This coupon has expired.' },
  },
  paymentMethods: [{ id: 'visa', label: 'Visa', brand: 'Visa', lastFour: '4242', expires: '08/2027', isDefault: true }],
  selectedPaymentMethodId: 'visa',
  onPaymentMethodChange: vi.fn(),
  subscription: { status: 'active', nextBillingDate: '2027-01-15', usage: { label: 'Event passes', used: 2, limit: 5 } },
  invoices: [{ id: 'INV-1', issuedAt: '2026-01-15', total: '€12.00', status: 'paid' }],
  communicationPreferences: [{ id: 'newsletter', label: 'Community newsletter', isSelected: true }],
  onCommunicationPreferenceChange: vi.fn(),
  cookiePreferences: [{ id: 'essential', label: 'Essential cookies', isEnabled: true, isRequired: true }],
  onRequestDataExport: vi.fn(),
  onRequestDeletion: vi.fn(),
};

function renderAccount(overrides: Partial<CommunityMembershipAccountProps> = {}) {
  return render(
    <ThemeProvider>
      <CommunityMembershipAccount {...props} {...overrides} />
    </ThemeProvider>,
  );
}

describe('CommunityMembershipAccount', () => {
  it('renders account, billing, usage, history and preference summaries accessibly', async () => {
    const { baseElement } = renderAccount();
    expect(screen.getByRole('article', { name: 'Digital membership card' })).toHaveTextContent('DC-2048-119');
    expect(screen.getByRole('radio', { name: /Monthly/ })).toBeChecked();
    expect(screen.getByRole('progressbar', { name: 'Event passes' })).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByRole('table', { name: 'Membership invoices and billing status' })).toHaveTextContent('INV-1');
    expect(screen.getByText('Expired')).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('forwards controlled selection and privacy request callbacks without claiming completion', async () => {
    const user = userEvent.setup();
    const onBillingCadenceChange = vi.fn();
    const onPaymentMethodChange = vi.fn();
    const onCommunicationPreferenceChange = vi.fn();
    const onRequestDataExport = vi.fn();
    const onRequestDeletion = vi.fn();
    const onCouponApply = vi.fn();
    renderAccount({
      onBillingCadenceChange,
      onPaymentMethodChange,
      onCommunicationPreferenceChange,
      onRequestDataExport,
      onRequestDeletion,
      couponInput: {
        value: 'WELCOME',
        onChange: vi.fn(),
        onApply: onCouponApply,
      },
      selectedPaymentMethodId: undefined,
    });

    await user.click(screen.getByRole('radio', { name: /Annual/ }));
    await user.click(screen.getByRole('radio', { name: /Visa/ }));
    await user.click(screen.getByRole('switch', { name: 'Community newsletter' }));
    await user.click(screen.getByRole('button', { name: 'Request data export' }));
    await user.click(screen.getByRole('button', { name: 'Request account deletion' }));
    await user.click(screen.getByRole('button', { name: 'Apply coupon' }));

    expect(onBillingCadenceChange).toHaveBeenCalledWith('annual');
    expect(onPaymentMethodChange).toHaveBeenCalledWith('visa');
    expect(onCommunicationPreferenceChange).toHaveBeenCalledWith('newsletter', false);
    expect(onRequestDataExport).toHaveBeenCalledOnce();
    expect(onRequestDeletion).toHaveBeenCalledOnce();
    expect(onCouponApply).toHaveBeenCalledOnce();
    expect(screen.getByText(/does not submit or confirm a request/i)).toBeInTheDocument();
  });

  it('shows an empty history message and allows omitting privacy actions', () => {
    renderAccount({ invoices: [], onRequestDataExport: undefined, onRequestDeletion: undefined });
    expect(screen.getByText('No billing history yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Your data' })).toBeNull();
  });
});
