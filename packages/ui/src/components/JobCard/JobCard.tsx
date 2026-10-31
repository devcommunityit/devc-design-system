import type { ReactNode } from 'react';
import styles from './JobCard.module.css';

export interface JobCardProps {
  title: string;
  company: ReactNode;
  href: string;
  description?: ReactNode;
  location?: ReactNode;
  employmentType?: ReactNode;
  postedAt?: string;
}

/** A job listing preview with a link to details; applications remain external. */
export function JobCard({ title, company, href, description, location, employmentType, postedAt }: JobCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}><a href={href}>{title}</a></h2>
        <p className={styles.company}>{company}</p>
      </header>
      {description ? <p className={styles.description}>{description}</p> : null}
      {(location || employmentType || postedAt) ? (
        <dl className={styles.details}>
          {location ? <div><dt>Location</dt><dd>{location}</dd></div> : null}
          {employmentType ? <div><dt>Employment</dt><dd>{employmentType}</dd></div> : null}
          {postedAt ? <div><dt>Posted</dt><dd>{postedAt}</dd></div> : null}
        </dl>
      ) : null}
    </article>
  );
}
