import { BillingHistory } from './index';

export function Basic() {
  return <BillingHistory title="Billing history" records={[{ id: 'inv-1', description: 'Community Pro', date: '12 Oct 2026', amount: '€80.00', status: 'Paid' }]} downloadLabel="Download" onDownload={() => undefined} />;
}
