import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './OrderSummary.module.css';

export interface OrderSummaryItem {
  id: string;
  label: ReactNode;
  amount: number;
}

export interface OrderSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  items: OrderSummaryItem[];
  subtotal: number;
  total: number;
  currency: string;
  locale?: string;
  discount?: number;
  tax?: number;
  subtotalLabel?: ReactNode;
  discountLabel?: ReactNode;
  taxLabel?: ReactNode;
  totalLabel?: ReactNode;
}

export function OrderSummary({
  title, items, subtotal, total, currency, locale, discount, tax,
  subtotalLabel = 'Subtotal', discountLabel = 'Discount', taxLabel = 'Tax', totalLabel = 'Total', className, ...rest
}: OrderSummaryProps) {
  const format = (amount: number) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  const titleId = useId();
  return (
    <section className={[styles.summary, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      <dl className={styles.rows}>
        {items.map((item) => <div className={styles.row} key={item.id}><dt>{item.label}</dt><dd>{format(item.amount)}</dd></div>)}
        <div className={styles.row}><dt>{subtotalLabel}</dt><dd>{format(subtotal)}</dd></div>
        {discount !== undefined ? <div className={styles.row}><dt>{discountLabel}</dt><dd>−{format(discount)}</dd></div> : null}
        {tax !== undefined ? <div className={styles.row}><dt>{taxLabel}</dt><dd>{format(tax)}</dd></div> : null}
        <div className={styles.total}><dt>{totalLabel}</dt><dd>{format(total)}</dd></div>
      </dl>
    </section>
  );
}
