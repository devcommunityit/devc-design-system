import { Minus, Plus } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { Button as RACButton, Group, NumberField, composeRenderProps, type NumberFieldProps } from 'react-aria-components';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { Input, type InputProps } from '../TextField/TextField';
import styles from './NumberInput.module.css';

export interface NumberInputProps extends Omit<NumberFieldProps, 'children'>, FieldBaseProps {
  placeholder?: string;
  /** Decorative element before the input (e.g. currency icon). */
  startAdornment?: ReactNode;
  /** Hide the −/+ buttons (arrow keys and wheel still work). @default false */
  hideSteppers?: boolean;
  inputProps?: Omit<InputProps, 'ref'>;
}

/**
 * Localized numeric input: parses and formats with `Intl.NumberFormat` (`formatOptions` for
 * currency, percent, units), clamps to `minValue`/`maxValue`, steps with buttons and arrow keys.
 * `value` is a number (`NaN` when empty).
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { label, description, errorMessage, necessityIndicator, placeholder, startAdornment, hideSteppers = false, inputProps, className, isRequired, ...rest },
  ref,
) {
  return (
    <NumberField {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={cx(fieldStyles.control, styles.control)}>
          {!hideSteppers ? (
            <RACButton slot="decrement" className={cx(fieldStyles.inlineButton, styles.step)}>
              <Minus aria-hidden="true" />
            </RACButton>
          ) : null}
          {startAdornment ? (
            <span className={fieldStyles.adornment} aria-hidden="true">
              {startAdornment}
            </span>
          ) : null}
          <Input ref={ref} placeholder={placeholder} className={styles.input} data-steppers={hideSteppers ? undefined : ''} {...inputProps} />
          {!hideSteppers ? (
            <RACButton slot="increment" className={cx(fieldStyles.inlineButton, styles.step)}>
              <Plus aria-hidden="true" />
            </RACButton>
          ) : null}
        </Group>
      </FieldParts>
    </NumberField>
  );
});