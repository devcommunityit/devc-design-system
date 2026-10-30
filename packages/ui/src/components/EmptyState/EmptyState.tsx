import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import { Heading } from '../Typography/Typography';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Decorative illustration or icon. */
  icon?: ReactNode;
  /** Primary/secondary actions (e.g. "Create", "Clear filters"). */
  actions?: ReactNode;
  /** Heading level that fits the page outline. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** Explains why there is no content (no data, no results, error, first use) and what to do next. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, actions, headingLevel = 2, size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-size={size} className={cx(styles.empty, className)} {...rest}>
      {icon ? (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Heading level={headingLevel} size={size === 'lg' ? 'headline-sm' : size === 'sm' ? 'title-sm' : 'title-lg'} className={styles.title}>
        {title}
      </Heading>
      {description ? <div className={styles.description}>{description}</div> : null}
      {children}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
});