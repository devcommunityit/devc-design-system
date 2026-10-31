import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './EntryList.module.css';

export interface RaffleEntry {
  /** Stable identifier supplied by the raffle owner. */
  id: string;
  /** Participant's display name. */
  name: string;
  /** Optional ticket or entry number. */
  entryNumber?: string | number;
  /** Optional supporting information. */
  detail?: ReactNode;
  /** Optional decorative avatar or mark. */
  avatar?: ReactNode;
  /** Externally determined winner state. */
  isWinner?: boolean;
}

export interface EntryListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Entries to display in the provided order. */
  entries: RaffleEntry[];
  /** Accessible name of the list. @default 'Raffle entries' */
  label?: string;
  /** Text marker shown for entries flagged as winners. @default 'Winner' */
  winnerLabel?: ReactNode;
  /** Content shown when the list is empty. */
  emptyMessage?: ReactNode;
}

/** Semantic, display-only list of raffle entries. */
export const EntryList = forwardRef<HTMLUListElement, EntryListProps>(function EntryList(
  { entries, label = 'Raffle entries', winnerLabel = 'Winner', emptyMessage = 'No entries yet.', className, ...rest },
  ref,
) {
  return (
    <ul ref={ref} aria-label={label} className={cx(styles.list, className)} {...rest}>
      {entries.length ? entries.map((entry) => (
        <li key={entry.id} className={styles.item} data-winner={entry.isWinner || undefined}>
          {entry.avatar ? <span className={styles.avatar} aria-hidden="true">{entry.avatar}</span> : null}
          <span className={styles.identity}>
            <span className={styles.name}>{entry.name}</span>
            {entry.detail ? <span className={styles.detail}>{entry.detail}</span> : null}
          </span>
          {entry.entryNumber !== undefined ? <span className={styles.entryNumber}>#{entry.entryNumber}</span> : null}
          {entry.isWinner ? <span className={styles.winner}>{winnerLabel}</span> : null}
        </li>
      )) : (
        <li className={styles.empty}>{emptyMessage}</li>
      )}
    </ul>
  );
});
