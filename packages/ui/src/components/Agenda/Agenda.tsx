import { Children, forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './Agenda.module.css';

export interface AgendaProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Heading for the agenda section. */
  title: ReactNode;
  /** Agenda entries, usually `AgendaItem` elements. */
  children?: ReactNode;
  /** Content shown when there are no entries. */
  emptyState?: ReactNode;
  /** Heading level for the section title. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface AgendaItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Event title. With `href`, the title becomes a link. */
  title: ReactNode;
  /** Visible start time, e.g. “09:30”. */
  startTime: string;
  /** Optional machine-readable start date/time. */
  startDateTime?: string;
  /** Visible end time, e.g. “10:15”. */
  endTime?: string;
  /** Optional machine-readable end date/time. */
  endDateTime?: string;
  /** Destination for the event title. */
  href?: string;
  /** Supporting event description. */
  description?: ReactNode;
  /** Event location or attendance mode. */
  location?: ReactNode;
  /** Optional action slot, such as a registration button. */
  action?: ReactNode;
  /** Heading level for the event title. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/**
 * A compositional agenda list for a date or event schedule.
 */
export const Agenda = forwardRef<HTMLElement, AgendaProps>(function Agenda(
  { title, children, emptyState, headingLevel = 2, className, ...rest },
  ref,
) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;
  const hasItems = Children.toArray(children).length > 0;

  return (
    <section ref={ref} aria-labelledby={headingId} className={cx(styles.agenda, className)} {...rest}>
      <Heading id={headingId} className={styles.title}>
        {title}
      </Heading>
      {hasItems ? <ol className={styles.list}>{children}</ol> : emptyState != null ? <div className={styles.empty}>{emptyState}</div> : null}
    </section>
  );
});

/**
 * One event in an `Agenda`. Place inside `Agenda` so events form a semantic list.
 */
export const AgendaItem = forwardRef<HTMLLIElement, AgendaItemProps>(function AgendaItem(
  {
    title,
    startTime,
    startDateTime,
    endTime,
    endDateTime,
    href,
    description,
    location,
    action,
    headingLevel = 3,
    className,
    ...rest
  },
  ref,
) {
  const Heading = `h${headingLevel}` as const;

  return (
    <li ref={ref} className={cx(styles.item, className)} {...rest}>
      <article className={styles.event}>
        <div className={styles.time}>
          <time dateTime={startDateTime}>{startTime}</time>
          {endTime ? (
            <>
              <span aria-hidden="true">–</span>
              <time dateTime={endDateTime}>{endTime}</time>
            </>
          ) : null}
        </div>
        <div className={styles.content}>
          <Heading className={styles.eventTitle}>
            {href ? <a className={styles.link} href={href}>{title}</a> : title}
          </Heading>
          {description ? <div className={styles.description}>{description}</div> : null}
          {location ? <div className={styles.location}>{location}</div> : null}
        </div>
        {action ? <div className={styles.action}>{action}</div> : null}
      </article>
    </li>
  );
});
