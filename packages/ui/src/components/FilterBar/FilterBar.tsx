import { forwardRef, type HTMLAttributes } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { Button } from '../Button';
import styles from './FilterBar.module.css';

export interface FilterBarOption {
  value: string;
  label: string;
}

export interface FilterBarFilter {
  id: string;
  label: string;
  options: readonly FilterBarOption[];
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

export interface FilterBarView {
  id: string;
  label: string;
  values: Readonly<Record<string, string>>;
}

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  filters: readonly FilterBarFilter[];
  views?: readonly FilterBarView[];
  activeViewId?: string;
  onViewChange?: (view: FilterBarView | undefined) => void;
  onSaveView?: (values: Readonly<Record<string, string>>) => void;
  onDeleteView?: (view: FilterBarView) => void;
  onClear?: () => void;
  viewsLabel?: string;
  saveViewLabel?: string;
  clearLabel?: string;
}

/** A controlled filter toolbar with optional consumer-managed saved views. */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    filters,
    views = [],
    activeViewId,
    onViewChange,
    onSaveView,
    onDeleteView,
    onClear,
    viewsLabel,
    saveViewLabel,
    clearLabel,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const activeView = views.find((view) => view.id === activeViewId);
  const values = Object.fromEntries(filters.map((filter) => [filter.id, filter.value]));
  const hasActiveFilters = filters.some((filter) => filter.value !== (filter.defaultValue ?? ''));
  return (
    <div ref={ref} className={[styles.bar, className].filter(Boolean).join(' ')} {...rest}>
      {views.length > 0 || onViewChange ? (
        <label className={styles.viewField}>
          <span>{viewsLabel ?? t.components.savedViews}</span>
          <select
            value={activeViewId ?? ''}
            onChange={(event) => onViewChange?.(views.find((view) => view.id === event.target.value))}
          >
            <option value="">—</option>
            {views.map((view) => <option key={view.id} value={view.id}>{view.label}</option>)}
          </select>
        </label>
      ) : null}
      <div className={styles.filters}>
        {filters.map((filter) => (
          <label className={styles.filter} key={filter.id}>
            <span>{filter.label}</span>
            <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)}>
              {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className={styles.actions}>
        {onClear ? <Button variant="ghost" size="sm" onPress={onClear} isDisabled={!hasActiveFilters}>{clearLabel ?? t.clearFilters}</Button> : null}
        {onDeleteView && activeView ? (
          <Button variant="ghost" size="sm" onPress={() => onDeleteView(activeView)}>{t.components.deleteView(activeView.label)}</Button>
        ) : null}
        {onSaveView ? <Button variant="secondary" size="sm" onPress={() => onSaveView(values)}>{saveViewLabel ?? t.components.saveView}</Button> : null}
      </div>
    </div>
  );
});
