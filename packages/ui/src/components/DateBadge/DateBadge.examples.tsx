import { DateBadge, Inline } from '@dev-community/ui';

export function Basic() {
  return <DateBadge date="2026-11-12" variant="gradient" />;
}

export function Variants() {
  return (
    <Inline gap={4} align="center">
      <div style={{ padding: 'var(--dc-space-4)', borderRadius: 'var(--dc-radius-lg)', backgroundImage: 'var(--dc-gradient-accent)', backgroundColor: 'var(--dc-color-action-primary)' }}>
        <DateBadge date="2026-11-12" variant="solid" />
      </div>
      <DateBadge date="2026-11-27" variant="gradient" />
    </Inline>
  );
}

export function Sizes() {
  return (
    <Inline gap={4} align="center">
      <DateBadge date={{ year: 2026, month: 12, day: 3 }} variant="gradient" size="sm" />
      <DateBadge date={{ year: 2026, month: 12, day: 3 }} variant="gradient" showWeekday />
      <DateBadge date={new Date(2027, 0, 15)} variant="gradient" size="sm" showWeekday />
    </Inline>
  );
}
