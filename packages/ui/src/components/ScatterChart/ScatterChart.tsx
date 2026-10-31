import { forwardRef, useId } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
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
  scaleLinear,
  svgId,
  vividSeriesStyle,
  useChartNavigation,
  useElementWidth,
  useNumberFormatter,
  type ChartBaseProps,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './ScatterChart.module.css';

const NO_IDS: string[] = [];
const MIN_BUBBLE = 4;
const MAX_BUBBLE = 18;
const MARKER = 4;

export interface ScatterChartPoint {
  x: number;
  y: number;
  /** Name of the point (readout and data table); defaults to its 1-based position. */
  label?: string;
  /** Non-negative magnitude: turns the marker into a bubble whose area grows with the value. */
  size?: number;
}

export interface ScatterChartSeries {
  /** Stable id, used for legend toggling (`hiddenSeries`). */
  id: string;
  /** Visible name (legend, readout, data table). */
  label: string;
  points: ScatterChartPoint[];
}

export interface ScatterChartProps extends Omit<ChartBaseProps, 'formatOptions'> {
  series: ScatterChartSeries[];
  /** Title of the horizontal axis (also the data table column). */
  xLabel?: string;
  /** Title of the vertical axis (also the data table column). */
  yLabel?: string;
  /** Intl.NumberFormat options for x values and ticks. */
  xFormatOptions?: Intl.NumberFormatOptions;
  /** Intl.NumberFormat options for y values and ticks. */
  yFormatOptions?: Intl.NumberFormatOptions;
  /** Plot height in px (the width follows the container). @default 280 */
  height?: number;
  /** Grid lines at the axis ticks. @default true */
  showGrid?: boolean;
  /** Legend below the plot; with several series its items toggle visibility. @default true */
  showLegend?: boolean;
  /** Hidden series ids (controlled). */
  hiddenSeries?: string[];
  /** Initially hidden series ids (uncontrolled). @default [] */
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
}

interface PlacedPoint {
  key: string;
  series: ScatterChartSeries;
  index: number;
  pointIndex: number;
  point: ScatterChartPoint;
}

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Scatter / bubble chart in SVG (no dependencies) with two linear axes. Series differ by color and
 * marker shape; arrow keys move across points sorted by x and a toggle reveals the data as a table.
 */
