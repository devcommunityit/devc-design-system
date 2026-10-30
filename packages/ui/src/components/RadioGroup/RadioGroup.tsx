import { forwardRef, type ReactNode } from 'react';
import {
  RadioButton,
  RadioField,
  RadioGroup as RACRadioGroup,
  Text,
  composeRenderProps,
  type RadioFieldProps,
  type RadioGroupProps as RACRadioGroupProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from '../Checkbox/Checkbox.module.css';

export interface RadioGroupProps extends Omit<RACRadioGroupProps, 'children'>, FieldBaseProps {
  children?: ReactNode;
}

/**
 * Single choice among a few visible options (`value: string | null`). Arrow keys move and select;
 * Tab enters and leaves the group. Use Select when there are many options.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, description, errorMessage, necessityIndicator, orientation = 'vertical', className, children, isRequired, ...rest },
  ref,
) {
  return (
    <RACRadioGroup
      ref={ref}
      {...rest}
      orientation={orientation}
      isRequired={isRequired}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.group, cn))}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <div className={styles.options}>{children}</div>
      </FieldParts>
    </RACRadioGroup>
  );
});

export interface RadioProps extends Omit<RadioFieldProps, 'children'> {
  children?: ReactNode;
  description?: ReactNode;
}

/** Option of a RadioGroup. */
export const Radio = forwardRef<HTMLDivElement, RadioProps>(function Radio({ children, description, className, ...rest }, ref) {
  return (
    <RadioField ref={ref} {...rest} className={composeRenderProps(className, (cn) => cx(styles.field, cn))}>
      <RadioButton className={styles.button}>
        {({ isSelected }) => (
          <>
            <span className={styles.box} data-shape="radio" aria-hidden="true">
              {isSelected ? <span className={styles.dot} /> : null}
            </span>
            {children ? <span className={styles.label}>{children}</span> : null}
          </>
        )}
      </RadioButton>
      {description ? (
        <Text slot="description" className={cx(fieldStyles.description, styles.indent)}>
          {description}
        </Text>
      ) : null}
    </RadioField>
  );
});