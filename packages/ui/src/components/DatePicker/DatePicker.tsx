import { CalendarDays } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button as RACButton,
  DatePicker as RACDatePicker,
  DateRangePicker as RACDateRangePicker,
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

interface PickerExtraProps extends FieldBaseProps {
  /** Months shown in the popover calendar. @default 1 */
  visibleMonths?: number;
  /** Shown in the calendar when the selected date is unavailable. */
  calendarErrorMessage?: ReactNode;
  popoverProps?: Omit<PopoverSurfaceProps, 'children'>;
}

function OpenButton() {
  const t = useMessages();
  return (
    <RACButton className={fieldStyles.inlineButton} aria-label={t.openCalendar}>
      <CalendarDays aria-hidden="true" />
    </RACButton>
  );
}

export interface DatePickerProps<T extends DateValue> extends Omit<RACDatePickerProps<T>, 'children'>, PickerExtraProps {}

/**
 * Date field with typed segments plus a calendar popover.
 * Values come from `@internationalized/date`: `CalendarDate` (date only, no time zone shift),
 * `CalendarDateTime` or `ZonedDateTime` (instant). The type you pass is the type you get back.
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
  ...rest
}: DatePickerProps<T>) {
  return (
    <RACDatePicker<T> {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.picker, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={fieldStyles.control}>
          <DateSegments />
          <OpenButton />
        </Group>
      </FieldParts>
      <PopoverSurface placement="bottom start" {...popoverProps}>
        <Dialog className={styles.dialog}>
          <Calendar visibleMonths={visibleMonths} errorMessage={calendarErrorMessage} />
        </Dialog>
      </PopoverSurface>
    </RACDatePicker>
  );
}

export interface DateRangePickerProps<T extends DateValue> extends Omit<RACDateRangePickerProps<T>, 'children'>, PickerExtraProps {}

/** Start/end date field with a range calendar popover. Same value rules as DatePicker. */
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
  ...rest
}: DateRangePickerProps<T>) {
  return (
    <RACDateRangePicker<T> {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.picker, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={cx(fieldStyles.control, styles.rangeControl)}>
          <DateSegments slot="start" />
          <span aria-hidden="true" className={styles.separator}>
            –
          </span>
          <DateSegments slot="end" />
          <OpenButton />
        </Group>
      </FieldParts>
      <PopoverSurface placement="bottom start" {...popoverProps}>
        <Dialog className={styles.dialog}>
          <RangeCalendar visibleMonths={visibleMonths} errorMessage={calendarErrorMessage} />
        </Dialog>
      </PopoverSurface>
    </RACDateRangePicker>
  );
}