import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx, type CSSVariables } from '../../utils';
import styles from './RankingCard.module.css';

export interface RankingItem {
  id: string;
  label: ReactNode;
  value: number;
  description?: ReactNode;
  /** Decorative icon shown before the label. */
  icon?: ReactNode;
}

export interface RankingCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Items already in rank order (first = #1). */
  items: RankingItem[];
  formatOptions?: Intl.NumberFormatOptions;
  /** Shows only the first N items. */
  maxItems?: number;
  /** Bar colour: one data-series colour per row, or the brand gradient on every row. @default 'series' */
  barStyle?: 'series' | 'gradient';
  /** Bottom slot: a link to the full list or a note. */
  footer?: ReactNode;
}

/**
 * Dashboard leaderboard: ordered list with rank badge (top 3 highlighted), label, decorative
 * proportional bar and Intl-formatted value.
 */
export const RankingCard = forwardRef<HTMLDivElement, RankingCardProps>(function RankingCard(
  { title, headingLevel = 3, items, formatOptions, maxItems, barStyle = 'series', footer, className, ...rest },
  ref,
) {
  const { locale } = useLocale();
  const titleId = useId();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const visible = maxItems !== undefined ? items.slice(0, Math.max(0, maxItems)) : items;
  const max = Math.max(0, ...visible.map((item) => (Number.isFinite(item.value) ? Math.abs(item.value) : 0)));
  const H = `h${headingLevel}` as const;

  return (
    <div ref={ref} data-bar-style={barStyle} className={cx(styles.ranking, className)} {...rest}>
      <H id={titleId} className={styles.title}>
        {title}
      </H>
      <ol className={styles.list} aria-labelledby={titleId}>
        {visible.map((item, index) => {
          const ratio = max > 0 && Number.isFinite(item.value) ? Math.abs(item.value) / max : 0;
          return (
            <li key={item.id} className={styles.item} data-top={index < 3 ? index + 1 : undefined}>
              <span className={styles.rank}>{index + 1}</span>
              <div className={styles.main}>
                <div className={styles.row}>
                  <span className={styles.labelGroup}>
                    {item.icon ? (
                      <span className={styles.icon} aria-hidden="true">
                        {item.icon}
                      </span>
                    ) : null}
                    <span className={styles.label}>{item.label}</span>
                  </span>
                  <span className={styles.value}>{formatter.format(item.value)}</span>
                </div>
                {item.description ? <span className={styles.description}>{item.description}</span> : null}
                <span className={styles.track} aria-hidden="true">
                  <span className={styles.bar} data-series={(index % 6) + 1} style={{ '--_ratio': ratio } as CSSVariables} />
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
});
