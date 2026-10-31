import type { KanbanCard, KanbanColumn } from './KanbanBoard';

/** targetIndex refers to the destination list before removing the source card. */
export function moveKanbanCard<T extends KanbanCard>(
  columns: KanbanColumn<T>[],
  cardId: string,
  sourceId: string,
  targetId: string,
  targetIndex: number,
): KanbanColumn<T>[] {
  const source = columns.find((column) => column.id === sourceId);
  const target = columns.find((column) => column.id === targetId);
  const sourceIndex = source?.cards.findIndex((card) => card.id === cardId) ?? -1;
  const card = source?.cards[sourceIndex];
  if (!card || !target) return columns;
  const index = Math.max(0, Math.min(target.cards.length, targetIndex));
  const insertAt = sourceId === targetId && sourceIndex < index ? index - 1 : index;
  if (sourceId === targetId && sourceIndex === insertAt) return columns;
  return columns.map((column) => {
    if (column.id !== sourceId && column.id !== targetId) return column;
    const cards = column.cards.filter((item) => item.id !== cardId);
    if (column.id === targetId) cards.splice(insertAt, 0, card);
    return { ...column, cards };
  });
}
