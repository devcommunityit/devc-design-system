import { CalendarDays, X } from 'lucide-react';
import { useContext, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import {
  Button as RACButton,
  DatePicker as RACDatePicker,
  DatePickerStateContext,
  DateRangePicker as RACDateRangePicker,
  DateRangePickerStateContext,
  Dialog,
  Group,
  composeRenderProps,
  type DatePickerProps as RACDatePickerProps,
  type DateRangePickerProps as RACDateRangePickerProps,
  type DateValue,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Calendar, RangeCalendar } from '../Calendar/Calendar';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { PopoverSurface, type PopoverSurfaceProps } from '../Popover/Popover';
import { DateSegments } from './DateInput';
import styles from './DatePicker.module.css';
import {
  PresetList,
  coerceDate,
  defaultDatePresets,
  defaultDateRangePresets,
  isDateAllowed,
  presetContext,
  sameDay,
  type DateBounds,
  type DatePreset,
  type DateRangePreset,
} from './presets';

export interface PickerExtraProps extends FieldBaseProps {
  /** Months shown in the popover calendar. @default 1 */
  visibleMonths?: number;
  /** Shown in the calendar when the selected date is unavailable. */
  calendarErrorMessage?: ReactNode;
  popoverProps?: Omit<PopoverSurfaceProps, 'children'>;
  /** Show an inline button that clears the value (only while there is one). @default false */
  isClearable?: boolean;
}

export function OpenButton() {
  const t = useMessages();
  return (
    <RACButton className={fieldStyles.inlineButton} aria-label={t.openCalendar}>
      <CalendarDays aria-hidden="true" />
    </RACButton>
  );
}

/** Internal: clears a (range) date picker and moves focus back to the first segment. */
export function ClearButton({ isRange, groupRef }: { isRange?: boolean; groupRef: RefObject<HTMLDivElement | null> }) {
  const t = useMessages();
  const single = useContext(DatePickerStateContext);
  const range = useContext(DateRangePickerStateContext);
  const hasValue = isRange ? range?.value?.start != null || range?.value?.end != null : single?.value != null;
  if (!hasValue) return null;
  return (
    <RACButton
      slot={null}
      className={fieldStyles.inlineButton}
      aria-label={t.clear}
      onPress={() => {
        if (isRange) range?.setValue(null);
        else single?.setValue(null);
        groupRef.current?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus();
      }}
    >
      <X aria-hidden="true" />
    </RACButton>
  );
}

/** Internal: shortcut list for DatePicker / DateTimePicker. */
export function DatePickerPresets({ presets, bounds, placeholderValue }: { presets: DatePreset[] | 'default'; bounds: DateBounds; placeholderValue?: DateValue | null }) {
  const t = useMessages();
  const state = useContext(DatePickerStateContext);
  const ctx = useMemo(() => presetContext(), []);
  if (!state) return null;
  const list = presets === 'default' ? defaultDatePresets(t) : presets;
  const reference = state.value ?? placeholderValue;
  const resolved = list.map((p, i) => ({
    key: p.id ?? String(i),
    label: p.label,
    value: coerceDate(typeof p.value === 'function' ? p.value(ctx) : p.value, reference, state.hasTime),
  }));
  return (
    <PresetList
      items={resolved.map((r) => ({ key: r.key, label: r.label, isDisabled: !isDateAllowed(r.value, bounds), isActive: sameDay(r.value, state.value) }))}
      onSelect={(key) => {
        const hit = resolved.find((r) => r.key === key);
        if (!hit) return;
        state.setValue(hit.value);
        state.setOpen(false);
      }}
    />
  );
}

function DateRangePickerPresets({ presets, bounds, placeholderValue }: { presets: DateRangePreset[] | 'default'; bounds: DateBounds; placeholderValue?: DateValue | null }) {
  const t = useMessages();
  const state = useContext(DateRangePickerStateContext);
  const ctx = useMemo(() => presetContext(), []);
  if (!state) return null;
  const list = presets === 'default' ? defaultDateRangePresets(t) : presets;
  const reference = state.value?.start ?? placeholderValue;
  const resolved = list.map((p, i) => {
    const raw = typeof p.value === 'function' ? p.value(ctx) : p.value;
    return {
      key: p.id ?? String(i),
      label: p.label,
      value: { start: coerceDate(raw.start, reference, state.hasTime), end: coerceDate(raw.end, state.value?.end ?? reference, state.hasTime) },
    };
  });
  return (
    <PresetList
      items={resolved.map((r) => ({
        key: r.key,
        label: r.label,
        isDisabled: !isDateAllowed(r.value.start, bounds) || !isDateAllowed(r.value.end, { minValue: bounds.minValue, maxValue: bounds.maxValue }),
        isActive: sameDay(r.value.start, state.value?.start) && sameDay(r.value.end, state.value?.end),
      }))}
      onSelect={(key) => {
        const hit = resolved.find((r) => r.key === key);
        if (!hit) return;
        state.setValue(hit.value);
        state.setOpen(false);
      }}
    />
  );
}

export interface DatePickerProps<T extends DateValue> extends Omit<RACDatePickerProps<T>, 'children'>, PickerExtraProps {
  /**
   * Shortcuts next to the calendar. `'default'` = localized today / tomorrow / in one week.
   * CalendarDate values are adapted to the value type (time and zone of the current value are kept).
   */
  presets?: DatePreset[] | 'default';
  /** Month and year selects in the calendar header. @default true with one visible month */
  showMonthYearPicker?: boolean;
}

/**
 * Date field with typed segments plus a calendar popover, optional shortcuts and clear button.
 * Values come from `@internationalized/date`: `CalendarDate` (date only, no time zone shift),
 * `CalendarDateTime` or `ZonedDateTime` (instant). The type you pass is the type you get back.
 * For date and time in one popover use `DateTimePicker`.
 */
export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  visibleMonths = 1,
  calendarErrorMessage,
  popoverProps,
  className,
  isRequired,
  isClearable,
  presets,
  showMonthYearPicker = visibleMonths === 1,
  ...rest
}: DatePickerProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const canClear = isClearable && !rest.isDisabled && !rest.isReadOnly;
  const bounds: DateBounds = { minValue: rest.minValue, maxValue: rest.maxValue, isDateUnavailable: rest.isDateUnavailable };
  return (
    <RACDatePicker<T> {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.picker, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group ref={groupRef} className={fieldStyles.control}>
          <DateSegments />
          {canClear ? <ClearButton groupRef={groupRef} /> : null}
          <OpenButton />
        </Group>
      </FieldParts>
      <PopoverSurface placement="bottom start" {...popoverProps}>
        <Dialog className={styles.dialog}>
          <div className={styles.panel} data-presets={presets ? true : undefined}>
            {presets ? <DatePickerPresets presets={presets} bounds={bounds} placeholderValue={rest.placeholderValue} /> : null}
            <Calendar visibleMonths={visibleMonths} errorMessage={calendarErrorMessage} showMonthYearPicker={showMonthYearPicker} />
          </div>
        </Dialog>
      </PopoverSurface>
    </RACDatePicker>
  );
}

