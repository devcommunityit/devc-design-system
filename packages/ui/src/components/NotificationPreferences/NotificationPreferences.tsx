import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import shared from '../composite/Composite.module.css';
import { SelectionMatrix, type MatrixItem, type MatrixValue } from '../composite/SelectionMatrix';

export type NotificationPreferenceItem = MatrixItem;
/** Keys are channel ids and values are category ids enabled for that channel. */
export type NotificationPreferencesValue = MatrixValue;

export interface NotificationPreferencesProps {
  'aria-label': string;
  categories: readonly NotificationPreferenceItem[];
  channels: readonly NotificationPreferenceItem[];
  value?: NotificationPreferencesValue;
  defaultValue?: NotificationPreferencesValue;
  onChange?: (value: NotificationPreferencesValue) => void;
  isCellDisabled?: (categoryId: string, channelId: string) => boolean;
  className?: string;
}

/** Notification choices only; delivery and persistence belong to the consumer. */
export function NotificationPreferences({
  'aria-label': ariaLabel, categories, channels, value: controlledValue, defaultValue = {}, onChange, isCellDisabled, className,
}: NotificationPreferencesProps) {
  const t = useMessages().components;
  const [value, setValue] = useControllableState(controlledValue, defaultValue, onChange, 'value');
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <SelectionMatrix label={ariaLabel} columns={channels} rows={categories} value={value} onChange={setValue}
        isCellDisabled={isCellDisabled} cellLabel={t.preferenceCell} />
    </section>
  );
}
