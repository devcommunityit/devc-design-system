import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { Flame } from 'lucide-react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './StreakCounter.module.css';

export interface StreakCounterProps extends HTMLAttributes<HTMLElement> {
  /** Current consecutive-day count. */
  days: number;
  /** Accessible title for the current streak. @default 'Current streak' */
  label?: ReactNode;
  /** Singular and plural labels, overridable for localization. @default 'day' / 'days' */
  dayLabel?: string;
  daysLabel?: string;
  /** Optional personal best displayed below the current count. */
  longestStreak?: number;
  /** Localizable label for the personal best. @default 'Longest streak' */
  longestLabel?: ReactNode;
  /** Heading element level. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Presentational consecutive-day counter; it does not track or persist streaks. */
export const StreakCounter = forwardRef<HTMLElement, StreakCounterProps>(function StreakCounter(
  {
    days,
    label = 'Current streak',
    dayLabel = 'day',
    daysLabel = 'days',
    longestStreak,
    longestLabel = 'Longest streak',
    headingLevel = 3,
    className,
    ...rest
  },
  ref,
) {
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const current = Number.isFinite(days) ? Math.max(0, days) : 0;
  const best = Number.isFinite(longestStreak) ? Math.max(0, longestStreak ?? 0) : 0;
  const Heading = `h${headingLevel}` as const;

  return (
    <section ref={ref} className={cx(styles.counter, className)} {...rest}>
      <div className={styles.top}>
        <Heading className={styles.label}>{label}</Heading>
        <Flame className={styles.icon} aria-hidden="true" focusable="false" />
      </div>
      <p className={styles.value}>
        <span className={styles.number}>{formatter.format(current)}</span>
        <span className={styles.unit}>{current === 1 ? dayLabel : daysLabel}</span>
      </p>
      {longestStreak !== undefined ? (
        <p className={styles.best}>
          <span>{longestLabel}</span>
          <span className={styles.bestValue}>{formatter.format(best)} {best === 1 ? dayLabel : daysLabel}</span>
        </p>
      ) : null}
    </section>
  );
});
