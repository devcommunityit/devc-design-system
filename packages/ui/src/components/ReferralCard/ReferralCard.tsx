import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './ReferralCard.module.css';

export interface ReferralCardProps {
  title: string;
  description?: ReactNode;
  referralCode: string;
  referralUrl: string;
  copyLabel: string;
  onCopyRequest: () => void;
}

/** Displays referral details and delegates any copy operation to the consumer. */
export function ReferralCard({
  title,
  description,
  referralCode,
  referralUrl,
  copyLabel,
  onCopyRequest,
}: ReferralCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      <dl className={styles.details}>
        <div>
          <dt>Referral code</dt>
          <dd><code>{referralCode}</code></dd>
        </div>
        <div>
          <dt>Referral link</dt>
          <dd><a href={referralUrl}>{referralUrl}</a></dd>
        </div>
      </dl>
      <Button variant="secondary" onPress={onCopyRequest}>{copyLabel}</Button>
    </article>
  );
}
