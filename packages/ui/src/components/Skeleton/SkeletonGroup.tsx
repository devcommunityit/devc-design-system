import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { SkeletonAnimationContext, type SkeletonAnimation } from './SkeletonContext';
import styles from './SkeletonPresets.module.css';

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the region is loading. @default true */
  isLoading?: boolean;
  /**
   * Placeholder shown while loading. When set, `children` (the real content) replaces it once
   * `isLoading` is false. When omitted, `children` are always rendered (wrapper mode).
   */
  skeleton?: ReactNode;
  /** Status text for screen readers while loading. @default messages.loading ("Loading…") */
  label?: string;
  /** Optional status text announced when loading completes (e.g. "12 results loaded"). */
  loadedLabel?: string;
  /** Animation propagated to every descendant skeleton. @default 'pulse' */
  animation?: SkeletonAnimation;
  children?: ReactNode;
}

/**
 * Loading region: sets `aria-busy`, exposes one polite status text instead of announcing each
 * skeleton, and syncs the animation of all descendant skeletons.
 */
export const SkeletonGroup = forwardRef<HTMLDivElement, SkeletonGroupProps>(function SkeletonGroup(
  { isLoading = true, skeleton, label, loadedLabel, animation = 'pulse', className, children, ...rest },
  ref,
) {
  const messages = useMessages();
  const swap = skeleton !== undefined;
  return (
    <>
      <VisuallyHidden role="status">{isLoading ? (label ?? messages.loading) : (loadedLabel ?? '')}</VisuallyHidden>
      <div ref={ref} aria-busy={isLoading || undefined} data-loading={isLoading || undefined} className={cx(styles.region, className)} {...rest}>
        <SkeletonAnimationContext.Provider value={animation}>{swap && isLoading ? skeleton : children}</SkeletonAnimationContext.Provider>
      </div>
    </>
  );
});
