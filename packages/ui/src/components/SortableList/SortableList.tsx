import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  Button,
  DropIndicator,
  GridList,
  GridListItem,
  composeRenderProps,
  useDragAndDrop,
  type GridListProps,
  type Key,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { IconButton } from '../IconButton/IconButton';
import styles from './SortableList.module.css';

export interface SortableItem {
  id: Key;
}

export interface SortableListProps<T extends SortableItem>
  extends Omit<GridListProps<T>, 'items' | 'defaultItems' | 'children' | 'dragAndDropHooks' | 'selectionMode' | 'renderEmptyState'> {
  /** Controlled order. */
  items?: T[];
  /** Initial order (uncontrolled). @default [] */
  defaultItems?: T[];
  /** Called with the full reordered array after every move (drag, keyboard drag or move buttons). */
  onReorder?: (items: T[]) => void;
  /** Plain-text name of an item: used for typeahead, the drag handle and announcements. */
  getLabel: (item: T) => string;
  /** Row content. Defaults to `getLabel(item)`. */
  children?: (item: T) => ReactNode;
  /** Show "move up/down" buttons: a single-pointer alternative to dragging (WCAG 2.5.7). @default true */
  showMoveButtons?: boolean;
  /** Content when the list is empty. */
  emptyState?: ReactNode;
  /** Disable reordering (rows stay readable and focusable). @default false */
  isDisabled?: boolean;
}

function move<T extends SortableItem>(items: T[], keys: Set<Key>, targetKey: Key, position: 'before' | 'after' | 'on'): T[] {
  const moving = items.filter((item) => keys.has(item.id));
  const rest = items.filter((item) => !keys.has(item.id));
  const targetIndex = rest.findIndex((item) => item.id === targetKey);
  if (targetIndex < 0) return items;
  const insertAt = position === 'before' ? targetIndex : targetIndex + 1;
  return [...rest.slice(0, insertAt), ...moving, ...rest.slice(insertAt)];
}

/**
 * Reorderable list (role="grid"). Rows can be dragged with a pointer, moved with the keyboard via the drag
 * handle (Enter, arrows, Enter) or with the move up/down buttons. Every move calls `onReorder` with the new
 * array and is announced in a live region. The order lives in the consumer: persist it where needed.
 */
export function SortableList<T extends SortableItem>({
  items: itemsProp,
  defaultItems = [],
  onReorder,
  getLabel,
  children,
  showMoveButtons = true,
  emptyState,
  isDisabled = false,
  className,
  ...rest
}: SortableListProps<T>) {
  const t = useMessages();
  const [items, setItems] = useControllableState(itemsProp, defaultItems, onReorder, 'items');
  const [announcement, setAnnouncement] = useState('');

  const announce = (next: T[], id: Key) => {
    const index = next.findIndex((item) => item.id === id);
    const item = next[index];
    if (item) setAnnouncement(t.itemMoved(getLabel(item), index + 1, next.length));
  };

  const { dragAndDropHooks } = useDragAndDrop<T>({
    getItems: (keys) =>
      [...keys].map((key) => {
        const item = items.find((candidate) => candidate.id === key);
        return { 'text/plain': item ? getLabel(item) : String(key) };
      }),
    onReorder: (event) => {
      const next = move(items, event.keys, event.target.key, event.target.dropPosition);
      setItems(next);
    },
    renderDropIndicator: (target) => <DropIndicator target={target} className={styles.dropIndicator} />,
  });

  const moveBy = (id: Key, delta: -1 | 1, from: Element) => {
    const index = items.findIndex((item) => item.id === id);
    const target = items[index + delta];
    if (!target) return;
    const next = move(items, new Set([id]), target.id, delta < 0 ? 'before' : 'after');
    setItems(next);
    announce(next, id);
    // At either end the pressed button becomes disabled: keep focus inside the row on the other button.
    const atEdge = delta < 0 ? index + delta === 0 : index + delta === items.length - 1;
    if (atEdge) {
      const row = from.closest('[role="row"]');
      requestAnimationFrame(() => {
        const other = row?.querySelector<HTMLElement>(`[data-move="${delta < 0 ? 'down' : 'up'}"]`);
        other?.focus();
      });
    }
  };

  return (
    <div className={styles.root}>
      <GridList
        {...rest}
        items={items}
        // Rows depend on their position (disabled move buttons), not only on the item object.
        dependencies={[items, isDisabled, showMoveButtons, children, t, ...(rest.dependencies ?? [])]}
        dragAndDropHooks={isDisabled ? undefined : dragAndDropHooks}
        renderEmptyState={() => emptyState}
        className={composeRenderProps(className, (cn) => cx(styles.list, cn))}
      >
        {(item) => {
          const label = getLabel(item);
          const index = items.findIndex((candidate) => candidate.id === item.id);
          return (
            <GridListItem id={item.id} textValue={label} className={styles.item}>
              {!isDisabled ? (
                <Button slot="drag" className={styles.handle}>
                  <GripVertical aria-hidden="true" />
                </Button>
              ) : null}
              <div className={styles.content}>{children ? children(item) : label}</div>
              {showMoveButtons && !isDisabled && items.length > 1 ? (
                <div className={styles.moveButtons}>
                  <IconButton
                    size="sm"
                    data-move="up"
                    label={t.moveUp(label)}
                    icon={<ArrowUp />}
                    isDisabled={index === 0}
                    onPress={(event) => moveBy(item.id, -1, event.target)}
                  />
                  <IconButton
                    size="sm"
                    data-move="down"
                    label={t.moveDown(label)}
                    icon={<ArrowDown />}
                    isDisabled={index === items.length - 1}
                    onPress={(event) => moveBy(item.id, 1, event.target)}
                  />
                </div>
              ) : null}
            </GridListItem>
          );
        }}
      </GridList>
      <div role="status" className={styles.srOnly}>
        {announcement}
      </div>
    </div>
  );
}
