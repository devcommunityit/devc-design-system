import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './MembershipCard.module.css';

export type MembershipStatus = 'active' | 'trial' | 'past-due' | 'canceled';

export interface MembershipCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  plan: ReactNode;
  status: MembershipStatus;
  statusLabel: ReactNode;
  description?: ReactNode;
  renewal?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
}

export function MembershipCard({
  title,
  plan,
  status,
  statusLabel,
  description,
  renewal,
  actionLabel,
  onAction,
  className,
  ...rest
}: MembershipCardProps) {
  const titleId = useId();
  return (
    <section className={[styles.card, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <div className={styles.header}>
        <div>
          <h2 id={titleId} className={styles.title}>{title}</h2>
          <p className={styles.plan}>{plan}</p>
        </div>
        <span className={styles.status} data-status={status}>{statusLabel}</span>
      </div>
      {description ? <div className={styles.description}>{description}</div> : null}
      {renewal ? <p className={styles.renewal}>{renewal}</p> : null}
      {actionLabel && onAction ? <Button variant="outline" onPress={onAction}>{actionLabel}</Button> : null}
    </section>
  );
}
