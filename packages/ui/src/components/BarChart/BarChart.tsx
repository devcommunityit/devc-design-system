import { forwardRef, useId, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import {
  ChartFrame,
  ChartPlot,
  PatternDefs,
  Swatch,
  estimateTextWidth,
  extent,
  niceTicks,
  patternFill,
  scaleLinear,
  seriesStyle,
  svgId,
  useChartNavigation,
  useElementWidth,
  useNumberFormatter,
  type ChartBaseProps,
  type ChartSeries,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './BarChart.module.css';

const NO_IDS: string[] = [];

export interface BarChartProps extends ChartBaseProps {
  /** Categories (one bar group each), in order. */
  categories: string[];
  /** One or more series; `data[i]` belongs to `categories[i]`, `null` draws no bar. */
  series: ChartSeries[];
  /** Vertical columns or horizontal bars (better for long category names). @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Series side by side or stacked (positive and negative values stack separately). @default 'grouped' */
  layout?: 'grouped' | 'stacked';
  /** Plot height in px; for horizontal bars defaults to 40 px per category (min 160). @default 240 */
  height?: number;
  /** Grid lines at the value ticks. @default true */
  showGrid?: boolean;
  /** Legend below the plot; with several series its items toggle visibility. @default true */
  showLegend?: boolean;
  hiddenSeries?: string[];
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
}

interface BarRect {
  key: string;
  index: number;
  b0: number;
  bw: number;
  v0: number;
  v1: number;
}

function truncate(text: string, maxWidth: number): string {
  if (estimateTextWidth(text) <= maxWidth) return text;
  const chars = Math.max(1, Math.floor(maxWidth / estimateTextWidth('M')) - 1);
  return `${text.slice(0, chars)}…`;
}

/**
 * Bar chart in SVG (no dependencies): vertical or horizontal, grouped or stacked. Series differ by
 * color and texture; the plot is keyboard navigable and a toggle reveals the data as a table.
 */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  {
    categories,
    series,
    orientation = 'vertical',
    layout = 'grouped',
    title,
    description,
    height: heightProp,
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
  const prefix = svgId(useId());
  const formatter = useNumberFormatter(formatOptions);
  const { ref: plotRef, width } = useElementWidth<HTMLDivElement>();
  const [hidden, setHidden] = useControllableState(hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange, 'hiddenSeries');
  const visible = series.map((s, index) => ({ s, index })).filter(({ s }) => !hidden.includes(s.id));
  const format = (v: number | null | undefined) => (typeof v === 'number' ? formatter.format(v) : '—');
  const describe = (i: number) => `${categories[i] ?? ''}: ${visible.map(({ s }) => `${s.label} ${format(s.data[i])}`).join(', ')}`;
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(categories.length, describe);
  const hasTitle = title !== undefined && title !== null && title !== '';
  const vertical = orientation === 'vertical';
  const stacked = layout === 'stacked';
  const n = categories.length;
  const height = heightProp ?? (vertical ? 240 : Math.max(160, n * 40 + 36));

  let lo = 0;
  let hi = 0;
  if (stacked) {
    categories.forEach((_, i) => {
      let pos = 0;
      let neg = 0;
      for (const { s } of visible) {
        const v = s.data[i];
        if (typeof v !== 'number') continue;
        if (v >= 0) pos += v;
        else neg += v;
      }
      lo = Math.min(lo, neg);
      hi = Math.max(hi, pos);
    });
  } else {
    const [a, b] = extent(visible.flatMap(({ s }) => s.data));
    lo = Math.min(0, a);
    hi = Math.max(0, b);
  }
  const domain = niceTicks(lo, hi, vertical ? Math.max(3, Math.round(height / 56)) : Math.max(3, Math.round(width / 110)));
  const tickLabels = domain.ticks.map((v) => formatter.format(v));
  const tickWidth = Math.max(0, ...tickLabels.map((l) => estimateTextWidth(l)));
  const categoryWidth = Math.max(0, ...categories.map((c) => estimateTextWidth(c)));

  const marginTop = 8;
  const marginBottom = 28;
  const marginStart = vertical ? tickWidth + 12 : Math.min(Math.round(width * 0.4), categoryWidth + 12);
  const marginEnd = vertical ? 12 : Math.max(12, estimateTextWidth(tickLabels[tickLabels.length - 1] ?? '') / 2 + 4);
  const plotWidth = Math.max(1, width - marginStart - marginEnd);
  const plotHeight = Math.max(1, height - marginTop - marginBottom);
  const bottom = marginTop + plotHeight;
  const bandSize = (vertical ? plotWidth : plotHeight) / Math.max(1, n);
  const bandStart = (i: number) => (vertical ? marginStart : marginTop) + i * bandSize;
  const valueAt = vertical ? scaleLinear([domain.min, domain.max], [bottom, marginTop]) : scaleLinear([domain.min, domain.max], [marginStart, marginStart + plotWidth]);
  const zero = valueAt(Math.min(Math.max(0, domain.min), domain.max));
  const labelEvery = vertical ? Math.max(1, Math.ceil((categoryWidth + 8) / Math.max(1, bandSize))) : Math.max(1, Math.ceil(16 / Math.max(1, bandSize)));

  const bars: BarRect[] = [];
  categories.forEach((_, i) => {
    if (stacked) {
      const bw = bandSize * 0.6;
      const b0 = bandStart(i) + (bandSize - bw) / 2;
      let pos = 0;
      let neg = 0;
      for (const { s, index } of visible) {
        const v = s.data[i];
        if (typeof v !== 'number' || v === 0) continue;
        const from = v > 0 ? pos : neg;
        const to = from + v;
        if (v > 0) pos = to;
        else neg = to;
        bars.push({ key: `${s.id}-${i}`, index, b0, bw, v0: valueAt(from), v1: valueAt(to) });
      }
    } else {
      const group = bandSize * 0.72;
      const bw = group / Math.max(1, visible.length);
      const gap = bw > 6 ? 1 : 0;
      visible.forEach(({ s, index }, k) => {
        const v = s.data[i];
        if (typeof v !== 'number') return;
        bars.push({ key: `${s.id}-${i}`, index, b0: bandStart(i) + (bandSize - group) / 2 + k * bw + gap, bw: Math.max(1, bw - gap * 2), v0: zero, v1: valueAt(v) });
      });
    }
  });

  const rectProps = (b0: number, bw: number, v0: number, v1: number) =>
    vertical
      ? { x: b0, width: bw, y: Math.min(v0, v1), height: Math.abs(v1 - v0) }
      : { y: b0, height: bw, x: Math.min(v0, v1), width: Math.abs(v1 - v0) };
  const plotRect = (i: number) =>
    vertical
      ? { x: bandStart(i), width: bandSize, y: marginTop, height: plotHeight }
      : { y: bandStart(i), height: bandSize, x: marginStart, width: plotWidth };

  let valueAxis: ReactNode;
  let categoryAxis: ReactNode;
  if (vertical) {
    valueAxis = domain.ticks.map((v, i) => (
      <g key={v}>
        {showGrid ? <line className={chart.gridLine} x1={marginStart} x2={marginStart + plotWidth} y1={valueAt(v)} y2={valueAt(v)} /> : null}
        <text className={chart.tickLabel} x={marginStart - 8} y={valueAt(v)} textAnchor="end" dominantBaseline="middle">
          {tickLabels[i]}
        </text>
      </g>
    ));
    categoryAxis = categories.map((c, i) =>
      i % labelEvery === 0 ? (
        <text key={i} className={chart.tickLabel} x={bandStart(i) + bandSize / 2} y={bottom + 18} textAnchor="middle">
          {c}
        </text>
      ) : null,
    );
  } else {
    valueAxis = domain.ticks.map((v, i) => (
      <g key={v}>
        {showGrid ? <line className={chart.gridLine} x1={valueAt(v)} x2={valueAt(v)} y1={marginTop} y2={bottom} /> : null}
        <text className={chart.tickLabel} x={valueAt(v)} y={bottom + 18} textAnchor="middle">
          {tickLabels[i]}
        </text>
      </g>
    ));
    categoryAxis = categories.map((c, i) =>
      i % labelEvery === 0 ? (
        <text key={i} className={chart.tickLabel} x={marginStart - 8} y={bandStart(i) + bandSize / 2} textAnchor="end" dominantBaseline="middle">
          {truncate(c, marginStart - 12)}
        </text>
      ) : null,
    );
  }

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      data-orientation={orientation}
      data-layout={layout}
      className={cx(styles.barChart, className)}
      legend={
        showLegend ? (
          <ChartLegend
            items={series.map((s, i) => ({ id: s.id, label: s.label, colorIndex: i }))}
            swatch="fill"
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
                  <Swatch index={index} kind="fill" />
                  {s.label}
                  <span className={chart.readoutValue}>{format(s.data[active])}</span>
                </span>
              ))}
            </>
          ) : null
        }
      >
        <svg className={chart.svg} viewBox={`0 0 ${width} ${height}`} height={height} aria-hidden="true" focusable="false">
          <PatternDefs prefix={prefix} className={chart.patternStroke} />
          {active !== null ? <rect className={chart.activeBand} {...plotRect(active)} /> : null}
          {valueAxis}
          {categoryAxis}
          {bars.map((bar) => {
            const geometry = rectProps(bar.b0, bar.bw, bar.v0, bar.v1);
            const texture = patternFill(prefix, bar.index);
            return (
              <g key={bar.key} style={seriesStyle(bar.index)}>
                <rect className={chart.fill} {...geometry} />
                {texture ? <rect className={chart.patternOverlay} fill={texture} {...geometry} /> : null}
              </g>
            );
          })}
          {vertical ? (
            <line className={chart.axisLine} x1={marginStart} x2={marginStart + plotWidth} y1={zero} y2={zero} />
          ) : (
            <line className={chart.axisLine} x1={zero} x2={zero} y1={marginTop} y2={bottom} />
          )}
          {categories.map((c, i) => (
            <rect key={c + i} className={chart.hit} {...plotRect(i)} onPointerEnter={() => setActive(i)} />
          ))}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
