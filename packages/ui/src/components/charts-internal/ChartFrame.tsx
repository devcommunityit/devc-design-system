import { forwardRef, useId, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import styles from './Chart.module.css';

export interface ChartTableRow {
  key: string;
  /** Row header (category or slice label). */
  header: ReactNode;
  /** Formatted cells, one per column. */
  cells: ReactNode[];
}

export interface ChartTableData {
  columns: ReactNode[];
  rows: ChartTableRow[];
}

/** Props shared by the public chart components. */
export interface ChartBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Visible title (figcaption); also names the plot and the data table. */
  title?: ReactNode;
  /** Visible description below the title. */
  description?: ReactNode;
  /** Intl.NumberFormat options for values and axis ticks (currency, percent, compact…). */
  formatOptions?: Intl.NumberFormatOptions;
}

export interface ChartFrameProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  titleId: string;
  legend?: ReactNode;
  table: ChartTableData;
  children: ReactNode;
}

/** `<figure>` with caption, plot, legend and a toggle revealing an accessible data table. */
export const ChartFrame = forwardRef<HTMLElement, ChartFrameProps>(function ChartFrame(
  { title, description, titleId, legend, table, className, children, ...rest },
  ref,
) {
  const t = useMessages();
  const tableId = useId();
  const [showTable, setShowTable] = useState(false);
  const hasTitle = title !== undefined && title !== null && title !== '';
  return (
    <figure ref={ref} className={cx(styles.figure, className)} {...rest}>
      {hasTitle || description ? (
        <figcaption className={styles.caption}>
          {hasTitle ? (
            <span id={titleId} className={styles.title}>
              {title}
            </span>
          ) : null}
          {description ? <span className={styles.description}>{description}</span> : null}
        </figcaption>
      ) : null}
      {children}
      <div className={styles.footer}>
        {legend}
        <Button
          variant="ghost"
          size="sm"
          className={styles.toggle}
          aria-expanded={showTable}
          aria-controls={tableId}
          onPress={() => setShowTable((v) => !v)}
        >
          {showTable ? t.hideChartData : t.showChartData}
        </Button>
      </div>
      <div className={styles.tableWrap} id={tableId} hidden={!showTable}>
        <table className={styles.table}>
          <caption>{hasTitle ? title : t.chartData}</caption>
          <thead>
            <tr>
              <th scope="col">{t.chartCategory}</th>
              {table.columns.map((column, i) => (
                <th key={i} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.header}</th>
                {row.cells.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
});

export interface ChartPlotProps {
  plotRef?: Ref<HTMLDivElement>;
  /** id of the visible title; when absent `fallbackLabel` names the plot. */
  labelledBy?: string;
  fallbackLabel: string;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onLeave: () => void;
  /** Visible, aria-hidden readout of the active item (the live region announces keyboard moves). */
  readout: ReactNode;
  announcement: string;
  className?: string;
  children: ReactNode;
}

/** Focusable plot area: role="group" named by the title, keyboard hint, readout and live region. */
export function ChartPlot({ plotRef, labelledBy, fallbackLabel, onKeyDown, onLeave, readout, announcement, className, children }: ChartPlotProps) {
  const t = useMessages();
  const hintId = useId();
  return (
    // Focusable composite: arrow keys move between data points (APG-style roving readout); the
    // group role exposes the name and hint. jsx-a11y does not model this custom keyboard widget.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={plotRef}
      role="group"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : fallbackLabel}
      aria-describedby={hintId}
      className={cx(styles.plot, className)}
      onKeyDown={onKeyDown}
      onBlur={onLeave}
      onPointerLeave={onLeave}
    >
      <div className={styles.readout} aria-hidden="true">
        {readout}
      </div>
      {children}
      <span id={hintId} className={styles.srOnly}>
        {t.chartKeyboardHint}
      </span>
      <span className={styles.srOnly} aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
