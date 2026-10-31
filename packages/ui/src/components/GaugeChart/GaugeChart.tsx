import { forwardRef, useId } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import {
  ChartFrame,
  GradientDefs,
  arcPath,
  estimateTextWidth,
  svgId,
  vividSeriesStyle,
  useNumberFormatter,
  type ChartBaseProps,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './GaugeChart.module.css';

export type GaugeChartTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface GaugeChartBand {
  /** Upper bound of the band; each band starts where the previous one ends (the first at `min`). */
  to: number;
  tone: GaugeChartTone;
}

export interface GaugeChartProps extends ChartBaseProps {
  /** Current value; the arc is clamped to [min, max], the text shows the actual value. */
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** Optional target, drawn as a tick across the arc. */
  target?: number;
  /** Colored segments of the scale (status tones), e.g. danger/warning/success thresholds. */
  bands?: GaugeChartBand[];
  /** Caption under the value in the center (also names the meter when there is no title). */
  label?: string;
  /** Arc diameter in px, plus margins for the target label (the chart shrinks with its container). @default 240 */
  size?: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Semicircular gauge in SVG (no dependencies): one value on a bounded scale, with optional target
 * and status bands. Exposed to assistive technologies as `role="meter"`.
 */
export const GaugeChart = forwardRef<HTMLElement, GaugeChartProps>(function GaugeChart(
  { value, min = 0, max = 100, target, bands, label, title, description, formatOptions, size = 240, className, style, ...rest },
  ref,
) {
  const t = useMessages();
  const titleId = useId();
  const prefix = svgId(useId());
  const formatter = useNumberFormatter(formatOptions);
  const hasTitle = title !== undefined && title !== null && title !== '';

  const lo = Number.isFinite(min) ? min : 0;
  const hi = Number.isFinite(max) && max > lo ? max : lo + 1;
  const raw = Number.isFinite(value) ? value : lo;
  const now = clamp(raw, lo, hi);
  const fraction = (v: number) => (clamp(v, lo, hi) - lo) / (hi - lo);
  const angleOf = (v: number) => Math.PI + fraction(v) * Math.PI;
  const targetValue = typeof target === 'number' && Number.isFinite(target) ? target : null;
  const targetFormatted = targetValue !== null ? formatter.format(targetValue) : '';
  const valueText = targetValue !== null ? `${formatter.format(raw)}, ${t.chartTarget}: ${formatter.format(targetValue)}` : formatter.format(raw);

  const radius = size / 2;
  const ring = Math.max(6, Math.round(size * 0.15));
  const bandList = (bands ?? []).filter((b) => Number.isFinite(b.to)).sort((a, b) => a.to - b.to);
  const bandWidth = bandList.length ? Math.max(3, Math.round(ring * 0.3)) : 0;
  const bandGap = bandList.length ? 3 : 0;
  const outer = radius - bandWidth - bandGap;
  const inner = outer - ring;

  // Margins so the target label (outside the arc) stays inside the viewBox.
  const labelRadius = radius + 10;
  const targetAngle = targetValue !== null ? angleOf(targetValue) : 0;
  const cos = Math.cos(targetAngle);
  const anchor = cos < -0.35 ? 'end' : cos > 0.35 ? 'start' : 'middle';
  // Two-line label ("Target" / value) keeps the side margins narrow.
  const textWidth = Math.max(estimateTextWidth(t.chartTarget), estimateTextWidth(targetFormatted));
  const reachX = targetValue !== null ? labelRadius * Math.abs(cos) + (anchor === 'middle' ? textWidth / 2 : textWidth) : 0;
  const reachY = targetValue !== null ? labelRadius * Math.abs(Math.sin(targetAngle)) + 24 : 0;
  const padX = Math.max(8, Math.ceil(reachX - radius) + 4);
  const padTop = Math.max(8, Math.ceil(reachY - radius) + 4);
  const cxPos = padX + radius;
  const cy = padTop + radius;
  const width = cxPos * 2;
  const height = cy + 22;

  let from = lo;
  const segments = bandList.map((band, i) => {
    const a = from;
    const b = clamp(band.to, lo, hi);
    from = Math.max(from, b);
    return { key: `${i}-${band.tone}`, tone: band.tone, a, b };
  });

  const sweep = fraction(now);
  const valueGeometry = sweep > 0 ? arcPath(cxPos, cy, inner, outer, Math.PI, Math.PI + sweep * Math.PI) : '';
  const trackGeometry = arcPath(cxPos, cy, inner, outer, Math.PI, Math.PI * 2);
  const scaleOffset = outer - ring / 2;
  const sweepStyle: CSSVariables = {
    ...vividSeriesStyle(prefix, 0),
    '--_cx': `${r2(cxPos)}px`,
    '--_cy': `${r2(cy)}px`,
    '--_from': `${r2(-sweep * 180)}deg`,
  };
  // Max width = viewBox width, so the arc is drawn at `size` px and text keeps its nominal size.
  const rootStyle: CSSVariables = { ...style, '--_size': `${Math.ceil(width)}px` };
  const polar = (rad: number, angle: number) => [r2(cxPos + rad * Math.cos(angle)), r2(cy + rad * Math.sin(angle))] as const;
  const tickStart = polar(inner - 4, targetAngle);
  const tickEnd = polar(radius + 4, targetAngle);
  const labelAt = polar(labelRadius, targetAngle);

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.gaugeChart, className)}
      style={rootStyle}
      {...rest}
    >
      <div
        role="meter"
        className={styles.meter}
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-label={hasTitle ? undefined : (label ?? t.chartValue)}
        aria-valuenow={now}
        aria-valuemin={lo}
        aria-valuemax={hi}
        aria-valuetext={valueText}
      >
        <svg className={cx(chart.svg, styles.svg)} viewBox={`0 0 ${r2(width)} ${r2(height)}`} aria-hidden="true" focusable="false">
          <GradientDefs prefix={prefix} indexes={[0]} direction="horizontal" stopBaseClassName={chart.stopBase} stopVividClassName={chart.stopVivid} />
          <defs>
            <clipPath id={`${prefix}-clip`}>
              <rect x={0} y={0} width={r2(width)} height={r2(cy + 0.5)} />
            </clipPath>
          </defs>
          {segments.map(({ key, tone, a, b }) =>
            b > a ? <path key={key} className={styles.band} data-tone={tone} d={arcPath(cxPos, cy, radius - bandWidth, radius, angleOf(a), angleOf(b))} /> : null,
          )}
          <path className={styles.track} d={trackGeometry} />
          {valueGeometry ? (
            <g clipPath={`url(#${prefix}-clip)`}>
              <g className={styles.sweep} style={sweepStyle}>
                <path className={cx(chart.fill, styles.value)} d={valueGeometry} />
              </g>
            </g>
          ) : null}
          {targetValue !== null ? (
            <g className={styles.target}>
              <line className={styles.targetTick} x1={tickStart[0]} y1={tickStart[1]} x2={tickEnd[0]} y2={tickEnd[1]} />
              <text className={styles.targetLabel} x={labelAt[0]} y={labelAt[1]} textAnchor={anchor}>
                <tspan x={labelAt[0]} dy="-0.25em">{t.chartTarget}</tspan>
                <tspan x={labelAt[0]} dy="1.2em" className={styles.targetValue}>
                  {targetFormatted}
                </tspan>
              </text>
            </g>
          ) : null}
          <text className={styles.centerValue} x={r2(cxPos)} y={r2(cy - (label ? 20 : 4))} textAnchor="middle">
            {formatter.format(raw)}
          </text>
          {label ? (
            <text className={styles.centerLabel} x={r2(cxPos)} y={r2(cy - 2)} textAnchor="middle">
              {label}
            </text>
          ) : null}
          <text className={styles.scaleLabel} x={r2(cxPos - scaleOffset)} y={r2(cy + 16)} textAnchor="middle">
            {formatter.format(lo)}
          </text>
          <text className={styles.scaleLabel} x={r2(cxPos + scaleOffset)} y={r2(cy + 16)} textAnchor="middle">
            {formatter.format(hi)}
          </text>
        </svg>
      </div>
    </ChartFrame>
  );
});
