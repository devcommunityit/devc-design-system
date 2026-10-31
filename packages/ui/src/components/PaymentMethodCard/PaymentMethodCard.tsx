import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './PaymentMethodCard.module.css';

export interface PaymentMethodCardProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  lastFour: string;
  expiry: ReactNode;
  selected: boolean;
  selectedLabel?: ReactNode;
  selectLabel?: ReactNode;
  removeLabel?: ReactNode;
  onSelect?: () => void;
  onRemove?: () => void;
}

export function PaymentMethodCard({
  brand, lastFour, expiry, selected, selectedLabel = 'Default payment method', selectLabel = 'Select',
  removeLabel, onSelect, onRemove, className, ...rest
}: PaymentMethodCardProps) {
  const maskedLastFour = lastFour.replace(/\D/g, '').slice(-4).padStart(4, '•');
  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')} data-selected={selected || undefined} {...rest}>
      <div className={styles.details}>
        <h2 className={styles.brand}>{brand}</h2>
        <p className={styles.masked}>•••• {maskedLastFour}</p>
        <p className={styles.expiry}>{expiry}</p>
      </div>
      {selected ? <span className={styles.selected}>{selectedLabel}</span> : null}
      <div className={styles.actions}>
        {!selected && onSelect ? <Button variant="outline" onPress={onSelect}>{selectLabel}</Button> : null}
        {removeLabel && onRemove ? <Button variant="ghost" onPress={onRemove}>{removeLabel}</Button> : null}
      </div>
    </article>
  );
}
