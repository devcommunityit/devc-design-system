import { useId, type ReactNode } from 'react';
import { PrivacyPreferences, type PrivacyPreference } from '../PrivacyPreferences/PrivacyPreferences';
import styles from './CookieBanner.module.css';

export interface CookieBannerProps {
  title: string;
  description: ReactNode;
  categories: readonly PrivacyPreference[];
  value: readonly string[];
  onChange: (value: readonly string[]) => void;
  onSave: (value: readonly string[]) => void | Promise<void>;
  errorMessage?: ReactNode;
}

/** Cookie consent presentation composed from PrivacyPreferences; policy and persistence stay external. */
export function CookieBanner({ title, description, categories, value, onChange, onSave, errorMessage }: CookieBannerProps) {
  const titleId = useId();
  return (
    <aside className={styles.banner} aria-labelledby={titleId}>
      <div className={styles.intro}>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <div className={styles.description}>{description}</div>
      </div>
      <PrivacyPreferences
        aria-label={title}
        categories={categories}
        value={value}
        onChange={onChange}
        onSave={onSave}
        errorMessage={errorMessage}
      />
    </aside>
  );
}
