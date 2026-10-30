import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button,
  Calendar as RACCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar as RACRangeCalendar,
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
}

function CalendarBody({ visibleMonths, errorMessage, isRange }: { visibleMonths: number; errorMessage?: ReactNode; isRange: boolean }) {
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
        <Heading className={styles.heading} />
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
export function Calendar<T extends DateValue>({ visibleMonths = 1, errorMessage, className, ...rest }: CalendarProps<T>) {
  return (
    <RACCalendar<T>
      {...rest}
      visibleDuration={{ months: visibleMonths }}
      data-months={visibleMonths}
      className={composeRenderProps(className, (cn) => cx(styles.calendar, cn))}
    >
      <CalendarBody visibleMonths={visibleMonths} errorMessage={errorMessage} isRange={false} />
    </RACCalendar>
  );
}

export interface RangeCalendarProps<T extends DateValue> extends Omit<RACRangeCalendarProps<T>, 'children' | 'visibleDuration'>, CalendarExtraProps {}

/** Calendar for selecting a start/end date range. */
export function RangeCalendar<T extends DateValue>({ visibleMonths = 1, errorMessage, className, ...rest }: RangeCalendarProps<T>) {
  return (
    <RACRangeCalendar<T>
      {...rest}
      visibleDuration={{ months: visibleMonths }}
      data-months={visibleMonths}
      className={composeRenderProps(className, (cn) => cx(styles.calendar, cn))}
    >
      <CalendarBody visibleMonths={visibleMonths} errorMessage={errorMessage} isRange />
    </RACRangeCalendar>
  );
}