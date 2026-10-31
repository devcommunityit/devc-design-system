import type { Time } from '@internationalized/date';
import { Clock, X } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  Button as RACButton,
  Dialog,
  DialogTrigger,
  TimeField as RACTimeField,
  composeRenderProps,
  type TimeFieldProps as RACTimeFieldProps,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { DateSegments } from '../DatePicker/DateInput';
import styles from '../DatePicker/DatePicker.module.css';
import { TimeSlotList } from '../DatePicker/TimeSlotList';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { PopoverSurface, type PopoverSurfaceProps } from '../Popover/Popover';

export interface TimePickerProps extends Omit<RACTimeFieldProps<Time>, 'children'>, FieldBaseProps {
  /** Minutes between the suggested slots. @default 30 */
  step?: number;
  /** Disable single slots (e.g. lunch break). Typed values are still validated by `validate`. */
  isTimeUnavailable?: (time: Time) => boolean;
  /** Show an inline button that clears the value. @default false */
  isClearable?: boolean;
  popoverProps?: Omit<PopoverSurfaceProps, 'children'>;
}

/**
 * Time of day with typed segments plus a list of slots in a popover (Alt + ↓ opens it).
 * The value is a `Time` (wall-clock time, no date or zone). Slots outside `minValue`/`maxValue` are disabled.
 */
export function TimePicker({
  label,
  description,
  errorMessage,
  necessityIndicator,
  className,
  isRequired,
  value,
  defaultValue,
  onChange,
  step = 30,
  isTimeUnavailable,
  isClearable,
  popoverProps,
  ...rest
}: TimePickerProps) {
  const t = useMessages();
  const groupRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [time, setTime] = useControllableState<Time | null>(value, defaultValue ?? null, onChange as ((v: Time | null) => void) | undefined);
  const inactive = rest.isDisabled || rest.isReadOnly;
  return (
    <RACTimeField<Time>
      {...rest}
      value={time}
      onChange={setTime}
      isRequired={isRequired}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.picker, cn))}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- delegated Alt+ArrowDown shortcut from the segments (same as DatePicker); the wrapper itself is not focusable. */}
        <div
          ref={groupRef}
          className={fieldStyles.control}
          onKeyDown={(e) => {
            if (e.altKey && e.key === 'ArrowDown' && !inactive) {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <DateSegments />
          {isClearable && time && !inactive ? (
            <RACButton
              className={fieldStyles.inlineButton}
              aria-label={t.clear}
              onPress={() => {
                setTime(null);
                groupRef.current?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus();
              }}
            >
              <X aria-hidden="true" />
            </RACButton>
          ) : null}
          <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
            <RACButton className={fieldStyles.inlineButton} aria-label={t.chooseTime} isDisabled={inactive}>
              <Clock aria-hidden="true" />
            </RACButton>
            <PopoverSurface placement="bottom end" {...popoverProps}>
              <Dialog aria-label={t.chooseTime} className={styles.timeDialog}>
                <TimeSlotList
                  // eslint-disable-next-line jsx-a11y/no-autofocus -- initial focus of the opened dialog goes to the selected time (APG listbox in dialog).
                  autoFocus
                  aria-label={t.timeSlots}
                  value={time}
                  step={step}
                  minTime={rest.minValue}
                  maxTime={rest.maxValue}
                  isTimeUnavailable={isTimeUnavailable}
                  hourCycle={rest.hourCycle}
                  onSelect={(next) => {
                    setTime(next);
                    setOpen(false);
                  }}
                />
              </Dialog>
            </PopoverSurface>
          </DialogTrigger>
        </div>
      </FieldParts>
    </RACTimeField>
  );
}
