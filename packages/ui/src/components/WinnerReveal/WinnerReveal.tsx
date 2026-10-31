import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Award } from 'lucide-react';
import { cx } from '../../utils';
import styles from './WinnerReveal.module.css';

export interface RaffleWinner {
  /** Stable identifier supplied by the raffle owner. */
  id: string;
  /** Winner's display name. */
  name: string;
  /** Optional entry or ticket number. */
  entryNumber?: string | number;
  /** Optional descriptive context. */
  detail?: ReactNode;
  /** Optional decorative avatar or mark. */
  avatar?: ReactNode;
}

export interface WinnerRevealProps extends HTMLAttributes<HTMLElement> {
  /** Winner supplied by the consuming application; null renders the empty state. */
  winner: RaffleWinner | null;
  /** Section heading. @default 'Winner' */
  heading?: ReactNode;
  /** Heading element level. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Copy shown when no winner is supplied. */
  emptyMessage?: ReactNode;
}

/** Presentational winner display. It does not choose, persist, or reveal a winner itself. */
export const WinnerReveal = forwardRef<HTMLElement, WinnerRevealProps>(function WinnerReveal(
  { winner, heading = 'Winner', headingLevel = 3, emptyMessage = 'No winner has been announced yet.', className, ...rest },
  ref,
) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <section ref={ref} aria-labelledby={headingId} className={cx(styles.reveal, className)} {...rest}>
      <Heading id={headingId} className={styles.heading}>{heading}</Heading>
      {winner ? (
        <div className={styles.winner} data-winner-id={winner.id}>
          <span className={styles.mark} aria-hidden="true">
            {winner.avatar ?? <Award />}
          </span>
          <div className={styles.identity}>
            <p className={styles.name}>{winner.name}</p>
            {winner.detail ? <div className={styles.detail}>{winner.detail}</div> : null}
            {winner.entryNumber !== undefined ? (
              <p className={styles.entryNumber}>Entry {winner.entryNumber}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className={styles.empty} role="status">{emptyMessage}</p>
      )}
    </section>
  );
});
