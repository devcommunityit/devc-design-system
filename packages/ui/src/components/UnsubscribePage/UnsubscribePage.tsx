import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { NotificationPreferences, type NotificationPreferenceItem, type NotificationPreferencesValue } from '../NotificationPreferences/NotificationPreferences';
import styles from './UnsubscribePage.module.css';

export interface UnsubscribePageProps {
  title: string;
  description?: ReactNode;
  categories: readonly NotificationPreferenceItem[];
  channels: readonly NotificationPreferenceItem[];
  value: NotificationPreferencesValue;
  onChange: (value: NotificationPreferencesValue) => void;
  unsubscribeAllLabel: string;
  onUnsubscribeAll: () => void;
}

/** Controlled notification settings with an optional unsubscribe-all request. */
export function UnsubscribePage({
  title,
  description,
  categories,
  channels,
  value,
  onChange,
  unsubscribeAllLabel,
  onUnsubscribeAll,
}: UnsubscribePageProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>
      <NotificationPreferences
        aria-label={title}
        categories={categories}
        channels={channels}
        value={value}
        onChange={onChange}
      />
      <Button className={styles.unsubscribe} variant="outline" onPress={onUnsubscribeAll}>
        {unsubscribeAllLabel}
      </Button>
    </main>
  );
}
