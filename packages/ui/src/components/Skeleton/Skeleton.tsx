import { forwardRef, type HTMLAttributes } from 'react';
import { cx, type CSSVariables } from '../../utils';
import { useSkeletonAnimation, type SkeletonAnimation } from './SkeletonContext';
import styles from './Skeleton.module.css';

export type { SkeletonAnimation } from './SkeletonContext';
export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full' | 'control';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'text' */
  shape?: 'text' | 'rect' | 'circle';
  /** Number of text lines (shape="text"); the last one is shorter. @default 1 */
  lines?: number;
  /** CSS width (e.g. '60%', '12rem'). */
  width?: string;
  /** CSS height for rect/circle. */
  height?: string;
  /** Loading effect. Inherited from the nearest SkeletonGroup or preset. @default 'pulse' */
  animation?: SkeletonAnimation;
  /** Corner radius; `control` matches buttons and inputs. Default depends on `shape`. */
  radius?: SkeletonRadius;
}

/**
 * Placeholder for content that is loading. Decorative (aria-hidden): wrap the loading region in
 * `SkeletonGroup` (aria-busy + status text) or provide them yourself.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = 'text', lines = 1, width, height, animation, radius, className, style, ...rest },
  ref,
) {
  const anim = useSkeletonAnimation(animation);
  const vars: CSSVariables = { ...style, '--_w': width, '--_h': height };
  if (shape === 'text' && lines > 1) {
    return (
      <span ref={ref} aria-hidden="true" data-animation={anim} className={cx(styles.group, className)} style={vars} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={styles.skeleton}
            data-shape="text"
            data-animation={anim}
            data-radius={radius}
            data-last={i === lines - 1 || undefined}
          />
        ))}
      </span>
    );
  }
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-shape={shape}
      data-animation={anim}
      data-radius={radius}
      className={cx(styles.skeleton, className)}
      style={vars}
      {...rest}
    />
  );
});
