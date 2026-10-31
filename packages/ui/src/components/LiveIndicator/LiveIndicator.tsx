import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './LiveIndicator.module.css';

export interface LiveIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Visible label; defaults to the localized “Live”. */
  label?: ReactNode;
  /** Current number of viewers, shown after the label. */
  viewers?: number;
  /** Intl.NumberFormat options for the viewer count, e.g. `{ notation: 'compact' }`. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Animate the dot (disabled anyway with prefers-reduced-motion). @default true */
  pulse?: boolean;
}

/**
 * “Live now” marker: a red pulsing dot, a visible label and an optional viewer count.
 * Plain text (no live region): announce changes yourself if the count updates often.
 */
export const LiveIndicator = forwardRef<HTMLSpanElement, LiveIndicatorProps>(function LiveIndicator(
  { label, viewers, formatOptions, pulse = true, className, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const hasViewers = typeof viewers === 'number' && Number.isFinite(viewers);
  return (
    <span ref={ref} data-pulse={pulse || undefined} className={cx(styles.live, className)} {...rest}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label ?? t.live}</span>
      {hasViewers ? (
        <>
          <span className={styles.separator} aria-hidden="true">
            ·
          </span>
          <span className={styles.viewers}>{t.liveViewers(viewers, formatter.format(viewers))}</span>
        </>
      ) : null}
    </span>
  );
});
