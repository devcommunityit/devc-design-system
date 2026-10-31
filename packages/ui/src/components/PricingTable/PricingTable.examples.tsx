import { PricingTable, type PricingFeature, type PricingPlan } from './index';

const plans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', price: 'Free', billingPeriod: 'forever' },
  { id: 'team', name: 'Team', price: '€18', billingPeriod: 'per member / month', description: 'For growing teams' },
];

const features: PricingFeature[] = [
  { id: 'projects', label: 'Projects', values: { starter: '2', team: 'Unlimited' } },
  { id: 'history', label: 'Version history', values: { starter: '7 days', team: '1 year' } },
  { id: 'support', label: 'Priority support', values: { starter: false, team: true } },
];

export function Basic() {
  return (
    <PricingTable
      caption="Choose the plan that fits your team"
      plans={plans}
      features={features}
      selectedPlanId="team"
      onSelectPlan={() => undefined}
      selectLabel="Select plan"
      featureColumnLabel="What’s included"
    />
  );
}
