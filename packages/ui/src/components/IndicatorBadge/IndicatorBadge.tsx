import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './IndicatorBadge.module.css';

export type IndicatorBadgeTone = 'danger' | 'brand' | 'success' | 'warning' | 'neutral';
export type IndicatorBadgePlacement = 'top-end' | 'bottom-end' | 'top-start' | 'bottom-start';

export interface IndicatorBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Element the indicator is anchored to (Avatar, IconButton, icon…). */
  children: ReactNode;
  /** Number shown in the bubble; values above `max` render as "max+". */
  count?: number;
  /** @default 99 */
  max?: number;
  /** Small dot without number (takes precedence over `count`). @default false */
  dot?: boolean;
  /** @default 'danger' */
  tone?: IndicatorBadgeTone;
  /** Logical corner (mirrors in RTL). @default 'top-end' */
  placement?: IndicatorBadgePlacement;
  /** Show the bubble when `count` is 0. @default false */
  showZero?: boolean;
  /** Accessible text (e.g. "3 unread notifications"), rendered visually hidden; the bubble becomes aria-hidden. */
  label?: string;
  /** Pulsing halo to draw attention (disabled with reduced motion). @default false */
  pulse?: boolean;
  /** `circular` pulls the indicator in to sit on the edge of round children (avatars). @default 'rectangular' */
  overlap?: 'rectangular' | 'circular';
}

/**
 * Positions a count or a dot on the corner of its child. The number is formatted with Intl
 * for the active locale; pass `label` to give screen readers meaningful text.
 */
export const IndicatorBadge = forwardRef<HTMLSpanElement, IndicatorBadgeProps>(function IndicatorBadge(
  {
    children,
    count,
    max = 99,
    dot = false,
    tone = 'danger',
    placement = 'top-end',
    showZero = false,
    label,
    pulse = false,
    overlap = 'rectangular',
    className,
    ...rest
  },
  ref,
) {
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);
  const value = count !== undefined && Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : undefined;
  const visible = dot || (value !== undefined && (value > 0 || showZero));
  const text = dot || value === undefined ? null : value > max ? `${formatter.format(max)}+` : formatter.format(value);

  return (
    <span ref={ref} className={cx(styles.root, className)} {...rest}>
      {children}
      {visible ? (
        <>
          <span
            className={styles.indicator}
            data-tone={tone}
            data-placement={placement}
            data-overlap={overlap}
            data-dot={dot || undefined}
            data-pulse={pulse || undefined}
            aria-hidden={label ? true : undefined}
          >
            {text}
          </span>
          {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
        </>
      ) : null}
    </span>
  );
});
