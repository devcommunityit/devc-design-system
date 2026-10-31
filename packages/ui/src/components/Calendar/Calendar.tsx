import { DateFormatter, today } from '@internationalized/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContext, useId, useMemo, type ReactNode } from 'react';
import {
  Button,
  Calendar as RACCalendar,
  CalendarCell,
  CalendarStateContext,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar as RACRangeCalendar,
  RangeCalendarStateContext,
  Text,
  composeRenderProps,
  type CalendarProps as RACCalendarProps,
  type DateValue,
  type RangeCalendarProps as RACRangeCalendarProps,
} from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Calendar.module.css';

interface CalendarExtraProps {
  /** Number of months shown side by side (stacked on narrow containers). @default 1 */
  visibleMonths?: number;
  /** Shown when the calendar is invalid (e.g. a selected date is unavailable). */
  errorMessage?: ReactNode;
  /**
   * Replace the month heading with month and year selects, to jump quickly to distant dates
   * (birth dates, archives). The year range follows `minValue`/`maxValue`, else today ±100/50 years.
   * @default false
   */
  showMonthYearPicker?: boolean;
}

/** Month and year selects bound to the focused date of the surrounding (Range)Calendar. */
function MonthYearPicker({ isRange }: { isRange: boolean }) {
  const t = useMessages();
  const { locale } = useLocale();
  const id = useId();
  const single = useContext(CalendarStateContext);
  const range = useContext(RangeCalendarStateContext);
  const state = isRange ? range : single;
  const focused = state?.focusedDate;
  const timeZone = state?.timeZone ?? 'UTC';
  const months = useMemo(() => {
    if (!focused) return [];
    const fmt = new DateFormatter(locale, { month: 'long', timeZone });
    const count = focused.calendar.getMonthsInYear(focused);
    return Array.from({ length: count }, (_, i) => fmt.format(focused.set({ month: i + 1, day: 1 }).toDate(timeZone)));
  }, [focused, locale, timeZone]);
  const years = useMemo(() => {
    if (!focused || !state) return [];
    const current = today(timeZone).year;
    const first = state.minValue?.year ?? Math.min(focused.year, current - 100);
    const last = state.maxValue?.year ?? Math.max(focused.year, current + 50);
    const fmt = new DateFormatter(locale, { year: 'numeric', timeZone });
    return Array.from({ length: last - first + 1 }, (_, i) => {
      const year = first + i;
      return { year, label: fmt.format(focused.set({ year, month: 1, day: 1 }).toDate(timeZone)) };
    });
  }, [focused, state, locale, timeZone]);
  if (!state || !focused) return null;
  const { minValue, maxValue } = state;
  const monthOutOfRange = (month: number) =>
    (minValue != null && (focused.year < minValue.year || (focused.year === minValue.year && month < minValue.month))) ||
    (maxValue != null && (focused.year > maxValue.year || (focused.year === maxValue.year && month > maxValue.month)));
  return (
    <div className={styles.monthYear}>
      <label htmlFor={`${id}-m`} className={styles.srOnly}>
        {t.calendarMonth}
      </label>
      <select
        id={`${id}-m`}
        className={styles.select}
        value={focused.month}
        disabled={state.isDisabled}
        onChange={(e) => state.setFocusedDate(focused.set({ month: Number(e.target.value) }))}
      >
        {months.map((name, i) => (
          <option key={name} value={i + 1} disabled={monthOutOfRange(i + 1)}>
            {name}
          </option>
        ))}
      </select>
      <label htmlFor={`${id}-y`} className={styles.srOnly}>
        {t.calendarYear}
      </label>
      <select
        id={`${id}-y`}
        className={styles.select}
        value={focused.year}
        disabled={state.isDisabled}
        onChange={(e) => state.setFocusedDate(focused.set({ year: Number(e.target.value) }))}
      >
        {years.map(({ year, label }) => (
          <option key={year} value={year}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CalendarBody({
  visibleMonths,
  errorMessage,
  isRange,
  showMonthYearPicker,
}: {
  visibleMonths: number;
  errorMessage?: ReactNode;
  isRange: boolean;
  showMonthYearPicker?: boolean;
}) {
  const t = useMessages();
  const { direction } = useLocale();
  const Prev = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const Next = direction === 'rtl' ? ChevronLeft : ChevronRight;
  return (
    <>
      <div className={styles.header}>
        <Button slot="previous" className={styles.nav} aria-label={t.previousMonth}>
          <Prev aria-hidden="true" />
        </Button>
        {showMonthYearPicker ? (
          <>
            <Heading className={styles.srOnly} />
            <MonthYearPicker isRange={isRange} />
          </>
        ) : (
          <Heading className={styles.heading} />
        )}
        <Button slot="next" className={styles.nav} aria-label={t.nextMonth}>
          <Next aria-hidden="true" />
        </Button>
      </div>
      <div className={styles.months}>
        {Array.from({ length: visibleMonths }, (_, i) => (
          <CalendarGrid key={i} offset={i > 0 ? { months: i } : undefined} className={styles.grid} weekdayStyle="short">
            <CalendarGridHeader>{(day) => <CalendarHeaderCell className={styles.weekday}>{day}</CalendarHeaderCell>}</CalendarGridHeader>
            <CalendarGridBody>{(date) => <CalendarCell date={date} className={styles.cell} data-range={isRange || undefined} />}</CalendarGridBody>
          </CalendarGrid>
        ))}
      </div>
      {errorMessage ? (
        <Text slot="errorMessage" className={styles.error}>
          {errorMessage}
        </Text>
      ) : null}
    </>
  );
}

export interface CalendarProps<T extends DateValue> extends Omit<RACCalendarProps<T>, 'children' | 'visibleDuration'>, CalendarExtraProps {}

/**
 * Month grid for picking one date (APG Date Picker Dialog grid).
 * Works with `@internationalized/date` values: use `CalendarDate` for dates without time,
 * `ZonedDateTime` for instants with a time zone. No implicit conversion is performed.
 */
export function Calendar<T extends DateValue>({ visibleMonths = 1, errorMessage, showMonthYearPicker, className, ...rest }: CalendarProps<T>) {
  return (
    <RACCalendar<T>
      {...rest}
      visibleDuration={{ months: visibleMonths }}
      data-months={visibleMonths}
      className={composeRenderProps(className, (cn) => cx(styles.calendar, cn))}
    >
      <CalendarBody visibleMonths={visibleMonths} errorMessage={errorMessage} isRange={false} showMonthYearPicker={showMonthYearPicker} />
    </RACCalendar>
  );
}

export interface RangeCalendarProps<T extends DateValue> extends Omit<RACRangeCalendarProps<T>, 'children' | 'visibleDuration'>, CalendarExtraProps {}

/** Calendar for selecting a start/end date range. */
export function RangeCalendar<T extends DateValue>({ visibleMonths = 1, errorMessage, showMonthYearPicker, className, ...rest }: RangeCalendarProps<T>) {
  return (
    <RACRangeCalendar<T>
      {...rest}
      visibleDuration={{ months: visibleMonths }}
      data-months={visibleMonths}
      className={composeRenderProps(className, (cn) => cx(styles.calendar, cn))}
    >
      <CalendarBody visibleMonths={visibleMonths} errorMessage={errorMessage} isRange showMonthYearPicker={showMonthYearPicker} />
    </RACRangeCalendar>
  );
}