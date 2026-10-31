import { LocaleProvider } from '../../i18n/LocaleProvider';
import { XpProgress } from './XpProgress';

export function Basic() {
  return (
    <LocaleProvider locale="en-US">
      <XpProgress label="XP to next level" currentXp={740} targetXp={1000} level={12} description="260 XP remaining" />
    </LocaleProvider>
  );
}

export function NearlyComplete() {
  return (
    <LocaleProvider locale="en-US">
      <XpProgress label="XP to next level" currentXp={1000} targetXp={1000} level={13} description="Next: Community expert" />
    </LocaleProvider>
  );
}
