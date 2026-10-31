import { DateFormatter, Time } from '@internationalized/date';
import { useEffect, useMemo, useRef } from 'react';
import { ListBox, ListBoxItem } from 'react-aria-components';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './DatePicker.module.css';

export interface TimeOfDay {
  hour: number;
  minute: number;
}

export interface TimeSlotListProps {
  /** Selected time; when it is not on the step grid it is still listed. */
  value: TimeOfDay | null;
  onSelect: (time: Time) => void;
  /** Minutes between slots. @default 30 */
  step?: number;
  /** Earliest selectable slot (inclusive). */
  minTime?: TimeOfDay | null;
  /** Latest selectable slot (inclusive). */
  maxTime?: TimeOfDay | null;
  isTimeUnavailable?: (time: Time) => boolean;
  hourCycle?: 12 | 24;
  autoFocus?: boolean;
  isDisabled?: boolean;
  'aria-label': string;
  className?: string;
}

const toMinutes = (t: TimeOfDay) => t.hour * 60 + t.minute;
const keyOf = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Internal: scrollable listbox of time slots (typeahead: type "14" to jump to 14:00). */
export function TimeSlotList({
  value,
  onSelect,
  step = 30,
  minTime,
  maxTime,
  isTimeUnavailable,
  hourCycle,
  autoFocus,
  isDisabled,
  className,
  'aria-label': ariaLabel,
}: TimeSlotListProps) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const safeStep = Math.min(Math.max(Math.round(step), 1), 720);
  const selected = value ? toMinutes(value) : null;

  const items = useMemo(() => {
    const cycle = hourCycle ? (hourCycle === 12 ? 'h12' : 'h23') : new DateFormatter(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
    // 24h clocks read best zero-padded (09:00), matching the field segments; 12h clocks do not (9:00 AM).
    const twentyFour = cycle === 'h23' || cycle === 'h24';
    const fmt = new DateFormatter(locale, { hour: twentyFour ? '2-digit' : 'numeric', minute: '2-digit', hourCycle: twentyFour ? 'h23' : 'h12' });
    const minutes = new Set<number>();
    for (let m = 0; m < 24 * 60; m += safeStep) minutes.add(m);
    if (selected != null) minutes.add(selected);
    return [...minutes]
      .sort((a, b) => a - b)
      .map((m) => ({ id: keyOf(m), minutes: m, label: fmt.format(new Date(2000, 0, 1, Math.floor(m / 60), m % 60)) }));
  }, [locale, hourCycle, safeStep, selected]);

  const disabledKeys = useMemo(() => {
    const min = minTime ? toMinutes(minTime) : -1;
    const max = maxTime ? toMinutes(maxTime) : Infinity;
    return items
      .filter((i) => i.minutes < min || i.minutes > max || isTimeUnavailable?.(new Time(Math.floor(i.minutes / 60), i.minutes % 60)))
      .map((i) => i.id);
  }, [items, minTime, maxTime, isTimeUnavailable]);

  // Bring the selected (or first available) slot to the middle of the list once the popover is laid out.
  // Scrolls only the list, never the page.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const list = ref.current;
      const el =
        list?.querySelector<HTMLElement>('[aria-selected="true"]') ?? list?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])');
      if (!list || !el) return;
      const offset = el.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
      list.scrollTop = offset - (list.clientHeight - el.offsetHeight) / 2;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <ListBox
      ref={ref}
      aria-label={ariaLabel}
      items={items}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={selected != null ? [keyOf(selected)] : []}
      disabledKeys={disabledKeys}
      // eslint-disable-next-line jsx-a11y/no-autofocus -- opt-in, for listboxes that are the only content of an opened dialog
      autoFocus={autoFocus}
      className={cx(styles.timeList, className)}
      data-disabled={isDisabled || undefined}
      onSelectionChange={(keys) => {
        if (isDisabled || keys === 'all') return;
        const [key] = [...keys];
        if (typeof key !== 'string') return;
        const [h, m] = key.split(':').map(Number);
        onSelect(new Time(h, m));
      }}
    >
      {(item) => (
        <ListBoxItem id={item.id} textValue={item.label} className={styles.timeOption}>
          {item.label}
        </ListBoxItem>
      )}
    </ListBox>
  );
}
