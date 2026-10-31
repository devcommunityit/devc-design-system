import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { ListBoxItem } from '../ListBox/ListBox';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';
import styles from './AudienceSegmentBuilder.module.css';

export interface AudienceField {
  id: string;
  label: string;
}

export interface AudienceFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface AudienceSegmentBuilderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  filters: AudienceFilter[];
  fields: AudienceField[];
  operators: AudienceField[];
  onFilterChange: (filterId: string, patch: Partial<Omit<AudienceFilter, 'id'>>) => void;
  onAddFilter: () => void;
  onRemoveFilter: (filterId: string) => void;
  fieldLabel?: ReactNode;
  operatorLabel?: ReactNode;
  addFilterLabel?: ReactNode;
  removeFilterLabel?: ReactNode;
  valueLabel?: ReactNode;
}

export function AudienceSegmentBuilder({
  title, filters, fields, operators, onFilterChange, onAddFilter, onRemoveFilter,
  fieldLabel = 'Field', operatorLabel = 'Operator',
  addFilterLabel = 'Add filter', removeFilterLabel = 'Remove', valueLabel = 'Value',
  className, ...rest
}: AudienceSegmentBuilderProps) {
  const titleId = useId();
  return (
    <section className={[styles.builder, className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      <div className={styles.filters}>
        {filters.map((filter) => (
          <div className={styles.filter} key={filter.id}>
            <Select
              label={fieldLabel}
              items={fields}
              value={filter.field}
              onChange={(key) => onFilterChange(filter.id, { field: String(key ?? '') })}
            >
              {(field) => <ListBoxItem id={field.id} textValue={field.label}>{field.label}</ListBoxItem>}
            </Select>
            <Select
              label={operatorLabel}
              items={operators}
              value={filter.operator}
              onChange={(key) => onFilterChange(filter.id, { operator: String(key ?? '') })}
            >
              {(operator) => <ListBoxItem id={operator.id} textValue={operator.label}>{operator.label}</ListBoxItem>}
            </Select>
            <TextField
              label={valueLabel}
              value={filter.value}
              onChange={(value) => onFilterChange(filter.id, { value })}
            />
            <Button variant="ghost" onPress={() => onRemoveFilter(filter.id)} aria-label={`${removeFilterLabel} ${filter.id}`}>{removeFilterLabel}</Button>
          </div>
        ))}
      </div>
      <Button variant="outline" onPress={onAddFilter}>{addFilterLabel}</Button>
    </section>
  );
}
