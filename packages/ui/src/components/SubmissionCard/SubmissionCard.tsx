import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './SubmissionCard.module.css';

export interface SubmissionCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  summary?: ReactNode;
  submitter?: ReactNode;
  submittedAt?: string;
  status?: ReactNode;
  href?: string;
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export function SubmissionCard({ title, summary, submitter, submittedAt, status, href, action, headingLevel = 3, className, ...rest }: SubmissionCardProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <article aria-labelledby={titleId} className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.header}>
        <Heading id={titleId} className={styles.title}>{href ? <a href={href}>{title}</a> : title}</Heading>
        {status ? <span className={styles.status}>{status}</span> : null}
      </div>
      {summary ? <p className={styles.summary}>{summary}</p> : null}
      <div className={styles.meta}>
        {submitter ? <span>By {submitter}</span> : null}
        {submittedAt ? <time dateTime={submittedAt}>{submittedAt}</time> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </article>
  );
}
