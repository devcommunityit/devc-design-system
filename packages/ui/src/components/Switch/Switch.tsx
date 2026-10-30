import { forwardRef, type ReactNode } from 'react';
import { SwitchButton, SwitchField, Text, composeRenderProps, type SwitchFieldProps } from 'react-aria-components';
import { cx } from '../../utils';
import fieldStyles from '../Field/Field.module.css';
import choiceStyles from '../Checkbox/Checkbox.module.css';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<SwitchFieldProps, 'children'> {
  children?: ReactNode;
  description?: ReactNode;
  /** Place the label before the track (settings lists). @default 'end' */
  labelPosition?: 'start' | 'end';
}

/**
 * On/off setting that applies immediately (`isSelected` / `defaultSelected` / `onChange`).
 * For choices confirmed by a submit button prefer Checkbox.
 */
export const Switch = forwardRef<HTMLDivElement, SwitchProps>(function Switch(
  { children, description, labelPosition = 'end', className, ...rest },
  ref,
) {
  return (
    <SwitchField ref={ref} {...rest} className={composeRenderProps(className, (cn) => cx(choiceStyles.field, cn))}>
      <SwitchButton className={styles.button} data-label-position={labelPosition}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
        {children ? <span className={choiceStyles.label}>{children}</span> : null}
      </SwitchButton>
      {description ? (
        <Text slot="description" className={cx(fieldStyles.description, labelPosition === 'end' ? styles.indent : undefined)}>
          {description}
        </Text>
      ) : null}
    </SwitchField>
  );
});