import { MembershipCard } from './index';

export function Basic() {
  return <MembershipCard title="Community Pro" plan="Annual membership" status="active" statusLabel="Active" renewal="Renews on 12 December 2026" actionLabel="Manage membership" onAction={() => undefined} />;
}
