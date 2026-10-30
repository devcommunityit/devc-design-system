import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  /** Becomes visible while it (or a descendant) has focus, e.g. skip links. @default false */
  isFocusable?: boolean;
}

/** Text available to assistive technologies but not shown on screen (inline `<span>`). */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(function VisuallyHidden(
  { isFocusable = false, className, ...rest },
  ref,
) {
  return <span ref={ref} data-focusable={isFocusable || undefined} className={cx(styles.hidden, className)} {...rest} />;
});