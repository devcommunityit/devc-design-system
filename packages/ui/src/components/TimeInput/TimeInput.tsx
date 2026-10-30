import { Clock } from 'lucide-react';
import { TimeField as RACTimeField, composeRenderProps, type TimeFieldProps as RACTimeFieldProps, type TimeValue } from 'react-aria-components';
import { cx } from '../../utils';
import { DateSegments } from '../DatePicker/DateInput';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';

export interface TimeInputProps<T extends TimeValue> extends Omit<RACTimeFieldProps<T>, 'children'>, FieldBaseProps {
  /** Show a decorative clock icon. @default true */
  showIcon?: boolean;
}

/**
 * Time of day entered by segments (hour, minute, optional second, AM/PM by locale).
 * Use `Time` for a wall-clock time without date or zone; `ZonedDateTime` to edit the time of an instant.
 */
export function TimeInput<T extends TimeValue>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  showIcon = true,
  className,
  isRequired,
  ...rest
}: TimeInputProps<T>) {
  return (
    <RACTimeField<T> {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <div className={fieldStyles.control}>
          {showIcon ? (
            <span className={fieldStyles.adornment}>
              <Clock aria-hidden="true" />
            </span>
          ) : null}
          <DateSegments />
        </div>
      </FieldParts>
    </RACTimeField>
  );
}