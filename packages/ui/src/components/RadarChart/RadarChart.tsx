import { forwardRef, useId } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState, type CSSVariables } from '../../utils';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import {
  ChartFrame,
  ChartPlot,
  GradientDefs,
  Swatch,
  estimateTextWidth,
  extent,
  markerPath,
  markerShape,
  niceTicks,
  seriesDash,
  svgId,
  vividSeriesStyle,
  useChartNavigation,
  useNumberFormatter,
  type ChartBaseProps,
  type ChartSeries,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './RadarChart.module.css';

const NO_IDS: string[] = [];
const RINGS = 4;

export interface RadarChartProps extends ChartBaseProps {
  /** Categories placed around the chart, clockwise from 12 o'clock (at least 3). */
  axes: string[];
  /** One or more series; `data[i]` belongs to `axes[i]`, `null` skips that axis. */
  series: ChartSeries[];
  /** Value of the outer ring. @default nice maximum of the visible data */
  max?: number;
  /** Maximum diameter of the plot in px (the chart shrinks with its container). @default 280 */
  size?: number;
  /** Legend below the plot; with several series its items toggle visibility. @default true */
  showLegend?: boolean;
  /** Hidden series ids (controlled). */
  hiddenSeries?: string[];
  /** Initially hidden series ids (uncontrolled). @default [] */
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
}

type Pt = [number, number];
const round = (n: number) => Math.round(n * 100) / 100;
const polygon = (pts: readonly Pt[]) => (pts.length ? `M${pts.map(([x, y]) => `${round(x)},${round(y)}`).join('L')}Z` : '');

/**
 * Radar (spider) chart in SVG (no dependencies): one polygon per series over 3+ axes. Arrow keys
 * move between axes and read every visible series; a toggle reveals the data as a table.
 */
export const RadarChart = forwardRef<HTMLElement, RadarChartProps>(function RadarChart(
  {
    axes,
    series,
    title,
    description,
    formatOptions,
    max,
    size = 280,
    showLegend = true,
    hiddenSeries,
    defaultHiddenSeries = NO_IDS,
    onHiddenSeriesChange,
    className,
    style,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const titleId = useId();
  const prefix = svgId(useId());
  const formatter = useNumberFormatter(formatOptions);
  const [hidden, setHidden] = useControllableState(hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange, 'hiddenSeries');
  const visible = series.map((s, index) => ({ s, index })).filter(({ s }) => !hidden.includes(s.id));
  const format = (v: number | null | undefined) => (typeof v === 'number' ? formatter.format(v) : '—');
  const describe = (i: number) => `${axes[i] ?? ''}: ${visible.map(({ s }) => `${s.label} ${format(s.data[i])}`).join(', ')}`;
  const n = axes.length;
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(n, describe, { wrap: true });
  const hasTitle = title !== undefined && title !== null && title !== '';

  const [, hi] = extent(visible.flatMap(({ s }) => s.data));
  const top = typeof max === 'number' && max > 0 ? max : niceTicks(0, Math.max(0, hi), RINGS + 1).max;
  const radius = size / 2;
  const padX = Math.max(24, ...axes.map((a) => estimateTextWidth(a) + 14));
  const padY = 28;
  const cx0 = radius + padX;
  const cy0 = radius + padY;
  const width = cx0 * 2;
  const height = cy0 * 2;
  const angleAt = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / Math.max(1, n);
  const polar = (a: number, r: number): Pt => [cx0 + r * Math.cos(a), cy0 + r * Math.sin(a)];
  const point = (i: number, r: number) => polar(angleAt(i), r);
  const rAt = (v: number) => (Math.min(Math.max(0, v), top) / (top || 1)) * radius;
  const rings = Array.from({ length: RINGS }, (_, k) => ((k + 1) / RINGS) * top);
  const half = Math.PI / Math.max(1, n);
  const rootStyle: CSSVariables = { ...style, '--_width': `${width}px` };

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.radarChart, className)}
      style={rootStyle}
      legend={
        showLegend ? (
          <ChartLegend
            items={series.map((s, i) => ({ id: s.id, label: s.label, colorIndex: i }))}
            isToggleable={series.length > 1}
            hiddenItems={hidden}
            onHiddenItemsChange={setHidden}
          />
        ) : null
      }
      table={{
        columns: series.map((s) => s.label),
        rows: axes.map((a, i) => ({ key: `${i}`, header: a, cells: series.map((s) => format(s.data[i])) })),
      }}
      {...rest}
    >
      <ChartPlot
        labelledBy={hasTitle ? titleId : undefined}
        fallbackLabel={t.chartData}
        onKeyDown={onKeyDown}
        onLeave={() => setActive(null)}
        announcement={announcement}
        readout={
          active !== null ? (
            <>
              <span className={chart.readoutTitle}>{axes[active]}</span>
              {visible.map(({ s, index }) => (
                <span key={s.id} className={chart.readoutItem}>
                  <Swatch index={index} />
                  {s.label}
                  <span className={chart.readoutValue}>{format(s.data[active])}</span>
                </span>
              ))}
            </>
          ) : null
        }
      >
        <svg className={cx(chart.svg, styles.svg)} viewBox={`0 0 ${round(width)} ${round(height)}`} aria-hidden="true" focusable="false">
          <GradientDefs
            prefix={prefix}
            kind="area"
            indexes={visible.map(({ index }) => index)}
            stopBaseClassName={chart.stopAreaBottom}
            stopVividClassName={chart.stopAreaTop}
          />
          {rings.map((v) => (
            <path key={v} className={cx(chart.gridLine, styles.ring)} d={polygon(axes.map((_, i) => point(i, rAt(v))))} />
          ))}
          {axes.map((a, i) => {
            const [x, y] = point(i, radius);
            return (
              <line
                key={`spoke-${i}`}
                className={cx(active === i ? chart.axisLine : chart.gridLine, styles.spoke)}
                x1={cx0}
                y1={cy0}
                x2={x}
                y2={y}
                data-active={active === i || undefined}
              />
            );
          })}
          {rings.map((v) => (
            <text key={`ring-${v}`} className={cx(chart.tickLabel, styles.ringLabel)} x={cx0 + 4} y={cy0 - rAt(v)} dominantBaseline="middle">
              {formatter.format(v)}
            </text>
          ))}
          {axes.map((a, i) => {
            const [x, y] = point(i, radius + 10);
            const cos = Math.cos(angleAt(i));
            const sin = Math.sin(angleAt(i));
            return (
              <text
                key={`label-${i}`}
                className={cx(chart.tickLabel, styles.axisLabel)}
                x={x}
                y={y}
                dy={sin < -0.5 ? '-0.2em' : sin > 0.5 ? '0.9em' : '0.35em'}
                textAnchor={Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end'}
                data-active={active === i || undefined}
              >
                {a}
              </text>
            );
          })}
          {visible.map(({ s, index }) => {
            const pts: Pt[] = [];
            s.data.forEach((v, i) => {
              if (i < n && typeof v === 'number' && Number.isFinite(v)) pts.push(point(i, rAt(v)));
            });
            const shape = markerShape(index);
            const d = pts.length > 1 ? polygon(pts) : '';
            return (
              <g key={s.id} style={vividSeriesStyle(prefix, index, ['area'])} data-series={s.id}>
                {d ? <path className={chart.area} d={d} /> : null}
                {d ? <path className={chart.line} d={d} strokeDasharray={seriesDash(index)} /> : null}
                {s.data.map((v, i) => {
                  if (i >= n || typeof v !== 'number' || !Number.isFinite(v)) return null;
                  const [x, y] = point(i, rAt(v));
                  return <path key={i} className={cx(chart.marker, active === i && chart.markerActive)} d={markerPath(shape, x, y, active === i ? 5 : 3.5)} />;
                })}
              </g>
            );
          })}
          {axes.map((a, i) => {
            const [x0, y0] = polar(angleAt(i) - half, radius + 10);
            const [x1, y1] = polar(angleAt(i) + half, radius + 10);
            return (
              <path
                key={`hit-${i}`}
                className={chart.hit}
                d={`M${round(cx0)},${round(cy0)}L${round(x0)},${round(y0)}L${round(x1)},${round(y1)}Z`}
                onPointerEnter={() => setActive(i)}
              />
            );
          })}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
