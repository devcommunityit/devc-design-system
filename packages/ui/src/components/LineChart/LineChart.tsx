import { forwardRef, useId } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import {
  ChartFrame,
  ChartPlot,
  Swatch,
  areaPath,
  estimateTextWidth,
  extent,
  linePath,
  markerPath,
  markerShape,
  niceTicks,
  scaleLinear,
  segments,
  seriesDash,
  seriesStyle,
  useChartNavigation,
  useElementWidth,
  useNumberFormatter,
  type ChartBaseProps,
  type ChartSeries,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './LineChart.module.css';

const NO_IDS: string[] = [];

export interface LineChartProps extends ChartBaseProps {
  /** X-axis categories (e.g. months), in order. */
  categories: string[];
  /** One or more series; `data[i]` belongs to `categories[i]`, `null` leaves a gap. */
  series: ChartSeries[];
  /** @default 'line' */
  variant?: 'line' | 'area';
  /** Plot height in px (the width follows the container). @default 240 */
  height?: number;
  /** Horizontal grid lines at the axis ticks. @default true */
  showGrid?: boolean;
  /** Legend below the plot; with several series its items toggle visibility. @default true */
  showLegend?: boolean;
  /** Hidden series ids (controlled). */
  hiddenSeries?: string[];
  /** Initially hidden series ids (uncontrolled). @default [] */
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
}

/**
 * Line or area chart in SVG (no dependencies). Series differ by color, dash pattern and marker
 * shape; the plot is keyboard navigable and a toggle reveals the data as a table.
 */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
  {
    categories,
    series,
    variant = 'line',
    title,
    description,
    height = 240,
    formatOptions,
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
  const formatter = useNumberFormatter(formatOptions);
  const { ref: plotRef, width } = useElementWidth<HTMLDivElement>();
  const [hidden, setHidden] = useControllableState(hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange, 'hiddenSeries');
  const visible = series.map((s, index) => ({ s, index })).filter(({ s }) => !hidden.includes(s.id));
  const format = (v: number | null | undefined) => (typeof v === 'number' ? formatter.format(v) : '—');
  const describe = (i: number) => `${categories[i] ?? ''}: ${visible.map(({ s }) => `${s.label} ${format(s.data[i])}`).join(', ')}`;
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(categories.length, describe);
  const hasTitle = title !== undefined && title !== null && title !== '';

  const [lo, hi] = extent(visible.flatMap(({ s }) => s.data));
  const domain = niceTicks(variant === 'area' ? Math.min(0, lo) : lo, variant === 'area' ? Math.max(0, hi) : hi, Math.max(3, Math.round(height / 56)));
  const tickLabels = domain.ticks.map((v) => formatter.format(v));
  const n = categories.length;
  const labelWidth = Math.max(0, ...categories.map((c) => estimateTextWidth(c)));
  const marginStart = Math.max(Math.max(0, ...tickLabels.map((l) => estimateTextWidth(l))) + 12, estimateTextWidth(categories[0] ?? '') / 2 + 4);
  const marginEnd = Math.max(12, estimateTextWidth(categories[n - 1] ?? '') / 2 + 4);
  const marginTop = 8;
  const marginBottom = 28;
  const plotWidth = Math.max(1, width - marginStart - marginEnd);
  const plotHeight = Math.max(1, height - marginTop - marginBottom);
  const step = n > 1 ? plotWidth / (n - 1) : plotWidth;
  const xAt = (i: number) => (n > 1 ? marginStart + i * step : marginStart + plotWidth / 2);
  const yAt = scaleLinear([domain.min, domain.max], [marginTop + plotHeight, marginTop]);
  const baseY = yAt(Math.min(Math.max(0, domain.min), domain.max));
  const labelEvery = Math.max(1, Math.ceil((labelWidth + 8) / Math.max(1, step)));
  const bottom = marginTop + plotHeight;

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      data-variant={variant}
      className={cx(styles.lineChart, className)}
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
        rows: categories.map((c, i) => ({ key: `${i}`, header: c, cells: series.map((s) => format(s.data[i])) })),
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
          active !== null ? (
            <>
              <span className={chart.readoutTitle}>{categories[active]}</span>
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
        <svg className={chart.svg} viewBox={`0 0 ${width} ${height}`} height={height} aria-hidden="true" focusable="false">
          {domain.ticks.map((v, i) => (
            <g key={v}>
              {showGrid ? <line className={chart.gridLine} x1={marginStart} x2={marginStart + plotWidth} y1={yAt(v)} y2={yAt(v)} /> : null}
              <text className={chart.tickLabel} x={marginStart - 8} y={yAt(v)} textAnchor="end" dominantBaseline="middle">
                {tickLabels[i]}
              </text>
            </g>
          ))}
          <line className={chart.axisLine} x1={marginStart} x2={marginStart + plotWidth} y1={bottom} y2={bottom} />
          {categories.map((c, i) =>
            i % labelEvery === 0 ? (
              <text key={i} className={chart.tickLabel} x={xAt(i)} y={bottom + 18} textAnchor="middle">
                {c}
              </text>
            ) : null,
          )}
          {active !== null ? <line className={chart.guide} x1={xAt(active)} x2={xAt(active)} y1={marginTop} y2={bottom} /> : null}
          {visible.map(({ s, index }) => {
            const runs = segments(s.data, xAt, yAt);
            const shape = markerShape(index);
            return (
              <g key={s.id} style={seriesStyle(index)} data-series={s.id}>
                {variant === 'area' ? <path className={chart.area} d={areaPath(runs, baseY)} /> : null}
                <path className={chart.line} d={linePath(runs)} strokeDasharray={seriesDash(index)} />
                {s.data.map((v, i) =>
                  typeof v === 'number' ? (
                    <path
                      key={i}
                      className={cx(chart.marker, active === i && chart.markerActive)}
                      d={markerPath(shape, xAt(i), yAt(v), active === i ? 5 : 3.5)}
                    />
                  ) : null,
                )}
              </g>
            );
          })}
          {categories.map((c, i) => {
            const x0 = Math.max(marginStart, xAt(i) - step / 2);
            const x1 = Math.min(marginStart + plotWidth, xAt(i) + step / 2);
            return <rect key={c + i} className={chart.hit} x={x0} y={marginTop} width={Math.max(0, x1 - x0)} height={plotHeight} onPointerEnter={() => setActive(i)} />;
          })}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
