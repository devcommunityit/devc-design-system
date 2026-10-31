import { useState } from 'react';
import { CommunityMembershipAccount } from './CommunityMembershipAccount';
import type {
  MembershipCommunicationPreference,
  MembershipPaymentMethod,
} from './CommunityMembershipAccount';

const plans = {
  monthly: { amount: '€12.00', intervalLabel: 'per month' },
  annual: { amount: '€120.00', intervalLabel: 'per year', savingsLabel: 'Save €24' },
};

const initialPaymentMethods: MembershipPaymentMethod[] = [
  { id: 'card-1', label: 'Visa', brand: 'Visa', lastFour: '4242', expires: '08/2027', isDefault: true },
  { id: 'card-2', label: 'Mastercard', brand: 'Mastercard', lastFour: '1088', expires: '11/2026' },
];

const initialPreferences: MembershipCommunicationPreference[] = [
  { id: 'newsletter', label: 'Community newsletter', description: 'Product news and community highlights.', isSelected: true },
  { id: 'events', label: 'Event announcements', description: 'Invitations and event reminders.', isSelected: false },
];

export function ControlledMembership() {
  const [billingCadence, setBillingCadence] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethodId, setPaymentMethodId] = useState('card-1');
  const [couponCode, setCouponCode] = useState('COMMUNITY10');
  const [preferences, setPreferences] = useState(initialPreferences);

  return (
    <CommunityMembershipAccount
      member={{
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        membershipNumber: 'DC-2048-119',
        tier: 'Community Plus',
        memberSince: '2022-04-15',
        expiresAt: '2026-04-15',
      }}
      plans={plans}
      billingCadence={billingCadence}
      onBillingCadenceChange={setBillingCadence}
      orderSummary={{
        subtotal: '€120.00',
        discount: { label: 'Member discount', amount: '−€12.00' },
        total: '€108.00',
        coupon: { code: 'COMMUNITY10', status: 'applied', message: '10% discount applied to this plan.' },
      }}
      couponInput={{
        value: couponCode,
        onChange: setCouponCode,
        onApply: () => console.info('Coupon validation requested'),
      }}
      paymentMethods={initialPaymentMethods}
      selectedPaymentMethodId={paymentMethodId}
      onPaymentMethodChange={setPaymentMethodId}
      subscription={{ status: 'active', nextBillingDate: '2027-04-15', usage: { label: 'Event passes', used: 3, limit: 5, unit: 'passes' } }}
      invoices={[
        { id: 'INV-2026-0142', issuedAt: '2026-04-15', total: '€108.00', status: 'paid', href: '#invoice-142' },
        { id: 'INV-2025-0091', issuedAt: '2025-04-15', total: '€108.00', status: 'paid' },
      ]}
      communicationPreferences={preferences}
      onCommunicationPreferenceChange={(id, isSelected) =>
        setPreferences((current) => current.map((preference) => preference.id === id ? { ...preference, isSelected } : preference))
      }
      cookiePreferences={[
        { id: 'essential', label: 'Essential cookies', isEnabled: true, isRequired: true, description: 'Needed for core site functionality.' },
        { id: 'analytics', label: 'Analytics cookies', isEnabled: false },
      ]}
      onRequestDataExport={() => undefined}
      onRequestDeletion={() => undefined}
    />
  );
}
