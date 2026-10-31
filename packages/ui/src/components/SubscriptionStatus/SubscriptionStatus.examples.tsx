import { SubscriptionStatus } from './index';

export function Basic() {
  return <SubscriptionStatus title="Community Pro" status="active" statusLabel="Active" detail="Renews on 12 December 2026" primaryActionLabel="Manage plan" onPrimaryAction={() => undefined} />;
}
