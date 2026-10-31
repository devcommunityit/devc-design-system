import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './AttendanceCertificate.module.css';

export interface AttendanceCertificateProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  recipient: ReactNode;
  eventName: ReactNode;
  issuedDate?: string;
  certificateHref?: string;
  linkLabel?: string;
}

export function AttendanceCertificate({ recipient, eventName, issuedDate, certificateHref, linkLabel = 'View certificate', className, ...rest }: AttendanceCertificateProps) {
  const titleId = useId();
  return (
    <article aria-labelledby={titleId} className={[styles.certificate, className].filter(Boolean).join(' ')} {...rest}>
      <p className={styles.eyebrow}>Certificate of attendance</p>
      <h2 id={titleId} className={styles.recipient}>{recipient}</h2>
      <p className={styles.description}>Attended <strong>{eventName}</strong></p>
      {issuedDate ? <time className={styles.date} dateTime={issuedDate}>{issuedDate}</time> : null}
      {certificateHref ? <a className={styles.link} href={certificateHref}>{linkLabel}</a> : null}
    </article>
  );
}
