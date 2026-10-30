import { ChevronDown } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils';
import { Field, type NecessityIndicator } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from './NativeSelect.module.css';

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'disabled' | 'required' | 'multiple'> {
  label: ReactNode;
  description?: ReactNode;
  /** Shown when `isInvalid` is true. */
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  necessityIndicator?: NecessityIndicator;
  /** Adds an empty first option (disabled when the field is required). */
  placeholder?: string;
  /** Options as data; alternatively pass `<option>`/`<optgroup>` children. */
  options?: NativeSelectOption[];
  /** Props for the wrapper element. */
  wrapperProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
}

/**
 * Styled native `<select>`: best for short lists on mobile, in SSR forms and when the OS picker
 * is preferable. For search, rich options or custom rendering use Select or Combobox.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { label, description, errorMessage, isInvalid, isRequired, isDisabled, necessityIndicator, placeholder, options, wrapperProps, className, children, ...rest },
  ref,
) {
  return (
    <Field
      {...wrapperProps}
      label={label}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      necessityIndicator={necessityIndicator}
      data-disabled={isDisabled || undefined}
    >
      {(control) => (
        <div className={cx(fieldStyles.control, styles.control)} data-disabled={isDisabled || undefined}>
          <select
            ref={ref}
            {...rest}
            {...control}
            required={isRequired}
            disabled={isDisabled}
            className={cx(fieldStyles.input, styles.select, className)}
          >
            {placeholder !== undefined ? (
              <option value="" disabled={isRequired}>
                {placeholder}
              </option>
            ) : null}
            {options?.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
            {children}
          </select>
          <ChevronDown aria-hidden="true" className={styles.chevron} />
        </div>
      )}
    </Field>
  );
});