import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Ribbon.module.css';

export type RibbonTone = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
export type RibbonVariant = 'corner' | 'bookmark' | 'banner';
export type RibbonPosition = 'top-start' | 'top-end';

export interface RibbonProps extends HTMLAttributes<HTMLDivElement> {
  /** Short ribbon text ("Beta", "New", "-20%"). Real text, read before the wrapped content. */
  label: ReactNode;
  /** Content the ribbon is laid over (card, image…). */
  children: ReactNode;
  /** `corner`: diagonal band clipped in the corner. `bookmark`: vertical tab with notched end. `banner`: flag sticking out of the edge. @default 'corner' */
  variant?: RibbonVariant;
  /** Logical corner (mirrors in RTL). @default 'top-start' for banner, 'top-end' otherwise */
  position?: RibbonPosition;
  /** `brand` uses the accent gradient. @default 'brand' */
  tone?: RibbonTone;
}

/**
 * Wraps content in a relatively positioned box and overlays a short corner ribbon on it.
 * The `corner` and `bookmark` variants are clipped to the box; `banner` sticks out of the edge.
 */
export const Ribbon = forwardRef<HTMLDivElement, RibbonProps>(function Ribbon(
  { label, children, variant = 'corner', position, tone = 'brand', className, ...rest },
  ref,
) {
  const resolvedPosition = position ?? (variant === 'banner' ? 'top-start' : 'top-end');
  return (
    <div ref={ref} data-variant={variant} data-position={resolvedPosition} data-tone={tone} className={cx(styles.ribbon, className)} {...rest}>
      <span className={styles.label}>
        <span className={styles.text}>{label}</span>
      </span>
      {children}
    </div>
  );
});
