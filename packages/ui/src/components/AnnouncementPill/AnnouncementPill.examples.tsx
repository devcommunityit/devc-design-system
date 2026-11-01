import { AnnouncementPill } from '@devcommunityit/ui';

export function Basic() {
  return <AnnouncementPill href="#call-for-speaker">Call for Speaker 2027 aperta · scade il 15 dicembre</AnnouncementPill>;
}

export function Inverse() {
  return (
    <div
      style={{
        padding: 'var(--dc-space-8)',
        borderRadius: 'var(--dc-radius-xl)',
        backgroundColor: 'var(--dc-color-surface-inverse)',
        color: 'var(--dc-color-text-inverse)',
      }}
    >
      <AnnouncementPill tone="inverse" href="#call-for-speaker">
        Call for Speaker 2027 aperta · scade il 15 dicembre
      </AnnouncementPill>
    </div>
  );
}

export function Static() {
  return <AnnouncementPill badge="Beta">Il nuovo forum della community è in anteprima</AnnouncementPill>;
}
