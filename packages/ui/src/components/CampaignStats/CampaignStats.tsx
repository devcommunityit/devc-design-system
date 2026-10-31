import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { KpiCard } from '../KpiCard/KpiCard';
import type { StatisticTrend } from '../Statistic/Statistic';
import styles from './CampaignStats.module.css';

export interface CampaignStat {
  id: string;
  label: ReactNode;
  value: number | ReactNode;
  formatOptions?: Intl.NumberFormatOptions;
  description?: ReactNode;
  trend?: StatisticTrend;
  sparkline?: number[];
}

export interface CampaignStatsProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  stats: CampaignStat[];
}

export function CampaignStats({ title, stats, className, ...rest }: CampaignStatsProps) {
  const titleId = useId();
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {stats.map((stat) => <KpiCard key={stat.id} label={stat.label} value={stat.value} formatOptions={stat.formatOptions} description={stat.description} trend={stat.trend} sparkline={stat.sparkline} />)}
      </div>
    </section>
  );
}
