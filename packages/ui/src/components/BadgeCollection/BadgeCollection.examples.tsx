import { Award, Code, Mic } from 'lucide-react';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { BadgeCollection } from './BadgeCollection';

export function Basic() {
  return (
    <LocaleProvider locale="en-US">
      <BadgeCollection
        label="Community achievements"
        items={[
          { id: 'speaker', title: 'First talk', icon: <Mic />, tier: 'gold', earnedAt: '2026-03-12' },
          { id: 'author', title: 'Contributor', icon: <Code />, tier: 'silver', description: 'Shared a first project.' },
          { id: 'mentor', title: 'Mentor', icon: <Award />, tier: 'brand', tierLabel: 'Community' },
        ]}
      />
    </LocaleProvider>
  );
}
