import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, GripVertical } from 'lucide-react';
import { useId, useRef, useState, type ReactNode } from 'react';
import { Button, DropIndicator, GridList, GridListItem, useDragAndDrop, type Key } from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { moveKanbanCard } from './moveKanbanCard';
import { IconButton } from '../IconButton/IconButton';
import { Heading } from '../Typography/Typography';
import styles from './KanbanBoard.module.css';

export interface KanbanCard {
  id: string;
  title: string;
  description?: ReactNode;
  labels?: string[];
}

export interface KanbanColumn<TCard extends KanbanCard = KanbanCard> {
  id: string;
  title: string;
  description?: string;
  cards: TCard[];
}

export interface KanbanMove<TCard extends KanbanCard = KanbanCard> {
  card: TCard;
  sourceColumnId: string;
  targetColumnId: string;
  sourceIndex: number;
  targetIndex: number;
}

export interface KanbanBoardProps<TCard extends KanbanCard = KanbanCard> {
  /** Accessible name for the board region. */
  'aria-label': string;
  /** Controlled columns and cards. */
  columns?: KanbanColumn<TCard>[];
  /** Initial columns and cards when uncontrolled. @default [] */
  defaultColumns?: KanbanColumn<TCard>[];
  /** Called after a card is moved or reordered. Column membership is the card's status. */
  onColumnsChange?: (columns: KanbanColumn<TCard>[]) => void;
  /** Identifies the card actually moved, including its previous and new positions. */
  onCardMove?: (move: KanbanMove<TCard>) => void;
  /** Show a status selector on each card, allowing direct moves to any column. */
  showStatusSelect?: boolean;
  /** Optional custom card content; movement controls remain available. */
  renderCard?: (card: TCard) => ReactNode;
  /** Content shown in empty columns. */
  emptyState?: ReactNode;
  className?: string;
}

type MoveDirection = 'left' | 'right';
type FocusAction = MoveDirection | 'up' | 'down' | 'status';

const dragType = 'application/x-dc-kanban-card';

function CardList<TCard extends KanbanCard>({
  column, children, boardId, dragKeysRef, move, emptyState,
}: {
  column: KanbanColumn<TCard>;
  children: (card: TCard) => ReactNode;
  boardId: string;
  dragKeysRef: { current: { cardId: string; sourceId: string } | null };
  move: (cardId: string, sourceId: string, targetId: string, index: number) => void;
  emptyState: ReactNode;
}) {
  const t = useMessages().components;
  const drop = (key?: Key, position?: string) => {
    const dragged = dragKeysRef.current;
    if (!dragged) return;
    const index = key === undefined ? column.cards.length : column.cards.findIndex((card) => card.id === key);
    if (index < 0) return;
    move(dragged.cardId, dragged.sourceId, column.id, index + (position === 'after' ? 1 : 0));
  };
  const { dragAndDropHooks } = useDragAndDrop<TCard>({
    getItems: (keys) => [...keys].map((key) => ({ [dragType]: `${boardId}:${key}` })),
    acceptedDragTypes: [dragType],
    getAllowedDropOperations: () => ['move'],
    getDropOperation: () => dragKeysRef.current ? 'move' : 'cancel',
    onDragStart: (event) => {
      const key = [...event.keys][0];
      if (typeof key === 'string') dragKeysRef.current = { cardId: key, sourceId: column.id };
    },
    onDragEnd: () => { dragKeysRef.current = null; },
    onReorder: (event) => drop(event.target.key, event.target.dropPosition),
    onInsert: (event) => drop(event.target.key, event.target.dropPosition),
    onRootDrop: () => drop(),
    renderDropIndicator: (target) => <DropIndicator target={target} className={styles.dropIndicator} />,
  });
  return (
    <GridList
      items={column.cards}
      dependencies={[children]}
      aria-label={t.kanbanColumn(column.title)}
      selectionMode="none"
      dragAndDropHooks={dragAndDropHooks}
      className={styles.cardList}
      renderEmptyState={() => <div className={styles.emptyState}>{emptyState}</div>}
    >
      {(card) => (
        <GridListItem id={card.id} textValue={card.title} className={styles.card}>
          <Button slot="drag" aria-label={t.kanbanDrag(card.title)} className={styles.handle}>
            <GripVertical aria-hidden="true" />
          </Button>
          {children(card)}
        </GridListItem>
      )}
    </GridList>
  );
}

