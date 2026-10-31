import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { CircleCheck } from 'lucide-react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import styles from './GoalCard.module.css';

export type GoalCardTone = 'brand' | 'success' | 'warning' | 'neutral';

export interface GoalCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Name of the goal; also the accessible name of the progress meter. */
  label: ReactNode;
  /** Current value. */
  value: number;
  /** Value to reach (the meter maximum). */
  target: number;
  /** Intl.NumberFormat options for value, target and remaining amount. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Decorative icon. */
  icon?: ReactNode;
  /** Context such as period or source. */
  description?: ReactNode;
  /** Bottom slot: a link, a small action or a note. */
  footer?: ReactNode;
  /** Ring colour. `brand` uses the accent gradient. @default 'brand' */
  tone?: GoalCardTone;
  /** When set, the label is rendered as a heading of this level. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const SIZE = 120;
const STROKE = 12;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;

/**
 * Dashboard goal tile: progress ring (`role="meter"`) with the percentage in the center,
 * formatted value / target and the remaining amount spelled out.
 */
export const GoalCard = forwardRef<HTMLDivElement, GoalCardProps>(function GoalCard(
  { label, value, target, formatOptions, icon, description, footer, tone = 'brand', headingLevel, className, style, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const labelId = useId();
  const gradientId = useId();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const percentFormatter = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }), [locale]);

  const current = Number.isFinite(value) ? value : 0;
  const max = Number.isFinite(target) && target > 0 ? target : 0;
  const ratio = max > 0 ? Math.max(0, current / max) : current > 0 ? 1 : 0;
  const reached = max > 0 ? current >= max : current > 0;
  const percent = percentFormatter.format(ratio);
  const formattedValue = formatter.format(current);
  const formattedTarget = formatter.format(max);
  const status = reached ? t.goalReached : t.goalRemaining(formatter.format(max - current));
  const Label = headingLevel ? (`h${headingLevel}` as const) : 'span';

  return (
    <div
      ref={ref}
      data-tone={tone}
      data-reached={reached || undefined}
      className={cx(styles.goal, className)}
      style={{ '--_progress': Math.min(1, ratio) * 100, ...style } as CSSVariables}
      {...rest}
    >
      <div className={styles.top}>
        <Label id={labelId} className={styles.label}>
          {label}
        </Label>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <div className={styles.body}>
        <div
          role="meter"
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={Math.min(Math.max(current, 0), max)}
          aria-valuetext={`${percent} (${formattedValue} / ${t.chartTarget} ${formattedTarget})`}
          className={styles.ring}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false" className={styles.svg}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" className={styles.stopStart} />
                <stop offset="100%" className={styles.stopEnd} />
              </linearGradient>
            </defs>
            <circle className={styles.track} cx={CENTER} cy={CENTER} r={RADIUS} />
            {ratio > 0 ? (
              <circle
                className={styles.arc}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                pathLength={100}
                stroke={tone === 'brand' ? `url(#${gradientId})` : undefined}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
              />
            ) : null}
          </svg>
          <span className={styles.percent} aria-hidden="true">
            {percent}
          </span>
        </div>
        <div className={styles.figures}>
          <span className={styles.value}>{formattedValue}</span>
          <span className={styles.target}>
            {t.chartTarget}: {formattedTarget}
          </span>
          <span className={styles.status}>
            {reached ? <CircleCheck aria-hidden="true" className={styles.statusIcon} /> : null}
            {status}
          </span>
        </div>
      </div>
      {description ? <div className={styles.description}>{description}</div> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
});
