import { forwardRef, useId, useMemo } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import {
  ChartFrame,
  ChartPlot,
  PatternDefs,
  Swatch,
  arcPath,
  patternFill,
  seriesStyle,
  svgId,
  useChartNavigation,
  useNumberFormatter,
  type ChartBaseProps,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './DonutChart.module.css';

export interface DonutChartDatum {
  id: string;
  label: string;
  /** Non-negative value; negative values are treated as 0. */
  value: number;
}

export interface DonutChartProps extends ChartBaseProps {
  /** Slices, drawn clockwise from 12 o'clock in this order. */
  data: DonutChartDatum[];
  /** Maximum diameter in px (the chart shrinks with its container). @default 200 */
  size?: number;
  /** Ring thickness in px. @default 18% of size */
  thickness?: number;
  /** Text under the total in the center. @default messages.chartTotal */
  centerLabel?: string;
  /** Legend with values and percentages. @default true */
  showLegend?: boolean;
}

/**
 * Donut chart in SVG (no dependencies) with the total in the center. Slices differ by color and
 * texture; arrow keys move between slices and the legend lists values and percentages.
 */
export const DonutChart = forwardRef<HTMLElement, DonutChartProps>(function DonutChart(
  { data, title, description, formatOptions, size = 200, thickness, centerLabel, showLegend = true, className, style, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const prefix = svgId(useId());
  const formatter = useNumberFormatter(formatOptions);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }), [locale]);
  const values = data.map((d) => (Number.isFinite(d.value) ? Math.max(0, d.value) : 0));
  const total = values.reduce((sum, v) => sum + v, 0);
  const share = (i: number) => (total > 0 ? (values[i] ?? 0) / total : 0);
  const valueText = (i: number) => `${formatter.format(values[i] ?? 0)} (${percent.format(share(i))})`;
  const describe = (i: number) => `${data[i]?.label ?? ''}: ${valueText(i)}`;
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(data.length, describe, { wrap: true });
  const hasTitle = title !== undefined && title !== null && title !== '';

  const pad = 8;
  const outer = size / 2;
  const ring = Math.min(outer - 1, Math.max(4, thickness ?? Math.round(size * 0.18)));
  const inner = outer - ring;
  const c = outer + pad;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const a0 = angle;
    const a1 = angle + share(i) * Math.PI * 2;
    angle = a1;
    return { d, i, a0, a1 };
  });
  const rootStyle: CSSVariables = { ...style, '--_size': `${size}px` };

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.donutChart, className)}
      style={rootStyle}
      legend={
        showLegend ? (
          <ChartLegend swatch="fill" items={data.map((d, i) => ({ id: d.id, label: d.label, colorIndex: i, value: valueText(i) }))} />
        ) : null
      }
      table={{
        columns: [t.chartValue],
        rows: [
          ...data.map((d, i) => ({ key: d.id, header: d.label, cells: [valueText(i)] })),
          { key: '__total', header: centerLabel ?? t.chartTotal, cells: [formatter.format(total)] },
        ],
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
          active !== null && data[active] ? (
            <span className={chart.readoutItem}>
              <Swatch index={active} kind="fill" />
              <span className={chart.readoutTitle}>{data[active].label}</span>
              <span className={chart.readoutValue}>{valueText(active)}</span>
            </span>
          ) : null
        }
      >
        <svg className={cx(chart.svg, styles.svg)} viewBox={`0 0 ${c * 2} ${c * 2}`} aria-hidden="true" focusable="false">
          <PatternDefs prefix={prefix} className={chart.patternStroke} />
          <circle className={styles.track} cx={c} cy={c} r={outer - ring / 2} strokeWidth={ring} />
          {slices.map(({ d, i, a0, a1 }) => {
            if (a1 - a0 <= 0) return null;
            const geometry = arcPath(c, c, inner, active === i ? outer + pad - 2 : outer, a0, a1);
            const texture = patternFill(prefix, i);
            return (
              <g key={d.id} style={seriesStyle(i)} data-active={active === i || undefined} onPointerEnter={() => setActive(i)}>
                <path className={cx(chart.fill, styles.slice)} d={geometry} />
                {texture ? <path className={chart.patternOverlay} fill={texture} d={geometry} /> : null}
              </g>
            );
          })}
          <text className={styles.centerValue} x={c} y={c} dy="0.15em" textAnchor="middle">
            {formatter.format(total)}
          </text>
          <text className={styles.centerLabel} x={c} y={c} dy="1.6em" textAnchor="middle">
            {centerLabel ?? t.chartTotal}
          </text>
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
