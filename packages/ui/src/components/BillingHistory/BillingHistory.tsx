import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './BillingHistory.module.css';

export interface BillingRecord {
  id: string;
  date: ReactNode;
  description: ReactNode;
  amount: ReactNode;
  status: ReactNode;
}

export interface BillingHistoryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  records: BillingRecord[];
  invoiceLabel?: ReactNode;
  dateLabel?: ReactNode;
  amountLabel?: ReactNode;
  statusLabel?: ReactNode;
  downloadLabel?: ReactNode;
  onDownload?: (recordId: string) => void;
}

export function BillingHistory({
  title, records, invoiceLabel = 'Invoice', dateLabel = 'Date', amountLabel = 'Amount',
  statusLabel = 'Status', downloadLabel, onDownload, className, ...rest
}: BillingHistoryProps) {
  const titleId = useId();
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead><tr><th scope="col">{invoiceLabel}</th><th scope="col">{dateLabel}</th><th scope="col">{amountLabel}</th><th scope="col">{statusLabel}</th>{downloadLabel && onDownload ? <th scope="col"><span className={styles.srOnly}>{downloadLabel}</span></th> : null}</tr></thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <th scope="row">{record.description}</th><td>{record.date}</td><td>{record.amount}</td><td>{record.status}</td>
                {downloadLabel && onDownload ? <td><Button variant="ghost" size="sm" onPress={() => onDownload(record.id)}>{downloadLabel}</Button></td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
