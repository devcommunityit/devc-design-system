import { LocaleProvider } from '../../i18n/LocaleProvider';
import { StreakCounter } from './StreakCounter';

export function Basic() {
  return (
    <LocaleProvider locale="en-US">
      <StreakCounter days={7} longestStreak={21} />
    </LocaleProvider>
  );
}

export function SingularAndZero() {
  return (
    <LocaleProvider locale="en-US">
      <>
        <StreakCounter days={1} label="Today's streak" />
        <StreakCounter days={0} label="Current streak" />
      </>
    </LocaleProvider>
  );
}
