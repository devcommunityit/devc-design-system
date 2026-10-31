import { CouponInput } from './index';

export function Basic() {
  return <CouponInput label="Discount code" value="" onChange={() => undefined} onApply={() => undefined} status="idle" applyLabel="Apply" />;
}
