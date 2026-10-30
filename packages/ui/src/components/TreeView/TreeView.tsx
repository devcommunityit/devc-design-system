import { Check, ChevronRight, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Tree,
  TreeItem,
  TreeItemContent,
  composeRenderProps,
  type TreeItemProps,
  type TreeProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import checkboxStyles from '../Checkbox/Checkbox.module.css';
import styles from './TreeView.module.css';

export interface TreeViewProps<T extends object> extends TreeProps<T> {
  /** Row density. @default 'md' */
  size?: 'sm' | 'md';
}

/**
 * Hierarchical list (role="treegrid") for folders, categories or org charts. Arrow keys move and
 * expand/collapse (←/→ follow the reading direction), typeahead jumps by `textValue`, and optional
 * single/multiple selection uses checkboxes. Supports static children or `items` with a render function.
 */
export function TreeView<T extends object>({ size = 'md', className, ...rest }: TreeViewProps<T>) {
  return <Tree {...rest} data-size={size} className={composeRenderProps(className, (cn) => cx(styles.tree, cn))} />;
}

export interface TreeViewItemProps<T extends object = object> extends Omit<TreeItemProps<T>, 'children' | 'textValue'> {
  /** Visible row label. */
  title: ReactNode;
  /** Plain text for typeahead. Required when `title` is not a string. */
  textValue?: string;
  /** Decorative icon before the title (hidden from assistive technology). */
  icon?: ReactNode;
  /** Secondary text after the title (e.g. a count or a date). */
  description?: ReactNode;
  /** Nested `TreeViewItem`s (static) or a `Collection` (dynamic). */
  children?: ReactNode;
}

/** Row of a TreeView. Rows with children get an expand button labelled by react-aria's localized strings. */
export function TreeViewItem<T extends object = object>({ title, textValue, icon, description, children, className, ...rest }: TreeViewItemProps<T>) {
  const text = textValue ?? (typeof title === 'string' ? title : '');
  return (
    <TreeItem {...rest} textValue={text} className={composeRenderProps(className, (cn) => cx(styles.item, cn))}>
      <TreeItemContent>
        {({ hasChildItems, level, selectionMode, selectionBehavior }) => (
          <div className={styles.content} style={{ paddingInlineStart: `calc(${level - 1} * var(--_indent))` }}>
            {hasChildItems ? (
              <Button slot="chevron" className={styles.chevron}>
                <ChevronRight aria-hidden="true" />
              </Button>
            ) : (
              <span className={styles.chevronSpacer} aria-hidden="true" />
            )}
            {selectionMode !== 'none' && selectionBehavior === 'toggle' ? (
              <Checkbox slot="selection" className={cx(checkboxStyles.button, styles.checkbox)}>
                {({ isSelected, isIndeterminate }) => (
                  <span className={checkboxStyles.box} aria-hidden="true">
                    {isIndeterminate ? <Minus /> : isSelected ? <Check /> : null}
                  </span>
                )}
              </Checkbox>
            ) : null}
            {icon ? (
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span className={styles.title}>{title}</span>
            {description ? <span className={styles.description}>{description}</span> : null}
          </div>
        )}
      </TreeItemContent>
      {children}
    </TreeItem>
  );
}
