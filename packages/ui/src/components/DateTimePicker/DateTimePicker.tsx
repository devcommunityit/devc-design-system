import { type Time, getLocalTimeZone, now, toCalendarDateTime, type CalendarDateTime, type ZonedDateTime } from '@internationalized/date';
import { Clock } from 'lucide-react';
import { useContext, useRef, type ReactNode } from 'react';
import {
  DatePicker as RACDatePicker,
  DatePickerStateContext,
  Dialog,
  Group,
  composeRenderProps,
  type DatePickerProps as RACDatePickerProps,
  type DateValue,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import { Calendar } from '../Calendar/Calendar';
import { ClearButton, DatePickerPresets, OpenButton, type PickerExtraProps } from '../DatePicker/DatePicker';
import { DateSegments } from '../DatePicker/DateInput';
import styles from '../DatePicker/DatePicker.module.css';
import { sameDay, type DateBounds, type DatePreset } from '../DatePicker/presets';
import { TimeSlotList } from '../DatePicker/TimeSlotList';
import { FieldParts } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { PopoverSurface } from '../Popover/Popover';

export type DateTimeValue = CalendarDateTime | ZonedDateTime;

export interface DateTimePickerProps<T extends DateTimeValue>
  extends Omit<RACDatePickerProps<T>, 'children' | 'granularity' | 'shouldCloseOnSelect'>,
    Omit<PickerExtraProps, 'visibleMonths'> {
  /** Smallest editable unit. @default 'minute' */
  granularity?: 'hour' | 'minute' | 'second';
  /** Minutes between the time slots in the popover. @default 30 (60 with granularity 'hour') */
  timeStep?: number;
  /** Disable single time slots (e.g. lunch break). Applies to every day. */
  isTimeUnavailable?: (time: Time) => boolean;
  /** Shortcuts beside the calendar; the time of the current value is kept. `'default'` = today / tomorrow / in one week. */
  presets?: DatePreset[] | 'default';
  /** Show the “Now” button in the popover footer. @default true */
  showNowButton?: boolean;
  /** Month and year selects in the calendar header. @default true */
  showMonthYearPicker?: boolean;
}

interface PopoverBodyProps {
  timeStep: number;
  granularity: 'hour' | 'minute' | 'second';
  isTimeUnavailable?: (time: Time) => boolean;
  hourCycle?: 12 | 24;
  placeholderValue?: DateValue | null;
  bounds: DateBounds;
  presets?: DatePreset[] | 'default';
  showNowButton: boolean;
  showMonthYearPicker: boolean;
  calendarErrorMessage?: ReactNode;
}

function DateTimePopoverBody({
  timeStep,
  granularity,
  isTimeUnavailable,
  hourCycle,
  placeholderValue,
  bounds,
  presets,
  showNowButton,
  showMonthYearPicker,
  calendarErrorMessage,
}: PopoverBodyProps) {
  const t = useMessages();
  const state = useContext(DatePickerStateContext);
  if (!state) return null;
  const { minValue, maxValue } = bounds;
  const day = state.dateValue;
  const minTime = minValue && 'hour' in minValue && sameDay(day, minValue) ? minValue : null;
  const maxTime = maxValue && 'hour' in maxValue && sameDay(day, maxValue) ? maxValue : null;
  const reference = state.value ?? placeholderValue ?? null;

  // Keep the value type: a zoned value gets a zoned time, so the zone is not lost on commit.
  const selectTime = (time: Time) => {
    const base = state.timeValue ?? (reference && 'hour' in reference ? reference : null);
    state.setTimeValue(base ? base.set({ hour: time.hour, minute: time.minute, second: 0, millisecond: 0 }) : time);
  };

  const selectNow = () => {
    const zoned = reference != null && 'timeZone' in reference;
    let current = now(zoned ? reference.timeZone : getLocalTimeZone()).set({ second: 0, millisecond: 0 });
    if (granularity === 'hour') current = current.set({ minute: 0 });
    state.setValue(zoned ? current : toCalendarDateTime(current));
    state.setOpen(false);
  };

  return (
    <>
      <div className={styles.panel} data-presets={presets ? true : undefined}>
        {presets ? <DatePickerPresets presets={presets} bounds={bounds} placeholderValue={placeholderValue} /> : null}
        <div className={styles.dateTime}>
          <Calendar errorMessage={calendarErrorMessage} showMonthYearPicker={showMonthYearPicker} />
          <div className={styles.timeColumn}>
            <span aria-hidden="true" className={styles.timeHeading}>
              <Clock />
              {t.timeSlots}
            </span>
            <TimeSlotList
              aria-label={t.chooseTime}
              value={state.timeValue}
              onSelect={selectTime}
              step={timeStep}
              minTime={minTime}
              maxTime={maxTime}
              isTimeUnavailable={isTimeUnavailable}
              hourCycle={hourCycle}
            />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        {showNowButton ? (
          <Button variant="ghost" size="sm" onPress={selectNow}>
            {t.now}
          </Button>
        ) : (
          <span />
        )}
        <Button size="sm" onPress={() => state.setOpen(false)}>
          {t.done}
        </Button>
      </div>
    </>
  );
}

/**
 * A single field for date and time: typed segments plus one popover with calendar,
 * time slots, optional shortcuts and a “Now” button. The popover stays open until “Done”,
 * Esc or a click outside, so date and time can be chosen in any order.
 * Values: `CalendarDateTime` (local wall time) or `ZonedDateTime` (instant with zone).
 */
export function DateTimePicker<T extends DateTimeValue>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  calendarErrorMessage,
  popoverProps,
  className,
  isRequired,
  isClearable,
  presets,
  granularity = 'minute',
  timeStep,
  isTimeUnavailable,
  showNowButton = true,
  showMonthYearPicker = true,
  ...rest
}: DateTimePickerProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const canClear = isClearable && !rest.isDisabled && !rest.isReadOnly;
  const bounds: DateBounds = { minValue: rest.minValue, maxValue: rest.maxValue, isDateUnavailable: rest.isDateUnavailable };
  return (
    <RACDatePicker<T>
      {...rest}
      granularity={granularity}
      shouldCloseOnSelect={false}
      isRequired={isRequired}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.picker, cn))}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group ref={groupRef} className={fieldStyles.control}>
          <DateSegments />
          {canClear ? <ClearButton groupRef={groupRef} /> : null}
          <OpenButton />
        </Group>
      </FieldParts>
      <PopoverSurface placement="bottom start" {...popoverProps}>
        <Dialog className={styles.dialog}>
          <DateTimePopoverBody
            timeStep={timeStep ?? (granularity === 'hour' ? 60 : 30)}
            granularity={granularity}
            isTimeUnavailable={isTimeUnavailable}
            hourCycle={rest.hourCycle}
            placeholderValue={rest.placeholderValue}
            bounds={bounds}
            presets={presets}
            showNowButton={showNowButton}
            showMonthYearPicker={showMonthYearPicker}
            calendarErrorMessage={calendarErrorMessage}
          />
        </Dialog>
      </PopoverSurface>
    </RACDatePicker>
  );
}
