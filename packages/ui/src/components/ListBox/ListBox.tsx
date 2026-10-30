import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Header,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  ListBoxSection as RACListBoxSection,
  Collection,
  Text,
  composeRenderProps,
  type ListBoxItemProps as RACListBoxItemProps,
  type ListBoxProps as RACListBoxProps,
  type ListBoxSectionProps as RACListBoxSectionProps,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './ListBox.module.css';

export interface ListBoxProps<T extends object> extends RACListBoxProps<T> {
  /** `bordered` for a standalone list; `plain` inside popovers. @default 'bordered' */
  variant?: 'bordered' | 'plain';
}

/**
 * Accessible list of selectable options (single or multiple selection, keyboard navigation,
 * typeahead). Used standalone or inside Select/Combobox/MultiSelect.
 */
export function ListBox<T extends object>({ variant = 'bordered', className, renderEmptyState, ...rest }: ListBoxProps<T>) {
  const t = useMessages();
  return (
    <RACListBox
      {...rest}
      data-variant={variant}
      renderEmptyState={renderEmptyState ?? (() => <div className={styles.empty}>{t.noOptions}</div>)}
      className={composeRenderProps(className, (cn) => cx(styles.listbox, cn))}
    />
  );
}

export interface ListBoxItemProps<T extends object = object> extends RACListBoxItemProps<T> {
  /** Secondary line. */
  description?: ReactNode;
  /** Decorative leading icon. */
  icon?: ReactNode;
}

/** Option of a ListBox, Select, Combobox. Pass `textValue` when children are not plain text. */
export function ListBoxItem<T extends object = object>({ description, icon, children, className, textValue, ...rest }: ListBoxItemProps<T>) {
  const text = textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <RACListBoxItem {...rest} textValue={text} className={composeRenderProps(className, (cn) => cx(styles.item, cn))}>
      {composeRenderProps(children, (content, { isSelected, selectionMode }) => (
        <>
          {selectionMode !== 'none' ? (
            <span className={styles.check} aria-hidden="true">
              {isSelected ? <Check /> : null}
            </span>
          ) : null}
          {icon ? (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className={styles.text}>
            <Text slot="label" className={styles.label}>
              {content}
            </Text>
            {description ? (
              <Text slot="description" className={styles.description}>
                {description}
              </Text>
            ) : null}
          </span>
        </>
      ))}
    </RACListBoxItem>
  );
}

export interface ListBoxSectionProps<T extends object> extends Omit<RACListBoxSectionProps<T>, 'children'> {
  /** Visible section heading. */
  title: ReactNode;
  children: ReactNode | ((item: T) => ReactNode);
}

/** Group of options with a heading. */
export function ListBoxSection<T extends object>({ title, children, items, className, ...rest }: ListBoxSectionProps<T>) {
  return (
    <RACListBoxSection {...rest} className={cx(styles.section, className)}>
      <Header className={styles.header}>{title}</Header>
      <Collection items={items}>{children}</Collection>
    </RACListBoxSection>
  );
}