import {
  type CalendarDate,
  endOfMonth,
  getLocalTimeZone,
  isSameDay,
  startOfMonth,
  toCalendarDate,
  toCalendarDateTime,
  today,
} from '@internationalized/date';
import type { ReactNode } from 'react';
import { Button as RACButton, type DateValue } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import type { Messages } from '../../i18n/messages';
import styles from './DatePicker.module.css';

/** Passed to preset functions so values are computed when the popover opens, not at import time. */
export interface DatePresetContext {
  /** Today in `timeZone`. */
  today: CalendarDate;
  /** The user's time zone. */
  timeZone: string;
}

export interface DateRangePresetValue {
  start: DateValue;
  end: DateValue;
}

/** Shortcut shown next to the calendar. A `CalendarDate` value is adapted to the picker value type (time and zone kept). */
export interface DatePreset {
  id?: string;
  label: ReactNode;
  value: DateValue | ((ctx: DatePresetContext) => DateValue);
}

export interface DateRangePreset {
  id?: string;
  label: ReactNode;
  value: DateRangePresetValue | ((ctx: DatePresetContext) => DateRangePresetValue);
}

export function presetContext(): DatePresetContext {
  const timeZone = getLocalTimeZone();
  return { today: today(timeZone), timeZone };
}

/** Localized shortcuts: today, tomorrow, in one week. */
export function defaultDatePresets(t: Messages): DatePreset[] {
  return [
    { id: 'today', label: t.today, value: (c) => c.today },
    { id: 'tomorrow', label: t.tomorrow, value: (c) => c.today.add({ days: 1 }) },
    { id: 'next-week', label: t.nextWeek, value: (c) => c.today.add({ weeks: 1 }) },
  ];
}

/** Localized ranges: last 7 and 30 days, this month, last month. */
export function defaultDateRangePresets(t: Messages): DateRangePreset[] {
  return [
    { id: 'last-7', label: t.last7Days, value: (c) => ({ start: c.today.subtract({ days: 6 }), end: c.today }) },
    { id: 'last-30', label: t.last30Days, value: (c) => ({ start: c.today.subtract({ days: 29 }), end: c.today }) },
    { id: 'this-month', label: t.thisMonth, value: (c) => ({ start: startOfMonth(c.today), end: endOfMonth(c.today) }) },
    {
      id: 'last-month',
      label: t.lastMonth,
      value: (c) => {
        const prev = c.today.subtract({ months: 1 });
        return { start: startOfMonth(prev), end: endOfMonth(prev) };
      },
    },
  ];
}

/**
 * Adapts a preset date to the picker value type: keeps time and zone of `reference`
 * (current value or placeholder), so a CalendarDate preset works on a date-time picker.
 */
export function coerceDate(date: DateValue, reference: DateValue | null | undefined, hasTime: boolean): DateValue {
  if (reference && 'timeZone' in reference) {
    if ('timeZone' in date) return date;
    const time = 'hour' in date ? { hour: date.hour, minute: date.minute, second: date.second } : {};
    return reference.set({ year: date.year, month: date.month, day: date.day, ...time });
  }
  if (reference && 'hour' in reference) {
    if ('hour' in date) return toCalendarDateTime(date);
    return reference.set({ year: date.year, month: date.month, day: date.day });
  }
  if (hasTime) return toCalendarDateTime(date);
  return toCalendarDate(date);
}

export interface DateBounds {
  minValue?: DateValue | null;
  maxValue?: DateValue | null;
  isDateUnavailable?: (date: DateValue) => boolean;
}

/** Day-level check used to disable presets that the picker would reject. */
export function isDateAllowed(date: DateValue, { minValue, maxValue, isDateUnavailable }: DateBounds): boolean {
  const day = toCalendarDate(date);
  if (minValue && day.compare(toCalendarDate(minValue)) < 0) return false;
  if (maxValue && day.compare(toCalendarDate(maxValue)) > 0) return false;
  return !isDateUnavailable?.(date);
}

export function sameDay(a: DateValue | null | undefined, b: DateValue | null | undefined): boolean {
  return a != null && b != null && isSameDay(a, b);
}

export interface PresetItem {
  key: string;
  label: ReactNode;
  isDisabled: boolean;
  isActive: boolean;
}

/** Vertical list of shortcut buttons (a horizontal, scrollable row on narrow screens). */
export function PresetList({ items, onSelect }: { items: PresetItem[]; onSelect: (key: string) => void }) {
  const t = useMessages();
  return (
    <div role="group" aria-label={t.datePresets} className={styles.presets}>
      {items.map((item) => (
        <RACButton
          key={item.key}
          className={styles.preset}
          isDisabled={item.isDisabled}
          data-active={item.isActive || undefined}
          aria-current={item.isActive ? 'true' : undefined}
          onPress={() => onSelect(item.key)}
        >
          {item.label}
        </RACButton>
      ))}
    </div>
  );
}
