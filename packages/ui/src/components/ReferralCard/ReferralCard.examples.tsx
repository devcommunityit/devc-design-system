import { ReferralCard } from './ReferralCard';

export function Basic() {
  return (
    <ReferralCard
      title="Invite a friend"
      description="Share your invitation with someone who would enjoy the community."
      referralCode="COMMUNITY-24"
      referralUrl="https://example.com/join?ref=COMMUNITY-24"
      copyLabel="Copy referral link"
      onCopyRequest={() => {}}
    />
  );
}