/** Drag cards between columns or reorder them; move controls remain available without dragging. */
export function KanbanBoard<TCard extends KanbanCard = KanbanCard>({
  'aria-label': ariaLabel,
  columns: columnsProp,
  defaultColumns = [],
  onColumnsChange,
  onCardMove,
  showStatusSelect = false,
  renderCard,
  emptyState,
  className,
}: KanbanBoardProps<TCard>) {
  const messages = useMessages();
  const t = messages.components;
  const { direction } = useLocale();
  const [uncontrolledColumns, setUncontrolledColumns] = useState(defaultColumns);
  const [announcement, setAnnouncement] = useState('');
  const columns = columnsProp ?? uncontrolledColumns;
  const boardId = useId();
  const dragKeysRef = useRef<{ cardId: string; sourceId: string } | null>(null);
  const pendingFocus = useRef<{ cardId: string; direction: FocusAction } | null>(null);

  const restoreFocus = (node: HTMLButtonElement | HTMLSelectElement | null, cardId: string, direction: FocusAction) => {
    const pending = pendingFocus.current;
    if (!node || pending?.cardId !== cardId || pending.direction !== direction) return;
    requestAnimationFrame(() => {
      if (!node.isConnected) return;
      // Enter the moved row first so the grid updates its keyboard-focused key.
      node.closest<HTMLElement>('[role="row"]')?.focus();
      node.focus();
      pendingFocus.current = null;
    });
  };

  const move = (cardId: string, sourceId: string, targetId: string, index: number) => {
    const next = moveKanbanCard(columns, cardId, sourceId, targetId, index);
    if (next === columns) return;
    const target = next.find((column) => column.id === targetId)!;
    const card = target.cards.find((item) => item.id === cardId)!;
    const sourceIndex = columns.find((column) => column.id === sourceId)!.cards.findIndex((item) => item.id === cardId);
    const targetIndex = target.cards.findIndex((item) => item.id === cardId);
    setAnnouncement(sourceId === targetId
      ? messages.itemMoved(card.title, targetIndex + 1, target.cards.length)
      : t.kanbanMoved(card.title, target.title));
    if (columnsProp === undefined) setUncontrolledColumns(next);
    onColumnsChange?.(next);
    onCardMove?.({ card, sourceColumnId: sourceId, targetColumnId: targetId, sourceIndex, targetIndex });
  };

  const moveCard = (cardId: string, sourceId: string, direction: MoveDirection) => {
    const sourceIndex = columns.findIndex((column) => column.id === sourceId);
    const targetIndex = sourceIndex + (direction === 'left' ? -1 : 1);
    const target = columns[targetIndex];
    if (!target) return;
    pendingFocus.current = { cardId, direction: targetIndex === 0 ? 'right' : targetIndex === columns.length - 1 ? 'left' : direction };
    move(cardId, sourceId, target.id, target.cards.length);
  };

  return (
    <div className={cx(styles.root, className)} role="region" aria-label={ariaLabel}>
      <div className={styles.columns}>
        {columns.map((column, columnIndex) => {
          const headingId = `${boardId}-column-${encodeURIComponent(column.id)}`;
          return (
            <section key={column.id} className={styles.column} aria-labelledby={headingId}>
              <header className={styles.columnHeader}>
                <div className={styles.headingText}>
                  <Heading id={headingId} level={2} className={styles.columnTitle}>{column.title}</Heading>
                  {column.description ? <p className={styles.columnDescription}>{column.description}</p> : null}
                </div>
                <span className={styles.count} aria-label={t.kanbanCount(column.cards.length)}>
                  {column.cards.length}
                </span>
              </header>
              <CardList column={column} boardId={boardId} dragKeysRef={dragKeysRef} move={move} emptyState={emptyState ?? t.kanbanEmpty}>
                {(card) => (
                  <>
                    <div className={styles.cardContent}>
                      {renderCard ? renderCard(card) : (
                        <>
                          <Heading level={3} className={styles.cardTitle}>{card.title}</Heading>
                          {card.description ? <div className={styles.cardDescription}>{card.description}</div> : null}
                          {card.labels?.length ? (
                            <ul className={styles.labels} aria-label={t.kanbanLabels(card.title)}>
                              {card.labels.map((label) => <li key={label} className={styles.label}>{label}</li>)}
                            </ul>
                          ) : null}
                        </>
                      )}
                    </div>
                    <div className={styles.cardActions}>
                      {showStatusSelect ? (
                        <select
                          ref={(node) => restoreFocus(node, card.id, 'status')}
                          id={`${boardId}-card-${encodeURIComponent(card.id)}-status`}
                          aria-label={t.kanbanStatus(card.title)}
                          value={column.id}
                          onChange={(event) => {
                            const target = columns.find((item) => item.id === event.target.value);
                            if (target) {
                              pendingFocus.current = { cardId: card.id, direction: 'status' };
                              move(card.id, column.id, target.id, target.cards.length);
                            }
                          }}
                        >
                          {columns.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                        </select>
                      ) : null}
                      {columnIndex > 0 ? (
                        <IconButton
                          ref={(node) => restoreFocus(node, card.id, 'left')}
                          id={`${boardId}-card-${encodeURIComponent(card.id)}-left`}
                          size="sm"
                          label={t.kanbanMoveTo(card.title, columns[columnIndex - 1]!.title)}
                          icon={direction === 'rtl' ? <ArrowRight /> : <ArrowLeft />}
                          onPress={() => moveCard(card.id, column.id, 'left')}
                        />
                      ) : null}
                      {columnIndex < columns.length - 1 ? (
                        <IconButton
                          ref={(node) => restoreFocus(node, card.id, 'right')}
                          id={`${boardId}-card-${encodeURIComponent(card.id)}-right`}
                          size="sm"
                          label={t.kanbanMoveTo(card.title, columns[columnIndex + 1]!.title)}
                          icon={direction === 'rtl' ? <ArrowLeft /> : <ArrowRight />}
                          onPress={() => moveCard(card.id, column.id, 'right')}
                        />
                      ) : null}
                      <IconButton
                        ref={(node) => restoreFocus(node, card.id, 'up')}
                        id={`${boardId}-card-${encodeURIComponent(card.id)}-up`}
                        size="sm"
                        label={messages.moveUp(card.title)}
                        icon={<ArrowUp />}
                        isDisabled={column.cards[0]?.id === card.id}
                        onPress={() => {
                          const index = column.cards.indexOf(card);
                          pendingFocus.current = { cardId: card.id, direction: index === 1 ? 'down' : 'up' };
                          move(card.id, column.id, column.id, index - 1);
                        }}
                      />
                      <IconButton
                        ref={(node) => restoreFocus(node, card.id, 'down')}
                        id={`${boardId}-card-${encodeURIComponent(card.id)}-down`}
                        size="sm"
                        label={messages.moveDown(card.title)}
                        icon={<ArrowDown />}
                        isDisabled={column.cards[column.cards.length - 1]?.id === card.id}
                        onPress={() => {
                          const index = column.cards.indexOf(card);
                          pendingFocus.current = { cardId: card.id, direction: index === column.cards.length - 2 ? 'up' : 'down' };
                          move(card.id, column.id, column.id, index + 2);
                        }}
                      />
                    </div>
                  </>
                )}
              </CardList>
            </section>
          );
        })}
      </div>
      <div role="status" className={styles.srOnly}>{announcement}</div>
    </div>
  );
}
