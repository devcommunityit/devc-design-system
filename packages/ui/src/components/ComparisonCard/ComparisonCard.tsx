import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import styles from './ComparisonCard.module.css';

export interface ComparisonPeriod {
  /** Period name, e.g. "This month". */
  label: ReactNode;
  value: number;
}

export interface ComparisonCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Name of the metric. */
  label: ReactNode;
  current: ComparisonPeriod;
  previous: ComparisonPeriod;
  /** Intl.NumberFormat options for both values (and for the absolute delta when `previous` is 0). */
  formatOptions?: Intl.NumberFormatOptions;
  /** Whether an increase is good news. @default true */
  higherIsBetter?: boolean;
  /** Context such as source or note. */
  description?: ReactNode;
  /** When set, the label is rendered as a heading of this level. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Two-period comparison: current and previous value with proportional bars and a delta badge
 * whose direction is spelled out for screen readers.
 */
export const ComparisonCard = forwardRef<HTMLDivElement, ComparisonCardProps>(function ComparisonCard(
  { label, current, previous, formatOptions, higherIsBetter = true, description, headingLevel, className, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const deltaFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { ...formatOptions, signDisplay: 'exceptZero' }),
    [locale, formatOptions],
  );
  const percentFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }),
    [locale],
  );

  const now = Number.isFinite(current.value) ? current.value : 0;
  const before = Number.isFinite(previous.value) ? previous.value : 0;
  const diff = now - before;
  const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
  const sentiment = direction === 'neutral' ? 'neutral' : (direction === 'up') === higherIsBetter ? 'positive' : 'negative';
  // With a zero baseline a percentage is undefined: show the absolute difference instead.
  const delta = before !== 0 ? percentFormatter.format(diff / Math.abs(before)) : deltaFormatter.format(diff);
  const directionText = direction === 'up' ? t.trendUp : direction === 'down' ? t.trendDown : t.trendNeutral;
  const DeltaIcon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : ArrowRight;
  const max = Math.max(Math.abs(now), Math.abs(before));
  const ratio = (v: number) => (max > 0 ? Math.abs(v) / max : 0);
  const Label = headingLevel ? (`h${headingLevel}` as const) : 'span';

  const rows = [
    { key: 'current', period: current, value: now },
    { key: 'previous', period: previous, value: before },
  ] as const;

  return (
    <div ref={ref} data-direction={direction} data-sentiment={sentiment} className={cx(styles.comparison, className)} {...rest}>
      <div className={styles.top}>
        <Label className={styles.label}>{label}</Label>
        <span className={styles.delta} data-sentiment={sentiment}>
          <DeltaIcon aria-hidden="true" className={styles.deltaIcon} />
          <span className={styles.srOnly}>{directionText} </span>
          {delta}
        </span>
      </div>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.key} className={styles.row} data-period={row.key}>
            <dt className={styles.period}>{row.period.label}</dt>
            <dd className={styles.value}>
              <span className={styles.number}>{formatter.format(row.value)}</span>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.bar} style={{ '--_ratio': ratio(row.value) } as CSSVariables} />
              </span>
            </dd>
          </div>
        ))}
      </dl>
      {description ? <div className={styles.description}>{description}</div> : null}
    </div>
  );
});
