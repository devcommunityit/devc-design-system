import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { WinnerReveal, type RaffleWinner } from '../WinnerReveal/WinnerReveal';
import styles from './RaffleDraw.module.css';

export interface RaffleDrawProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Draw title. */
  title: ReactNode;
  /** Winner chosen by the consuming application; this component never selects one. */
  winner: RaffleWinner | null;
  /** Number of eligible entries displayed as supporting context. */
  entryCount?: number;
  /** Localizable entry label, including singular/plural forms. */
  entryCountLabel?: (count: number) => ReactNode;
  /** Supporting copy shown below the title. */
  description?: ReactNode;
  /** Heading element used for the title. @default 2 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Copy shown by WinnerReveal when there is no externally supplied winner. */
  emptyMessage?: ReactNode;
}

/** Display-only raffle summary. Winner selection and draw state are owned by the caller. */
export const RaffleDraw = forwardRef<HTMLElement, RaffleDrawProps>(function RaffleDraw(
  { title, winner, entryCount, entryCountLabel, description, headingLevel = 2, emptyMessage, className, ...rest },
  ref,
) {
  const { locale } = useLocale();
  const titleId = useId();
  const countFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const Title = `h${headingLevel}` as const;

  return (
    <section ref={ref} aria-labelledby={titleId} className={cx(styles.draw, className)} {...rest}>
      <header className={styles.header}>
        <Title id={titleId} className={styles.title}>{title}</Title>
        {description ? <div className={styles.description}>{description}</div> : null}
        {entryCount !== undefined ? (
          <p className={styles.entryCount}>
            {countFormatter.format(Math.max(0, Number.isFinite(entryCount) ? entryCount : 0))}{' '}
            {entryCountLabel?.(Math.max(0, Number.isFinite(entryCount) ? entryCount : 0)) ??
              (Math.max(0, Number.isFinite(entryCount) ? entryCount : 0) === 1 ? 'entry' : 'entries')}
          </p>
        ) : null}
      </header>
      <WinnerReveal winner={winner} heading="Winner" headingLevel={headingLevel < 6 ? ((headingLevel + 1) as 3 | 4 | 5 | 6) : 6} emptyMessage={emptyMessage} />
    </section>
  );
});
