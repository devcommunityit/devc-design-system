import { forwardRef, type SVGAttributes } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { areaPath, extent, linePath, scaleLinear, segments, seriesStyle, useNumberFormatter } from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './Sparkline.module.css';

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height' | 'values'> {
  /** Values in order (e.g. last 12 weeks). */
  data: number[];
  /** What the values are; combined with a localized summary (first, last, min, max) as the accessible name. */
  label: string;
  /** @default 'line' */
  variant?: 'line' | 'area';
  /** Width in px; the sparkline never exceeds its container. @default 120 */
  width?: number;
  /** @default 32 */
  height?: number;
  /** 0-based data color index (`--dc-color-data-N`). @default 0 */
  colorIndex?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

/** Tiny inline trend (role="img"); the accessible name spells out first, last, min and max. */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { data, label, variant = 'line', width = 120, height = 32, colorIndex = 0, formatOptions, className, style, ...rest },
  ref,
) {
  const t = useMessages();
  const formatter = useNumberFormatter(formatOptions);
  const values = data.filter((v) => Number.isFinite(v));
  const [lo, hi] = extent(values);
  const first = values[0];
  const last = values[values.length - 1];
  const summary =
    first !== undefined && last !== undefined
      ? t.chartSummary({ first: formatter.format(first), last: formatter.format(last), min: formatter.format(lo), max: formatter.format(hi) })
      : '';
  const pad = 3;
  const xAt = (i: number) => (data.length > 1 ? pad + (i * (width - pad * 2)) / (data.length - 1) : width / 2);
  const yAt = scaleLinear(lo === hi ? [lo - 1, hi + 1] : [lo, hi], [height - pad, pad]);
  const runs = segments(data, xAt, yAt);
  const lastIndex = data.length - 1;
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={summary ? `${label}: ${summary}` : label}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      data-variant={variant}
      className={cx(styles.sparkline, className)}
      style={{ ...seriesStyle(colorIndex), ...style }}
      {...rest}
    >
      {variant === 'area' ? <path className={chart.area} d={areaPath(runs, height - pad)} /> : null}
      <path className={chart.line} d={linePath(runs)} />
      {last !== undefined && data[lastIndex] === last ? <circle className={styles.dot} cx={xAt(lastIndex)} cy={yAt(last)} r={2.5} /> : null}
    </svg>
  );
});
