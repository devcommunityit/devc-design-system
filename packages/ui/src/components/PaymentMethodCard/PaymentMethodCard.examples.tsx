import { PaymentMethodCard } from './index';

export function Basic() {
  return <PaymentMethodCard brand="Visa" lastFour="4242" expiry="Expires 08/2028" selected selectedLabel="Default method" />;
}
