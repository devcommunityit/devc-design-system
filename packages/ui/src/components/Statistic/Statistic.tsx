import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Statistic.module.css';

export interface StatisticTrend {
  direction: 'up' | 'down' | 'neutral';
  /** Visible change, e.g. "+12%" or a formatted number. */
  value: ReactNode;
  /**
   * Whether the change is good, bad or neutral (independent from direction:
   * fewer errors is "down" but "positive"). @default up→positive, down→negative
   */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** Context such as "vs last month". */
  label?: ReactNode;
}

export interface StatisticProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** Numbers are formatted with Intl.NumberFormat and `formatOptions`; other nodes render as-is. `null` shows `emptyValue`. */
  value: number | ReactNode;
  formatOptions?: Intl.NumberFormatOptions;
  trend?: StatisticTrend;
  description?: ReactNode;
  icon?: ReactNode;
  /** @default '—' */
  emptyValue?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** Key metric with optional trend. The trend direction is spelled out for screen readers. */
export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  { label, value, formatOptions, trend, description, icon, emptyValue = '—', size = 'md', className, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const display = typeof value === 'number' ? formatter.format(value) : value === null || value === undefined || value === '' ? emptyValue : value;
  const sentiment = trend?.sentiment ?? (trend?.direction === 'up' ? 'positive' : trend?.direction === 'down' ? 'negative' : 'neutral');
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : trend?.direction === 'down' ? ArrowDownRight : ArrowRight;
  const trendText = trend?.direction === 'up' ? t.trendUp : trend?.direction === 'down' ? t.trendDown : t.trendNeutral;
  return (
    <div ref={ref} data-size={size} className={cx(styles.statistic, className)} {...rest}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <span className={styles.value}>{display}</span>
      {trend ? (
        <span className={styles.trendRow}>
          <span className={styles.trend} data-sentiment={sentiment}>
            <TrendIcon aria-hidden="true" className={styles.trendIcon} />
            <span className={styles.srOnly}>{trendText} </span>
            {trend.value}
          </span>
          {trend.label ? <span className={styles.trendLabel}>{trend.label}</span> : null}
        </span>
      ) : null}
      {description ? <span className={styles.description}>{description}</span> : null}
    </div>
  );
});