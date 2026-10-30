import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './RelativeTime.module.css';

export type RelativeTimeInput = Date | string | number;

export interface RelativeTimeProps extends Omit<HTMLAttributes<HTMLTimeElement>, 'children'> {
  /** The instant to describe: a Date, an ISO 8601 string with offset, or epoch milliseconds. */
  date: RelativeTimeInput;
  /** Reference instant. When set the output is deterministic and never auto-updates (tests, SSR, lists). */
  now?: RelativeTimeInput;
  /** Refresh interval in ms while `now` is not set. `0` disables refreshing. @default 60000 */
  updateInterval?: number;
  /** `auto` → "yesterday", `always` → "1 day ago". @default 'auto' */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** @default 'long' */
  formatStyle?: Intl.RelativeTimeFormatStyle;
  /** Format of the absolute date in `title`. @default { dateStyle: 'long', timeStyle: 'short' } */
  absoluteFormat?: Intl.DateTimeFormatOptions;
}

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
];

function toMs(input: RelativeTimeInput): number {
  return input instanceof Date ? input.getTime() : typeof input === 'number' ? input : Date.parse(input);
}

/** Picks the largest unit whose rounded value is at least 1 (e.g. 90 minutes → "2 hours"). */
export function selectRelativeUnit(diffMs: number): { value: number; unit: Intl.RelativeTimeFormatUnit } {
  const seconds = diffMs / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size || unit === 'second') {
      // Round half away from zero so that past and future values are symmetric (-1.5 h → -2 h).
      const value = Math.sign(seconds) * Math.round(Math.abs(seconds) / size);
      return { value: value === 0 ? 0 : value, unit };
    }
  }
  return { value: 0, unit: 'second' };
}

/**
 * Relative time ("3 minutes ago", "tomorrow") in a semantic `<time datetime>` element, formatted with
 * `Intl.RelativeTimeFormat` for the current locale. The absolute date is in `title`, which is not available to
 * every user: show it as visible text when the exact time matters.
 */
export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  {
    date,
    now,
    updateInterval = 60_000,
    numeric = 'auto',
    formatStyle = 'long',
    absoluteFormat = { dateStyle: 'long', timeStyle: 'short' },
    className,
    title,
    ...rest
  },
  ref,
) {
  const { locale } = useLocale();
  const [tick, setTick] = useState(() => Date.now());
  const isLive = now === undefined && updateInterval > 0;

  useEffect(() => {
    if (!isLive) return undefined;
    setTick(Date.now());
    const id = window.setInterval(() => setTick(Date.now()), updateInterval);
    return () => window.clearInterval(id);
  }, [isLive, updateInterval]);

  const target = toMs(date);
  if (Number.isNaN(target)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`@dev-community/ui: RelativeTime received an invalid date (${String(date)}).`);
    }
    return null;
  }
  const reference = now === undefined ? tick : toMs(now);
  const { value, unit } = selectRelativeUnit(target - reference);
  const relative = new Intl.RelativeTimeFormat(locale, { numeric, style: formatStyle }).format(value, unit);
  const absolute = new Intl.DateTimeFormat(locale, absoluteFormat).format(target);

  return (
    <time
      ref={ref}
      dateTime={new Date(target).toISOString()}
      title={title ?? absolute}
      className={cx(styles.relativeTime, className)}
      // Server and client clocks differ when `now` is not provided.
      suppressHydrationWarning={now === undefined}
      {...rest}
    >
      {relative}
    </time>
  );
});
