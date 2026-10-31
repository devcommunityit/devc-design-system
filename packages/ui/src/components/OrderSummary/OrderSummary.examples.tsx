import { OrderSummary } from './index';

export function Basic() {
  return <OrderSummary title="Order summary" items={[{ id: 'membership', label: 'Annual membership', amount: 80 }]} subtotal={80} discount={10} tax={7} total={77} currency="EUR" locale="en-IE" />;
}
