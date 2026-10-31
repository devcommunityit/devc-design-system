import { forwardRef, useId, useState, type KeyboardEvent } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import {
  ChartFrame,
  ChartPlot,
  GradientDefs,
  Swatch,
  estimateTextWidth,
  extent,
  seriesStyle,
  svgId,
  vividSeriesStyle,
  useElementWidth,
  useNumberFormatter,
  type ChartBaseProps,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './HeatmapChart.module.css';

export interface HeatmapChartProps extends ChartBaseProps {
  /** Row labels, top to bottom. */
  rows: string[];
  /** Column labels, left to right. */
  columns: string[];
  /** Matrix of values: `values[r][c]` belongs to `rows[r]` × `columns[c]`; `null` is an empty cell. */
  values: Array<Array<number | null>>;
  /** Height of each row in px (the width follows the container). @default 32 */
  cellHeight?: number;
  /** 0-based data color (`--dc-color-data-1…6`, cycling) used for the intensity scale. @default 0 */
  colorIndex?: number;
  /** Color scale from the minimum to the maximum value, with formatted bounds. @default true */
  showLegend?: boolean;
}

interface Cell {
  r: number;
  c: number;
}

const MIN_OPACITY = 0.12;

/**
 * Heatmap in SVG (no dependencies): a rows × columns grid whose cells get more intense as the
 * value grows. Arrow keys move across cells in two dimensions; a toggle reveals the data as a table.
 */
export const HeatmapChart = forwardRef<HTMLElement, HeatmapChartProps>(function HeatmapChart(
  { rows, columns, values, title, description, formatOptions, cellHeight = 32, colorIndex = 0, showLegend = true, className, ...rest },
  ref,
) {
  const t = useMessages();
  const titleId = useId();
  const prefix = svgId(useId());
  const formatter = useNumberFormatter(formatOptions);
  const { ref: plotRef, width } = useElementWidth<HTMLDivElement>();
  const [rawActive, setActive] = useState<Cell | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const hasTitle = title !== undefined && title !== null && title !== '';

  const valueAt = (r: number, c: number): number | null => {
    const v = values[r]?.[c];
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  };
  const format = (v: number | null) => (v === null ? '—' : formatter.format(v));
  const describe = ({ r, c }: Cell) => `${rows[r] ?? ''} · ${columns[c] ?? ''}: ${format(valueAt(r, c))}`;
  const nRows = rows.length;
  const nCols = columns.length;
  const active = rawActive && rawActive.r < nRows && rawActive.c < nCols ? rawActive : null;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (nRows === 0 || nCols === 0) return;
    const current = active ?? { r: 0, c: 0 };
    let next: Cell;
    switch (event.key) {
      case 'ArrowRight':
        next = active ? { r: current.r, c: Math.min(nCols - 1, current.c + 1) } : current;
        break;
      case 'ArrowLeft':
        next = active ? { r: current.r, c: Math.max(0, current.c - 1) } : current;
        break;
      case 'ArrowDown':
        next = active ? { r: Math.min(nRows - 1, current.r + 1), c: current.c } : current;
        break;
      case 'ArrowUp':
        next = active ? { r: Math.max(0, current.r - 1), c: current.c } : current;
        break;
      case 'Home':
        next = { r: current.r, c: 0 };
        break;
      case 'End':
        next = { r: current.r, c: nCols - 1 };
        break;
      case 'Escape':
        if (active) {
          event.preventDefault();
          setActive(null);
        }
        return;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    setAnnouncement(describe(next));
  };

  const [lo, hi] = extent(values.flat());
  const intensity = (v: number) => (hi > lo ? MIN_OPACITY + ((v - lo) / (hi - lo)) * (1 - MIN_OPACITY) : 1);
  const marginStart = Math.max(0, ...rows.map((r) => estimateTextWidth(r))) + 12;
  const marginTop = 24;
  const marginEnd = 2;
  const plotWidth = Math.max(1, width - marginStart - marginEnd);
  const cellWidth = nCols > 0 ? plotWidth / nCols : plotWidth;
  const height = marginTop + nRows * cellHeight + 2;
  const labelWidth = Math.max(0, ...columns.map((c) => estimateTextWidth(c)));
  const labelEvery = Math.max(1, Math.ceil((labelWidth + 8) / Math.max(1, cellWidth)));
  const xAt = (c: number) => marginStart + c * cellWidth;
  const yAt = (r: number) => marginTop + r * cellHeight;
  const gap = 1;

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.heatmapChart, className)}
      legend={
        showLegend && values.some((row) => row.some((v) => typeof v === 'number' && Number.isFinite(v))) ? (
          <div className={styles.scale} style={seriesStyle(colorIndex)}>
            <span className={styles.scaleLabel}>{formatter.format(lo)}</span>
            <span className={styles.scaleBar} aria-hidden="true" />
            <span className={styles.scaleLabel}>{formatter.format(hi)}</span>
          </div>
        ) : null
      }
      table={{
        columns,
        rows: rows.map((row, r) => ({ key: `${r}`, header: row, cells: columns.map((_, c) => format(valueAt(r, c))) })),
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
          active ? (
            <span className={chart.readoutItem}>
              <Swatch index={colorIndex} kind="fill" />
              <span className={chart.readoutTitle}>
                {rows[active.r]} · {columns[active.c]}
              </span>
              <span className={chart.readoutValue}>{format(valueAt(active.r, active.c))}</span>
            </span>
          ) : null
        }
      >
        <svg className={chart.svg} viewBox={`0 0 ${width} ${height}`} height={height} aria-hidden="true" focusable="false">
          <GradientDefs prefix={prefix} indexes={[colorIndex]} direction="diagonal" stopBaseClassName={chart.stopBase} stopVividClassName={chart.stopVivid} />
          {columns.map((c, i) =>
            i % labelEvery === 0 ? (
              <text key={`col-${i}`} className={chart.tickLabel} x={xAt(i) + cellWidth / 2} y={marginTop - 8} textAnchor="middle" data-active={active?.c === i || undefined}>
                {c}
              </text>
            ) : null,
          )}
          {rows.map((row, r) => (
            <text key={`row-${r}`} className={chart.tickLabel} x={marginStart - 8} y={yAt(r) + cellHeight / 2} textAnchor="end" dominantBaseline="middle" data-active={active?.r === r || undefined}>
              {row}
            </text>
          ))}
          <g style={vividSeriesStyle(prefix, colorIndex)}>
            {rows.map((row, r) =>
              columns.map((col, c) => {
                const v = valueAt(r, c);
                const x = xAt(c) + gap;
                const y = yAt(r) + gap;
                const w = Math.max(0, cellWidth - gap * 2);
                const h = Math.max(0, cellHeight - gap * 2);
                return (
                  <g key={`${r}-${c}`} data-cell={`${r}-${c}`} data-empty={v === null || undefined} onPointerEnter={() => setActive({ r, c })}>
                    <rect className={styles.cellBase} x={x} y={y} width={w} height={h} />
                    {v === null ? (
                      <line className={styles.empty} x1={x + w / 2 - 4} x2={x + w / 2 + 4} y1={y + h / 2} y2={y + h / 2} />
                    ) : (
                      <rect className={cx(chart.fill, styles.cell)} x={x} y={y} width={w} height={h} fillOpacity={Math.round(intensity(v) * 1000) / 1000} />
                    )}
                  </g>
                );
              }),
            )}
          </g>
          {active ? (
            <rect
              className={styles.activeCell}
              x={xAt(active.c) + gap / 2}
              y={yAt(active.r) + gap / 2}
              width={Math.max(0, cellWidth - gap)}
              height={Math.max(0, cellHeight - gap)}
            />
          ) : null}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
