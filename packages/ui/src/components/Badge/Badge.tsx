import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  /** Decorative leading icon. */
  icon?: ReactNode;
  /** Shows a leading status dot (decorative: the text must carry the meaning). */
  dot?: boolean;
}

/** Short, non-interactive status or count label. For removable or selectable items use Tag. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'soft', size = 'md', icon, dot = false, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} data-tone={tone} data-variant={variant} data-size={size} className={cx(styles.badge, className)} {...rest}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </span>
  );
});