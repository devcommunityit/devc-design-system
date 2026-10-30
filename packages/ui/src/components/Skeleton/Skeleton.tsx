import { forwardRef, type HTMLAttributes } from 'react';
import { cx, type CSSVariables } from '../../utils';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'text' */
  shape?: 'text' | 'rect' | 'circle';
  /** Number of text lines (shape="text"); the last one is shorter. @default 1 */
  lines?: number;
  /** CSS width (e.g. '60%', '12rem'). */
  width?: string;
  /** CSS height for rect/circle. */
  height?: string;
}

/**
 * Placeholder for content that is loading. Decorative (aria-hidden): mark the loading region with
 * `aria-busy="true"` and provide a text status (e.g. a visually hidden "Loading…") yourself.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = 'text', lines = 1, width, height, className, style, ...rest },
  ref,
) {
  const vars: CSSVariables = { ...style, '--_w': width, '--_h': height };
  if (shape === 'text' && lines > 1) {
    return (
      <span ref={ref} aria-hidden="true" className={cx(styles.group, className)} style={vars} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={styles.skeleton} data-shape="text" data-last={i === lines - 1 || undefined} />
        ))}
      </span>
    );
  }
  return <span ref={ref} aria-hidden="true" data-shape={shape} className={cx(styles.skeleton, className)} style={vars} {...rest} />;
});