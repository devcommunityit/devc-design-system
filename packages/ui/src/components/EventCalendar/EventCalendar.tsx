import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today, type CalendarDate, type DayOfWeek } from '@internationalized/date';
import { useId, type ReactNode } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button';
import shared from '../composite/Composite.module.css';
import styles from './EventCalendar.module.css';

export type EventCalendarView = 'day' | 'week' | 'month';

/** Dates are calendar dates, not instants; an end date is inclusive. */
export interface EventCalendarEvent {
  id: string;
  title: string;
  startDate: CalendarDate;
  endDate?: CalendarDate;
  time?: string;
  href?: string;
}

export interface EventCalendarProps {
  'aria-label': string;
  events: readonly EventCalendarEvent[];
  date?: CalendarDate;
  defaultDate?: CalendarDate;
  onDateChange?: (date: CalendarDate) => void;
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  firstDayOfWeek?: DayOfWeek;
  onEventPress?: (event: EventCalendarEvent) => void;
  emptyState?: ReactNode;
  className?: string;
}

/** Calendar of consumer-provided events; navigation does not change or persist event data. */
export function EventCalendar({
  'aria-label': ariaLabel, events, date: controlledDate, defaultDate, onDateChange,
  view: controlledView, defaultView = 'month', onViewChange, firstDayOfWeek,
  onEventPress, emptyState, className,
}: EventCalendarProps) {
  const { locale } = useLocale();
  const t = useMessages();
  const text = t.components;
  const headingId = useId();
  const viewId = useId();
  const [date, setDate] = useControllableState(controlledDate, defaultDate ?? today(getLocalTimeZone()), onDateChange, 'date');
  const [view, setView] = useControllableState(controlledView, defaultView, onViewChange, 'view');
  for (const event of events) {
    if (event.endDate && event.endDate.compare(event.startDate) < 0) {
      throw new RangeError(`EventCalendar: endDate precedes startDate for "${event.id}".`);
    }
  }
  const start = view === 'month'
    ? startOfWeek(startOfMonth(date), locale, firstDayOfWeek)
    : view === 'week' ? startOfWeek(date, locale, firstDayOfWeek) : date;
  const end = view === 'month'
    ? endOfWeek(endOfMonth(date), locale, firstDayOfWeek)
    : view === 'week' ? start.add({ days: 6 }) : date;
  const days: CalendarDate[] = [];
  for (let day = start; day.compare(end) <= 0; day = day.add({ days: 1 })) days.push(day);
  const columns = view === 'day' ? 1 : 7;
  const rows = Array.from({ length: Math.ceil(days.length / columns) }, (_, index) => days.slice(index * columns, (index + 1) * columns));
  const dayFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const titleFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const heading = view === 'month'
    ? titleFormatter.format(date.toDate('UTC'))
    : view === 'day'
      ? dayFormatter.format(date.toDate('UTC'))
      : `${dayFormatter.format(start.toDate('UTC'))} – ${dayFormatter.format(end.toDate('UTC'))}`;
  const navigate = (direction: -1 | 1) => {
    setDate(date.add(view === 'month' ? { months: direction } : view === 'week' ? { weeks: direction } : { days: direction }));
  };
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <div className={shared.toolbar}>
        <div className={shared.actions}>
          <Button size="sm" variant="outline" onPress={() => navigate(-1)}>{text.calendarPrevious}</Button>
          <Button size="sm" variant="outline" onPress={() => setDate(today(getLocalTimeZone()))}>{t.today}</Button>
          <Button size="sm" variant="outline" onPress={() => navigate(1)}>{text.calendarNext}</Button>
        </div>
        <div className={shared.field}>
          <label htmlFor={viewId}>{text.calendarView}</label>
          <select id={viewId} value={view} onChange={(event) => {
            const next = event.target.value;
            if (next === 'day' || next === 'week' || next === 'month') setView(next);
          }}>
            <option value="day">{text.calendarDay}</option>
            <option value="week">{text.calendarWeek}</option>
            <option value="month">{text.calendarMonthView}</option>
          </select>
        </div>
      </div>
      <div id={headingId} className={shared.heading} role="status">{heading}</div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard access to the scroll container */}
      <div className={shared.scroll} role="group" aria-labelledby={headingId} tabIndex={0}>
        <table className={cx(shared.table, styles.calendar)} data-view={view} aria-labelledby={headingId}>
          <thead>
            <tr>{days.slice(0, columns).map((day) => <th key={day.toString()} scope="col">{weekdayFormatter.format(day.toDate('UTC'))}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]!.toString()}>
                {row.map((day) => {
                  const matching = events.filter((event) => event.startDate.compare(day) <= 0 && (event.endDate ?? event.startDate).compare(day) >= 0);
                  return (
                    <td key={day.toString()} data-outside={view === 'month' && day.month !== date.month || undefined}>
                      <time dateTime={day.toString()} aria-label={dayFormatter.format(day.toDate('UTC'))}>{day.day}</time>
                      {matching.length ? (
                        <ul className={shared.list}>
                          {matching.map((event) => (
                            <li key={event.id} className={styles.event}>
                              {event.href ? <a href={event.href}>{event.title}</a>
                                : onEventPress ? <button type="button" onClick={() => onEventPress(event)}>{event.title}</button>
                                  : <span>{event.title}</span>}
                              {event.time ? <span className={shared.muted}> {event.time}</span> : null}
                            </li>
                          ))}
                        </ul>
                      ) : view === 'day' ? <div className={shared.muted}>{emptyState ?? text.calendarNoEvents}</div> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
