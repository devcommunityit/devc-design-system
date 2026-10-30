import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import fieldStyles from '../Field/Field.module.css';
import styles from './Fieldset.module.css';

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Visible group title (rendered as `<legend>`). */
  legend: ReactNode;
  description?: ReactNode;
  /** Group-level error (e.g. "Fill in at least one contact"), shown when `isInvalid`. */
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  /** Visual style of the legend. @default 'title' */
  legendVariant?: 'title' | 'label';
}

/**
 * Native fieldset that groups related fields under a legend (e.g. "Billing address").
 * Description and error are linked with `aria-describedby`.
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, description, errorMessage, isInvalid, legendVariant = 'title', className, children, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = isInvalid && errorMessage ? `${id}-error` : undefined;
  const ids = [describedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <fieldset
      ref={ref}
      aria-describedby={ids}
      data-invalid={isInvalid || undefined}
      data-legend-variant={legendVariant}
      className={cx(styles.fieldset, className)}
      {...rest}
    >
      <legend className={styles.legend}>{legend}</legend>
      {description ? (
        <p id={descriptionId} className={cx(fieldStyles.description, styles.description)}>
          {description}
        </p>
      ) : null}
      <div className={styles.content}>{children}</div>
      {errorId ? (
        <p id={errorId} className={cx(fieldStyles.error, styles.error)}>
          {errorMessage}
        </p>
      ) : null}
    </fieldset>
  );
});