export const ScatterChart = forwardRef<HTMLElement, ScatterChartProps>(function ScatterChart(
  {
    series,
    title,
    description,
    xLabel,
    yLabel,
    xFormatOptions,
    yFormatOptions,
    height = 280,
    showGrid = true,
    showLegend = true,
    hiddenSeries,
    defaultHiddenSeries = NO_IDS,
    onHiddenSeriesChange,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const titleId = useId();
  const prefix = svgId(useId());
  const xFormatter = useNumberFormatter(xFormatOptions);
  const yFormatter = useNumberFormatter(yFormatOptions);
  const { ref: plotRef, width } = useElementWidth<HTMLDivElement>();
  const [hidden, setHidden] = useControllableState(hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange, 'hiddenSeries');
  const hasTitle = title !== undefined && title !== null && title !== '';

  const visible = series.map((s, index) => ({ s, index })).filter(({ s }) => !hidden.includes(s.id));
  const points: PlacedPoint[] = visible
    .flatMap(({ s, index }) =>
      s.points.map((point, pointIndex) => ({ key: `${s.id}-${pointIndex}`, series: s, index, pointIndex, point })).filter(({ point }) => isFiniteNumber(point.x) && isFiniteNumber(point.y)),
    )
    .sort((a, b) => a.point.x - b.point.x || a.point.y - b.point.y);

  const pointName = (p: ScatterChartPoint, i: number) => p.label ?? `${i + 1}`;
  const xText = (v: number) => xFormatter.format(v);
  const yText = (v: number) => yFormatter.format(v);
  const valueText = (p: ScatterChartPoint) => `${xLabel ? `${xLabel} ` : ''}${xText(p.x)}, ${yLabel ? `${yLabel} ` : ''}${yText(p.y)}`;
  const describe = (i: number) => {
    const item = points[i];
    return item ? `${item.series.label} — ${pointName(item.point, item.pointIndex)}: ${valueText(item.point)}` : '';
  };
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(points.length, describe);
  const activePoint = active !== null ? points[active] : undefined;

  const [xLo, xHi] = extent(points.map((p) => p.point.x));
  const [yLo, yHi] = extent(points.map((p) => p.point.y));
  const xDomain = niceTicks(xLo, xHi, Math.max(3, Math.round(width / 96)));
  const yDomain = niceTicks(yLo, yHi, Math.max(3, Math.round(height / 56)));
  const xTicks = xDomain.ticks.map((v) => xText(v));
  const yTicks = yDomain.ticks.map((v) => yText(v));
  const sizes = series.flatMap((s) => s.points.map((p) => p.size)).filter((v): v is number => isFiniteNumber(v) && v >= 0);
  const maxSize = Math.max(0, ...sizes);
  const radiusOf = (p: ScatterChartPoint) =>
    isFiniteNumber(p.size) && p.size >= 0 ? (maxSize > 0 ? MIN_BUBBLE + Math.sqrt(p.size / maxSize) * (MAX_BUBBLE - MIN_BUBBLE) : MIN_BUBBLE) : MARKER;

  const yTitleSpace = yLabel ? 20 : 0;
  const marginStart = Math.max(0, ...yTicks.map((l) => estimateTextWidth(l))) + 12 + yTitleSpace;
  const marginEnd = Math.max(16, estimateTextWidth(xTicks[xTicks.length - 1] ?? '') / 2 + 4);
  const marginTop = sizes.length ? MAX_BUBBLE / 2 + 4 : 10;
  const marginBottom = 28 + (xLabel ? 18 : 0);
  const plotWidth = Math.max(1, width - marginStart - marginEnd);
  const plotHeight = Math.max(1, height - marginTop - marginBottom);
  const bottom = marginTop + plotHeight;
  const xAt = scaleLinear([xDomain.min, xDomain.max], [marginStart, marginStart + plotWidth]);
  const yAt = scaleLinear([yDomain.min, yDomain.max], [bottom, marginTop]);
  const tickWidth = Math.max(0, ...xTicks.map((l) => estimateTextWidth(l)));
  const tickStep = xDomain.ticks.length > 1 ? plotWidth / (xDomain.ticks.length - 1) : plotWidth;
  const labelEvery = Math.max(1, Math.ceil((tickWidth + 8) / Math.max(1, tickStep)));

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.scatterChart, className)}
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
        columns: [t.chartSeries, xLabel ?? 'x', yLabel ?? 'y'],
        rows: series.flatMap((s) =>
          s.points.map((p, i) => ({
            key: `${s.id}-${i}`,
            header: pointName(p, i),
            cells: [s.label, isFiniteNumber(p.x) ? xText(p.x) : '—', isFiniteNumber(p.y) ? yText(p.y) : '—'],
          })),
        ),
      }}
      {...rest}
    >
      <ChartPlot
        plotRef={plotRef}
        labelledBy={hasTitle ? titleId : undefined}
        fallbackLabel={t.chartData}
        onKeyDown={onKeyDown}
        onLeave={() => setActive(null)}
        announcement={announcement}
        readout={
          activePoint ? (
            <span className={chart.readoutItem}>
              <Swatch index={activePoint.index} />
              <span className={chart.readoutTitle}>
                {activePoint.series.label} — {pointName(activePoint.point, activePoint.pointIndex)}
              </span>
              <span className={chart.readoutValue}>{valueText(activePoint.point)}</span>
            </span>
          ) : null
        }
      >
        <svg className={chart.svg} viewBox={`0 0 ${width} ${height}`} height={height} aria-hidden="true" focusable="false">
          <GradientDefs prefix={prefix} indexes={visible.map(({ index }) => index)} direction="diagonal" stopBaseClassName={chart.stopBase} stopVividClassName={chart.stopVivid} />
          {yDomain.ticks.map((v, i) => (
            <g key={`y${v}`}>
              {showGrid ? <line className={chart.gridLine} x1={marginStart} x2={marginStart + plotWidth} y1={yAt(v)} y2={yAt(v)} /> : null}
              <text className={chart.tickLabel} x={marginStart - 8} y={yAt(v)} textAnchor="end" dominantBaseline="middle">
                {yTicks[i]}
              </text>
            </g>
          ))}
          {xDomain.ticks.map((v, i) => (
            <g key={`x${v}`}>
              {showGrid ? <line className={chart.gridLine} x1={xAt(v)} x2={xAt(v)} y1={marginTop} y2={bottom} /> : null}
              {i % labelEvery === 0 ? (
                <text className={chart.tickLabel} x={xAt(v)} y={bottom + 18} textAnchor="middle">
                  {xTicks[i]}
                </text>
              ) : null}
            </g>
          ))}
          <line className={chart.axisLine} x1={marginStart} x2={marginStart + plotWidth} y1={bottom} y2={bottom} />
          <line className={chart.axisLine} x1={marginStart} x2={marginStart} y1={marginTop} y2={bottom} />
          {xLabel ? (
            <text className={styles.axisTitle} x={marginStart + plotWidth / 2} y={height - 4} textAnchor="middle">
              {xLabel}
            </text>
          ) : null}
          {yLabel ? (
            <text className={styles.axisTitle} x={0} y={0} transform={`translate(12 ${marginTop + plotHeight / 2}) rotate(-90)`} textAnchor="middle">
              {yLabel}
            </text>
          ) : null}
          {activePoint ? (
            <g className={styles.crosshair}>
              <line className={chart.guide} x1={xAt(activePoint.point.x)} x2={xAt(activePoint.point.x)} y1={marginTop} y2={bottom} />
              <line className={chart.guide} x1={marginStart} x2={marginStart + plotWidth} y1={yAt(activePoint.point.y)} y2={yAt(activePoint.point.y)} />
            </g>
          ) : null}
          {visible.map(({ s, index }) => {
            const shape = markerShape(index);
            return (
              <g key={s.id} style={vividSeriesStyle(prefix, index)} data-series={s.id}>
                {points.map((item, i) =>
                  item.series === s ? (
                    <path
                      key={item.key}
                      className={cx(chart.marker, isFiniteNumber(item.point.size) && styles.bubble, active === i && chart.markerActive)}
                      d={markerPath(shape, xAt(item.point.x), yAt(item.point.y), radiusOf(item.point) + (active === i ? 1.5 : 0))}
                      onPointerEnter={() => setActive(i)}
                      data-active={active === i || undefined}
                    />
                  ) : null,
                )}
              </g>
            );
          })}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
