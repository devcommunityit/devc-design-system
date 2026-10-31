import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './SubscriptionStatus.module.css';

export type SubscriptionState = 'active' | 'trial' | 'past-due' | 'paused' | 'canceled';

export interface SubscriptionStatusProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  status: SubscriptionState;
  statusLabel: ReactNode;
  detail?: ReactNode;
  primaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: ReactNode;
  onSecondaryAction?: () => void;
}

export function SubscriptionStatus({
  title, status, statusLabel, detail, primaryActionLabel, onPrimaryAction,
  secondaryActionLabel, onSecondaryAction, className, ...rest
}: SubscriptionStatusProps) {
  const titleId = useId();
  return (
    <section className={[styles.status, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <div className={styles.heading}>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <span className={styles.badge} data-status={status}>{statusLabel}</span>
      </div>
      {detail ? <div className={styles.detail}>{detail}</div> : null}
      {primaryActionLabel && onPrimaryAction || secondaryActionLabel && onSecondaryAction ? (
        <div className={styles.actions}>
          {primaryActionLabel && onPrimaryAction ? <Button onPress={onPrimaryAction}>{primaryActionLabel}</Button> : null}
          {secondaryActionLabel && onSecondaryAction ? <Button variant="outline" onPress={onSecondaryAction}>{secondaryActionLabel}</Button> : null}
        </div>
      ) : null}
    </section>
  );
}
