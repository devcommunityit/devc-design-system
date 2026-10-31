import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './SessionCard.module.css';

export interface SessionCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  startTime: string;
  endTime?: string;
  description?: ReactNode;
  speakers?: ReactNode;
  track?: ReactNode;
  location?: ReactNode;
  href?: string;
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export function SessionCard({
  title,
  startTime,
  endTime,
  description,
  speakers,
  track,
  location,
  href,
  action,
  headingLevel = 3,
  className,
  ...rest
}: SessionCardProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <article aria-labelledby={titleId} className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.time}>
        <time>{startTime}</time>{endTime ? <>–<time>{endTime}</time></> : null}
      </div>
      <div className={styles.content}>
        <Heading id={titleId} className={styles.title}>{href ? <a href={href}>{title}</a> : title}</Heading>
        {track || location ? <p className={styles.meta}>{[track, location].filter(Boolean).map((value, index) => <span key={index}>{value}</span>)}</p> : null}
        {description ? <div className={styles.description}>{description}</div> : null}
        {speakers ? <div className={styles.speakers}>{speakers}</div> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </article>
  );
}
