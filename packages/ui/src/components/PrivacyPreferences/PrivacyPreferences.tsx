import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import shared from '../composite/Composite.module.css';

export interface PrivacyPreference {
  id: string;
  label: string;
  description?: ReactNode;
  isRequired?: boolean;
}

export interface PrivacyPreferencesProps {
  'aria-label': string;
  categories: readonly PrivacyPreference[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (value: readonly string[]) => void;
  onSave: (value: readonly string[]) => void | Promise<void>;
  onError?: (error: unknown) => void;
  errorMessage?: ReactNode;
  className?: string;
}

/** Optional choices default to off. Persistence and consent policy are the consumer's responsibility. */
export function PrivacyPreferences({
  'aria-label': ariaLabel, categories, value: controlledValue, defaultValue = [], onChange, onSave, onError, errorMessage, className,
}: PrivacyPreferencesProps) {
  const t = useMessages();
  const [value, setValue] = useControllableState(controlledValue, defaultValue, onChange, 'value');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const mounted = useRef(false);
  const saving = useRef(false);
  const ids = new Set<string>();
  for (const category of categories) {
    if (ids.has(category.id)) throw new Error(`PrivacyPreferences: duplicate category id "${category.id}".`);
    ids.add(category.id);
  }
  const selected = categories.filter((category) => category.isRequired || value.includes(category.id)).map((category) => category.id);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const save = async (next: readonly string[], update: boolean) => {
    if (saving.current) return;
    saving.current = true;
    setPending(true);
    setError(false);
    try {
      if (update) setValue(next);
      await onSave(next);
    } catch (reason) {
      if (mounted.current) setError(true);
      onError?.(reason);
    } finally {
      saving.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <ul className={shared.list}>
        {categories.map((category) => (
          <li key={category.id} className={shared.panel}>
            <Checkbox
              isSelected={selected.includes(category.id)}
              isDisabled={category.isRequired || pending}
              description={category.description}
              onChange={(checked) => setValue(checked ? [...selected, category.id] : selected.filter((id) => id !== category.id))}
            >
              {category.label}{category.isRequired ? ` (${t.components.privacyRequired})` : ''}
            </Checkbox>
          </li>
        ))}
      </ul>
      {error ? <div role="alert">{errorMessage ?? t.components.wizardError}</div> : null}
      <div className={shared.actions}>
        <Button isDisabled={pending} onPress={() => { void save(categories.map((category) => category.id), true); }}>{t.components.privacyAcceptAll}</Button>
        <Button variant="outline" isDisabled={pending} onPress={() => { void save(categories.filter((category) => category.isRequired).map((category) => category.id), true); }}>{t.components.privacyRejectAll}</Button>
        <Button variant="outline" isDisabled={pending} onPress={() => { void save(selected, false); }}>{t.components.privacySave}</Button>
      </div>
    </section>
  );
}
