import { PlanSwitcher } from './index';

export function Basic() {
  return <PlanSwitcher label="Billing period" options={[{ id: 'monthly', label: 'Monthly' }, { id: 'annual', label: 'Annual', description: 'Save 15%' }]} value="annual" onChange={() => undefined} />;
}
