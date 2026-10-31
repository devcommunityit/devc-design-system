import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './EventTicket.module.css';

export interface EventTicketProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eventName: ReactNode;
  attendeeName: ReactNode;
  ticketName: ReactNode;
  ticketCode: string;
  qrVisual?: ReactNode;
  dateTime?: string;
  admission?: ReactNode;
}

export function EventTicket({
  eventName,
  attendeeName,
  ticketName,
  ticketCode,
  qrVisual,
  dateTime,
  admission,
  className,
  ...rest
}: EventTicketProps) {
  const titleId = useId();
  return (
    <article aria-labelledby={titleId} className={[styles.ticket, className].filter(Boolean).join(' ')} {...rest}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Event ticket</p>
        <h2 id={titleId} className={styles.title}>{eventName}</h2>
      </header>
      <dl className={styles.details}>
        <div><dt>Attendee</dt><dd>{attendeeName}</dd></div>
        <div><dt>Ticket</dt><dd>{ticketName}</dd></div>
        {dateTime ? <div><dt>Date</dt><dd><time dateTime={dateTime}>{dateTime}</time></dd></div> : null}
        {admission ? <div><dt>Admission</dt><dd>{admission}</dd></div> : null}
      </dl>
      <div className={styles.code}>
        {qrVisual ? <div className={styles.qr} role="img" aria-label="Ticket QR code">{qrVisual}</div> : null}
        <p className={styles.codeLabel}>Ticket code</p>
        <p className={styles.codeValue}>{ticketCode}</p>
      </div>
    </article>
  );
}
