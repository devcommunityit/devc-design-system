import { forwardRef, useMemo, type HTMLAttributes } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './DateBadge.module.css';

/** A calendar day: a `Date`, an ISO string (`'2026-11-12'`) or any `{ year, month, day }` object such as `CalendarDate`. */
export type DateBadgeValue = Date | string | { year: number; month: number; day: number };

export type DateBadgeVariant = 'solid' | 'gradient';

export interface DateBadgeProps extends Omit<HTMLAttributes<HTMLTimeElement>, 'children'> {
  /** Day to show. `month` in object form is 1-based (like `CalendarDate`). */
  date: DateBadgeValue;
  /** `solid`: light box for gradient covers; `gradient`: brand gradient box. @default 'solid' */
  variant?: DateBadgeVariant;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Show the short weekday above the day number. @default false */
  showWeekday?: boolean;
  /** IANA time zone used to read the calendar day from a `Date` (default: the user's time zone). */
  timeZone?: string;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const pad = (n: number, width = 2) => String(n).padStart(width, '0');

function isoFromDate(date: Date, timeZone?: string): string | null {
  if (Number.isNaN(date.getTime())) return null;
  if (!timeZone) return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  return `${pad(get('year'), 4)}-${pad(get('month'))}-${pad(get('day'))}`;
}

/** Normalizes the supported inputs to an ISO calendar day (`YYYY-MM-DD`); `null` when not a valid date. */
function toIsoDay(value: DateBadgeValue, timeZone?: string): string | null {
  if (value instanceof Date) return isoFromDate(value, timeZone);
  if (typeof value === 'string') return ISO_DATE.test(value) ? value : isoFromDate(new Date(value), timeZone);
  const { year, month, day } = value;
  return [year, month, day].every(Number.isFinite) ? `${pad(year, 4)}-${pad(month)}-${pad(day)}` : null;
}

/**
 * Compact calendar date (big day number, short month, optional weekday) for event covers and lists.
 * Renders a `<time dateTime>`; the full localized date is available to assistive technology.
 */
export const DateBadge = forwardRef<HTMLTimeElement, DateBadgeProps>(function DateBadge(
  { date, variant = 'solid', size = 'md', showWeekday = false, timeZone, className, ...rest },
  ref,
) {
  const { locale } = useLocale();
  const iso = toIsoDay(date, timeZone);
  const labels = useMemo(() => {
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number) as [number, number, number];
    // Format a UTC noon instant in UTC so the calendar day never shifts with the viewer's time zone.
    const instant = new Date(Date.UTC(year, month - 1, day, 12));
    const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(instant);
    return {
      day: fmt({ day: 'numeric' }),
      month: fmt({ month: 'short' }),
      weekday: fmt({ weekday: 'short' }),
      full: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    };
  }, [locale, iso]);

  if (!iso || !labels) return null;
  return (
    <time ref={ref} dateTime={iso} data-variant={variant} data-size={size} className={cx(styles.dateBadge, className)} {...rest}>
      <span className={styles.visual} aria-hidden="true">
        {showWeekday ? <span className={styles.weekday}>{labels.weekday}</span> : null}
        <span className={styles.day}>{labels.day}</span>
        <span className={styles.month}>{labels.month}</span>
      </span>
      <span className={styles.srOnly}>{labels.full}</span>
    </time>
  );
});
