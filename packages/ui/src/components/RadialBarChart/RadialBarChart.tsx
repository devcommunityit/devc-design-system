import { forwardRef, useId, useMemo } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import {
  ChartFrame,
  ChartPlot,
  GradientDefs,
  PatternDefs,
  Swatch,
  arcPath,
  patternFill,
  svgId,
  vividSeriesStyle,
  useChartNavigation,
  useNumberFormatter,
  type ChartBaseProps,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './RadialBarChart.module.css';

export interface RadialBarChartDatum {
  id: string;
  label: string;
  /** Non-negative value; negative values are treated as 0. */
  value: number;
  /** Full-ring value of this item (overrides the chart `max`). */
  max?: number;
}

export interface RadialBarChartProps extends ChartBaseProps {
  /** Rings from the outside in, in this order. */
  data: RadialBarChartDatum[];
  /** Value of a full ring, unless an item sets its own `max`. @default 100 */
  max?: number;
  /** Maximum diameter in px (the chart shrinks with its container). @default 220 */
  size?: number;
  /** Legend with values, maxima and percentages. @default true */
  showLegend?: boolean;
}

/**
 * Radial bar chart in SVG (no dependencies): concentric rings, each filled clockwise from 12
 * o'clock in proportion to value / max. Arrow keys move between rings.
 */
export const RadialBarChart = forwardRef<HTMLElement, RadialBarChartProps>(function RadialBarChart(
  { data, max = 100, title, description, formatOptions, size = 220, showLegend = true, className, style, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const prefix = svgId(useId());
  const formatter = useNumberFormatter(formatOptions);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }), [locale]);
  const items = data.map((d) => {
    const value = Number.isFinite(d.value) ? Math.max(0, d.value) : 0;
    const candidate = d.max ?? max;
    const full = Number.isFinite(candidate) && candidate > 0 ? candidate : 1;
    return { d, value, full, share: Math.min(1, value / full) };
  });
  const ratio = (i: number) => {
    const item = items[i];
    return item ? item.value / item.full : 0;
  };
  const valueText = (i: number) => {
    const item = items[i];
    return item ? `${formatter.format(item.value)} / ${formatter.format(item.full)} (${percent.format(ratio(i))})` : '';
  };
  const describe = (i: number) => `${data[i]?.label ?? ''}: ${valueText(i)}`;
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(data.length, describe);
  const hasTitle = title !== undefined && title !== null && title !== '';

  const pad = 6;
  const outer = size / 2;
  const n = Math.max(1, items.length);
  const available = outer * 0.74;
  const step = Math.min(available / n, (size * 0.11) / 0.78);
  const ring = step * 0.78;
  const c = outer + pad;
  const start = -Math.PI / 2;
  const rootStyle: CSSVariables = { ...style, '--_size': `${size}px` };

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.radialBarChart, className)}
      style={rootStyle}
      legend={
        showLegend ? <ChartLegend swatch="fill" items={data.map((d, i) => ({ id: d.id, label: d.label, colorIndex: i, value: valueText(i) }))} /> : null
      }
      table={{
        columns: [t.chartValue, t.chartTarget, '%'],
        rows: items.map(({ d, value, full }, i) => ({
          key: d.id,
          header: d.label,
          cells: [formatter.format(value), formatter.format(full), percent.format(ratio(i))],
        })),
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
          <GradientDefs prefix={prefix} indexes={data.map((_, i) => i)} direction="diagonal" stopBaseClassName={chart.stopBase} stopVividClassName={chart.stopVivid} />
          {items.map(({ d, share }, i) => {
            const ringOuter = outer - i * step;
            const ringInner = ringOuter - ring;
            const geometry = share > 0 ? arcPath(c, c, ringInner, ringOuter, start, start + share * Math.PI * 2) : '';
            const texture = patternFill(prefix, i);
            return (
              <g key={d.id} style={vividSeriesStyle(prefix, i)} data-active={active === i || undefined} onPointerEnter={() => setActive(i)}>
                <path className={styles.track} d={arcPath(c, c, ringInner, ringOuter, start, start + Math.PI * 2)} />
                {geometry ? <path className={cx(chart.fill, styles.bar)} d={geometry} /> : null}
                {geometry && texture ? <path className={chart.patternOverlay} fill={texture} d={geometry} /> : null}
              </g>
            );
          })}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
