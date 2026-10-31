import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import { Avatar } from '../Avatar/Avatar';
import styles from './ActivityCard.module.css';

export type ActivityTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface ActivityItem {
  id: string;
  /** Who did it; shown as text next to a decorative avatar. */
  actor: string;
  avatarSrc?: string;
  /** What happened, e.g. "published <a>an article</a>". */
  action: ReactNode;
  /** Visible, already formatted time ("2 hours ago", "09:30"). */
  time: string;
  /** Machine-readable value for the `<time>` element (ISO 8601). */
  dateTime?: string;
  /** Decorative status dot colour. @default 'neutral' */
  tone?: ActivityTone;
}

export interface ActivityCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  items: ActivityItem[];
  /** Bottom slot: a link to the full log or a note. */
  footer?: ReactNode;
  /** Shown instead of the list when `items` is empty. */
  emptyState?: ReactNode;
}

/** Dashboard activity feed: timeline of who did what and when. */
export const ActivityCard = forwardRef<HTMLDivElement, ActivityCardProps>(function ActivityCard(
  { title, headingLevel = 3, items, footer, emptyState, className, ...rest },
  ref,
) {
  const titleId = useId();
  const H = `h${headingLevel}` as const;
  return (
    <div ref={ref} className={cx(styles.activity, className)} {...rest}>
      <H id={titleId} className={styles.title}>
        {title}
      </H>
      {items.length ? (
        <ul className={styles.list} aria-labelledby={titleId}>
          {items.map((item) => (
            <li key={item.id} className={styles.item} data-tone={item.tone ?? 'neutral'}>
              <span className={styles.marker}>
                <Avatar name={item.actor} src={item.avatarSrc} size="sm" isDecorative />
                <span className={styles.dot} aria-hidden="true" />
              </span>
              <div className={styles.body}>
                <p className={styles.text}>
                  <span className={styles.actor}>{item.actor}</span> {item.action}
                </p>
                <time className={styles.time} dateTime={item.dateTime}>
                  {item.time}
                </time>
              </div>
            </li>
          ))}
        </ul>
      ) : emptyState ? (
        <div className={styles.empty}>{emptyState}</div>
      ) : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
});
