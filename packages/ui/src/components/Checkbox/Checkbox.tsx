import { Check, Minus } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import {
  CheckboxButton,
  CheckboxField,
  CheckboxGroup as RACCheckboxGroup,
  Text,
  composeRenderProps,
  type CheckboxFieldProps,
  type CheckboxGroupProps as RACCheckboxGroupProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import { FieldError, FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<CheckboxFieldProps, 'children'> {
  /** Visible label. */
  children?: ReactNode;
  /** Help text under the label. */
  description?: ReactNode;
  /** Error shown when the checkbox is invalid (e.g. required consent not given). */
  errorMessage?: FieldBaseProps['errorMessage'];
}

/**
 * Checkbox with label, optional description and validation. Use alone (consent, opt-in)
 * or inside `CheckboxGroup` with a `value`. Supports `isIndeterminate` for "select all".
 */
export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(function Checkbox(
  { children, description, errorMessage, className, ...rest },
  ref,
) {
  return (
    <CheckboxField ref={ref} {...rest} className={composeRenderProps(className, (cn) => cx(styles.field, cn))}>
      <CheckboxButton className={styles.button}>
        {({ isSelected, isIndeterminate }) => (
          <>
            <span className={styles.box} aria-hidden="true">
              {isIndeterminate ? <Minus /> : isSelected ? <Check /> : null}
            </span>
            {children ? <span className={styles.label}>{children}</span> : null}
          </>
        )}
      </CheckboxButton>
      {description ? (
        <Text slot="description" className={cx(fieldStyles.description, styles.indent)}>
          {description}
        </Text>
      ) : null}
      <FieldError className={styles.indent}>{errorMessage}</FieldError>
    </CheckboxField>
  );
});

export interface CheckboxGroupProps extends Omit<RACCheckboxGroupProps, 'children'>, FieldBaseProps {
  children?: ReactNode;
  /** Layout of the options. @default 'vertical' */
  orientation?: 'horizontal' | 'vertical';
}

/** Group of checkboxes with a shared label, description and validation (`value: string[]`). */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  { label, description, errorMessage, necessityIndicator, orientation = 'vertical', className, children, isRequired, ...rest },
  ref,
) {
  return (
    <RACCheckboxGroup
      ref={ref}
      {...rest}
      isRequired={isRequired}
      data-orientation={orientation}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.group, cn))}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <div className={styles.options}>{children}</div>
      </FieldParts>
    </RACCheckboxGroup>
  );
});