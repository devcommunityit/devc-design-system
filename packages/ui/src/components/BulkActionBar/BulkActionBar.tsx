import { forwardRef, type HTMLAttributes } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import styles from './BulkActionBar.module.css';

export interface BulkActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Non-negative integer. The bar is hidden when zero. */
  count: number;
  onClear?: () => void;
  sticky?: boolean;
}

export const BulkActionBar = forwardRef<HTMLDivElement, BulkActionBarProps>(function BulkActionBar(
  { count, onClear, sticky = false, children, className, ...rest },
  ref,
) {
  const t = useMessages();
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError('BulkActionBar count must be a non-negative safe integer.');
  if (count === 0) return null;
  return (
    <div ref={ref} role="group" aria-label={t.bulkActions} {...rest} className={cx(styles.bar, className)} data-sticky={sticky || undefined}>
      <span role="status" className={styles.count}>{t.selectedCount(count)}</span>
      <div className={styles.actions}>{children}</div>
      {onClear ? <Button variant="ghost" size="sm" onPress={onClear}>{t.clear}</Button> : null}
    </div>
  );
});
