import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import { Statistic, type StatisticTrend } from '../Statistic/Statistic';
import styles from './KpiCard.module.css';

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** Numbers are formatted with Intl.NumberFormat in the current locale; `null` shows `emptyValue`. */
  value: number | ReactNode;
  formatOptions?: Intl.NumberFormatOptions;
  /** Same shape as Statistic `trend`; the direction is spelled out for screen readers. */
  trend?: StatisticTrend;
  /** Decorative icon. */
  icon?: ReactNode;
  /** Context such as period or source. */
  description?: ReactNode;
  /** @default '—' */
  emptyValue?: ReactNode;
  /** Recent values drawn as a small decorative trend line (hidden from assistive technology). */
  sparkline?: number[];
  /** Bottom slot: a link to the detail page, a small action or a note. */
  footer?: ReactNode;
}

const WIDTH = 100;
const HEIGHT = 32;
const PAD = 2;

/** Builds the SVG points of a trend line; `null` when there is nothing meaningful to draw. */
function sparklinePoints(data: readonly number[]): Array<[number, number]> | null {
  const values = data.filter((v) => Number.isFinite(v));
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const step = WIDTH / (values.length - 1);
  return values.map((v, i) => {
    const y = range === 0 ? HEIGHT / 2 : PAD + (1 - (v - min) / range) * (HEIGHT - PAD * 2);
    return [Number((i * step).toFixed(2)), Number(y.toFixed(2))];
  });
}

function TrendLine({ data, sentiment }: { data: readonly number[]; sentiment: string }) {
  const gradientId = useId();
  const points = sparklinePoints(data);
  if (!points) return null;
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `0,${HEIGHT} ${line} ${WIDTH},${HEIGHT}`;
  return (
    <svg className={styles.sparkline} data-sentiment={sentiment} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className={styles.areaStart} />
          <stop offset="100%" className={styles.areaEnd} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradientId})`} className={styles.area} />
      <polyline points={line} className={styles.line} />
    </svg>
  );
}

/**
 * Dashboard KPI tile: a Statistic (label, Intl-formatted value, textual trend) on a card surface,
 * with an optional decorative trend line and a footer slot.
 */
export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(function KpiCard(
  { label, value, formatOptions, trend, icon, description, emptyValue, sparkline, footer, className, ...rest },
  ref,
) {
  const sentiment = trend?.sentiment ?? (trend?.direction === 'up' ? 'positive' : trend?.direction === 'down' ? 'negative' : 'neutral');
  return (
    <div ref={ref} className={cx(styles.kpi, className)} {...rest}>
      <Statistic label={label} value={value} formatOptions={formatOptions} trend={trend} icon={icon} description={description} emptyValue={emptyValue} size="lg" />
      {sparkline ? <TrendLine data={sparkline} sentiment={sentiment} /> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
});
