import { Award, BookOpen, Code, Flame, Heart, Mic, Star, Users } from 'lucide-react';
import { AchievementBadge, AchievementBadgeGroup, Stack } from '@devcommunityit/ui';

export function Basic() {
  return (
    <AchievementBadge
      icon={<Mic />}
      title="Primo talk"
      tier="gold"
      description="Hai tenuto il tuo primo talk a un meetup della community."
      earnedAt={new Date(2026, 2, 12)}
    />
  );
}

/** All tiers in a responsive grid list, including the brand tier with a custom name. */
export function Tiers() {
  return (
    <AchievementBadgeGroup aria-label="Badge ottenuti">
      <AchievementBadge icon={<Heart />} title="Prima risposta" tier="bronze" earnedAt={new Date(2025, 10, 3)} />
      <AchievementBadge icon={<BookOpen />} title="Autore" tier="silver" earnedAt={new Date(2026, 0, 21)} />
      <AchievementBadge icon={<Mic />} title="Primo talk" tier="gold" earnedAt={new Date(2026, 2, 12)} />
      <AchievementBadge icon={<Star />} title="Top contributor" tier="platinum" earnedAt={new Date(2026, 8, 30)} />
      <AchievementBadge icon={<Users />} title="Co-organizzatore" tier="brand" tierLabel="Staff" shape="circle" />
    </AchievementBadgeGroup>
  );
}

/** Locked achievements with progress towards the goal. */
export function Locked() {
  return (
    <AchievementBadgeGroup aria-label="Badge da sbloccare" minItemWidth="12rem">
      <AchievementBadge icon={<Code />} title="10 pull request" tier="silver" isLocked progress={{ value: 6, max: 10 }} />
      <AchievementBadge icon={<Flame />} title="Streak di 30 giorni" tier="gold" isLocked progress={{ value: 12, max: 30 }} />
      <AchievementBadge icon={<Award />} title="Mentor dell’anno" tier="platinum" isLocked description="Assegnato dalla community a dicembre." />
    </AchievementBadgeGroup>
  );
}

/** Sizes and the inline layout for profile sidebars. */
export function SizesAndLayout() {
  return (
    <Stack gap={4}>
      <AchievementBadge icon={<Mic />} title="Primo talk" tier="gold" layout="inline" size="sm" earnedAt={new Date(2026, 2, 12)} />
      <AchievementBadge
        icon={<Star />}
        title="Top contributor"
        tier="platinum"
        layout="inline"
        description="Tra i 10 membri più attivi del trimestre."
        earnedAt={new Date(2026, 8, 30)}
      />
      <AchievementBadge icon={<Users />} title="Fondatore" tier="brand" tierLabel="Founder" size="lg" headingLevel={3} />
    </Stack>
  );
}
