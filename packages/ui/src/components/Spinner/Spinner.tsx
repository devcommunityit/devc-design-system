import { forwardRef, type HTMLAttributes } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Spinner.module.css';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. Defaults to the localized "Loading…". Pass `null` when a parent already announces loading. */
  label?: string | null;
}

/** Indeterminate loading indicator. Prefer Skeleton for content placeholders. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({ size = 'md', label, className, ...rest }, ref) {
  const messages = useMessages();
  const text = label === undefined ? messages.loading : label;
  return (
    <span
      ref={ref}
      role={text ? 'status' : undefined}
      aria-hidden={text ? undefined : true}
      data-size={size}
      className={cx(styles.spinner, className)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" className={styles.svg} aria-hidden="true" focusable="false">
        <circle className={styles.track} cx="12" cy="12" r="9" fill="none" strokeWidth="3" />
        <circle className={styles.arc} cx="12" cy="12" r="9" fill="none" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {text ? <span className={styles.label}>{text}</span> : null}
    </span>
  );
});
