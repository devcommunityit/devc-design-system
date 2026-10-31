import { forwardRef, useId, useMemo } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import {
  ChartFrame,
  ChartPlot,
  GradientDefs,
  Swatch,
  estimateTextWidth,
  svgId,
  vividSeriesStyle,
  useChartNavigation,
  useElementWidth,
  useNumberFormatter,
  type ChartBaseProps,
} from '../charts-internal';
import chart from '../charts-internal/Chart.module.css';
import styles from './FunnelChart.module.css';

export interface FunnelChartDatum {
  id: string;
  label: string;
  /** Non-negative value; negative values are treated as 0. */
  value: number;
}

export interface FunnelChartProps extends ChartBaseProps {
  /** Steps from the top of the funnel (first step = 100% conversion). */
  data: FunnelChartDatum[];
  /** Height of each step in px. @default 44 */
  height?: number;
}

function truncate(text: string, maxWidth: number, fontSize: number): string {
  if (estimateTextWidth(text, fontSize) <= maxWidth) return text;
  const chars = Math.max(1, Math.floor(maxWidth / estimateTextWidth('M', fontSize)) - 1);
  return `${text.slice(0, chars)}…`;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Funnel chart in SVG (no dependencies): one centered bar per step, proportional to the first
 * step, with value and conversion rate. Arrow keys move between steps.
 */
export const FunnelChart = forwardRef<HTMLElement, FunnelChartProps>(function FunnelChart(
  { data, title, description, formatOptions, height = 44, className, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const prefix = svgId(useId());
  const { ref: plotRef, width } = useElementWidth<HTMLDivElement>();
  const formatter = useNumberFormatter(formatOptions);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }), [locale]);
  const values = data.map((d) => (Number.isFinite(d.value) ? Math.max(0, d.value) : 0));
  const first = values[0] ?? 0;
  const conversion = (i: number) => (first > 0 ? (values[i] ?? 0) / first : 0);
  const describe = (i: number) => `${data[i]?.label ?? ''}: ${formatter.format(values[i] ?? 0)}, ${t.chartConversion}: ${percent.format(conversion(i))}`;
  const { active, setActive, onKeyDown, announcement } = useChartNavigation(data.length, describe);
  const hasTitle = title !== undefined && title !== null && title !== '';

  const fontSize = 13;
  const stepHeight = Math.max(16, height);
  const gap = Math.max(6, Math.round(stepHeight * 0.3));
  const n = data.length;
  const svgHeight = Math.max(0, n * stepHeight + (n - 1) * gap);
  const valueTexts = values.map((v) => formatter.format(v));
  const percentTexts = values.map((_, i) => percent.format(conversion(i)));
  const labelWidth = Math.min(Math.round(width * 0.3), Math.max(0, ...data.map((d) => estimateTextWidth(d.label, fontSize))) + 12);
  const valueWidth = Math.min(
    Math.round(width * 0.3),
    Math.max(0, ...values.map((_, i) => estimateTextWidth(`${valueTexts[i]} ${percentTexts[i]}`, fontSize))) + 12,
  );
  const plotStart = labelWidth;
  const plotWidth = Math.max(1, width - labelWidth - valueWidth);
  const scaleMax = Math.max(first, ...values);
  const bars = values.map((v, i) => {
    const w = scaleMax > 0 ? Math.max(v > 0 ? 2 : 0, (v / scaleMax) * plotWidth) : 0;
    const x = plotStart + (plotWidth - w) / 2;
    const y = i * (stepHeight + gap);
    return { x, y, w };
  });

  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      titleId={titleId}
      className={cx(styles.funnelChart, className)}
      table={{
        columns: [t.chartValue, t.chartConversion],
        rows: data.map((d, i) => ({ key: d.id, header: d.label, cells: [valueTexts[i], percentTexts[i]] })),
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
          active !== null && data[active] ? (
            <span className={chart.readoutItem}>
              <Swatch index={active} kind="fill" />
              <span className={chart.readoutTitle}>{data[active].label}</span>
              <span className={chart.readoutValue}>{valueTexts[active]}</span>
              <span>
                {t.chartConversion}: {percentTexts[active]}
              </span>
            </span>
          ) : null
        }
      >
        <svg className={chart.svg} viewBox={`0 0 ${width} ${svgHeight}`} height={svgHeight} aria-hidden="true" focusable="false">
          <GradientDefs prefix={prefix} indexes={data.map((_, i) => i)} direction="horizontal" stopBaseClassName={chart.stopBase} stopVividClassName={chart.stopVivid} />
          {data.map((d, i) => {
            const bar = bars[i];
            if (!bar) return null;
            const next = bars[i + 1];
            const bottom = bar.y + stepHeight;
            const isActive = active === i;
            return (
              <g key={d.id} style={vividSeriesStyle(prefix, i)} data-active={isActive || undefined} onPointerEnter={() => setActive(i)}>
                {isActive ? <rect className={chart.activeBand} x={0} y={bar.y} width={width} height={stepHeight} rx={4} /> : null}
                {next ? (
                  <polygon
                    className={styles.connector}
                    points={`${r2(bar.x)},${r2(bottom)} ${r2(bar.x + bar.w)},${r2(bottom)} ${r2(next.x + next.w)},${r2(next.y)} ${r2(next.x)},${r2(next.y)}`}
                  />
                ) : null}
                {bar.w > 0 ? <rect className={cx(chart.fill, styles.bar)} x={r2(bar.x)} y={bar.y} width={r2(bar.w)} height={stepHeight} /> : null}
                <text className={styles.label} x={0} y={bar.y + stepHeight / 2} dy="0.35em">
                  {truncate(d.label, labelWidth - 12, fontSize)}
                </text>
                <text className={styles.value} x={width} y={bar.y + stepHeight / 2} dy="0.35em" textAnchor="end">
                  <tspan className={styles.amount}>{valueTexts[i]}</tspan> <tspan className={styles.conversion}>{percentTexts[i]}</tspan>
                </text>
                <rect className={chart.hit} x={0} y={bar.y} width={width} height={stepHeight} />
              </g>
            );
          })}
        </svg>
      </ChartPlot>
    </ChartFrame>
  );
});