export interface DateRangePickerProps<T extends DateValue> extends Omit<RACDateRangePickerProps<T>, 'children'>, PickerExtraProps {
  /** Range shortcuts. `'default'` = localized last 7 / 30 days, this month, last month. */
  presets?: DateRangePreset[] | 'default';
  /** Month and year selects in the calendar header. @default false */
  showMonthYearPicker?: boolean;
}

/** Start/end date field with a range calendar popover, optional shortcuts and clear button. Same value rules as DatePicker. */
export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  visibleMonths = 1,
  calendarErrorMessage,
  popoverProps,
  className,
  isRequired,
  isClearable,
  presets,
  showMonthYearPicker,
  ...rest
}: DateRangePickerProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const canClear = isClearable && !rest.isDisabled && !rest.isReadOnly;
  const { isDateUnavailable } = rest;
  const bounds: DateBounds = {
    minValue: rest.minValue,
    maxValue: rest.maxValue,
    isDateUnavailable: isDateUnavailable ? (date) => isDateUnavailable(date, null) : undefined,
  };
  return (
    <RACDateRangePicker<T> {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.picker, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group ref={groupRef} className={cx(fieldStyles.control, styles.rangeControl)}>
          <DateSegments slot="start" />
          <span aria-hidden="true" className={styles.separator}>
            –
          </span>
          <DateSegments slot="end" />
          {canClear ? <ClearButton isRange groupRef={groupRef} /> : null}
          <OpenButton />
        </Group>
      </FieldParts>
      <PopoverSurface placement="bottom start" {...popoverProps}>
        <Dialog className={styles.dialog}>
          <div className={styles.panel} data-presets={presets ? true : undefined}>
            {presets ? <DateRangePickerPresets presets={presets} bounds={bounds} placeholderValue={rest.placeholderValue} /> : null}
            <RangeCalendar visibleMonths={visibleMonths} errorMessage={calendarErrorMessage} showMonthYearPicker={showMonthYearPicker} />
          </div>
        </Dialog>
      </PopoverSurface>
    </RACDateRangePicker>
  );
}
