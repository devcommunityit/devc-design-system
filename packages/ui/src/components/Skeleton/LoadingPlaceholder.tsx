import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './SkeletonPresets.module.css';

export interface LoadingPlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  /** Hidden text for assistive technology. @default messages.loading */
  label?: ReactNode;
  /** The skeleton preset, stretched to the box. */
  children: ReactNode;
}

/**
 * Internal box that a component renders instead of itself while `isLoading`: keeps the caller's
 * className/style (grid placement), marks the area busy and carries a non-live "Loading…" text so
 * a page full of cards does not flood the live region (wrap the area in SkeletonGroup for that).
 */
export const LoadingPlaceholder = forwardRef<HTMLDivElement, LoadingPlaceholderProps>(function LoadingPlaceholder(
  { label, className, children, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <div ref={ref} aria-busy="true" data-loading="" className={cx(styles.placeholder, className)} {...rest}>
      <VisuallyHidden>{label ?? t.loading}</VisuallyHidden>
      {children}
    </div>
  );
});
