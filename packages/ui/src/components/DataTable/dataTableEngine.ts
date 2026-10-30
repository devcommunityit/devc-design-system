import type { ReactNode } from 'react';

/** Primitive value used for sorting, default rendering and text search. */
export type CellValue = string | number | boolean | Date | null | undefined;

export type RowId = string | number;

export interface DataTableColumn<T> {
  /** Unique, stable column id (also used in `SortState.column`). */
  id: string;
  /** Header text; also the accessible name of the column. */
  header: string;
  /** Raw value used for sorting, searching and (when `cell` is absent) display. */
  accessor?: (row: T) => CellValue;
  /** Custom cell content. */
  cell?: (row: T) => ReactNode;
  /** Enables sorting (local: needs `accessor` or `sortFn`). @default false */
  sortable?: boolean;
  /** Custom comparator for local sorting (ascending). */
  sortFn?: (a: T, b: T) => number;
  /** Include in local text search. @default true when `accessor` is set */
  searchable?: boolean;
  /** Marks the cell that names the row (at least one column should). */
  isRowHeader?: boolean;
  /** @default 'start' */
  align?: 'start' | 'center' | 'end';
  /** Minimum inline size (CSS length) to avoid cramped columns on narrow screens. */
  minWidth?: string;
  /** Visually hide the header text (it stays accessible), e.g. for an actions column. */
  hideHeader?: boolean;
}

export interface SortState {
  column: string;
  direction: 'ascending' | 'descending';
}

/** Locale-aware comparison: numbers and dates numerically, strings with a numeric collator, empty values last. */
export function compareValues(a: CellValue, b: CellValue, collator: Intl.Collator): number {
  const emptyA = a === null || a === undefined || a === '';
  const emptyB = b === null || b === undefined || b === '';
  if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

/** Stable sort by a column; returns a new array. Unknown or unsortable columns leave the order unchanged. */
export function sortRows<T>(rows: readonly T[], columns: readonly DataTableColumn<T>[], sort: SortState | null, locale?: string): T[] {
  const copy = [...rows];
  if (!sort) return copy;
  const column = columns.find((c) => c.id === sort.column);
  if (!column || !column.sortable) return copy;
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  const accessor = column.accessor;
  const compare: ((a: T, b: T) => number) | null = column.sortFn ?? (accessor ? (a, b) => compareValues(accessor(a), accessor(b), collator) : null);
  if (!compare) return copy;
  const factor = sort.direction === 'ascending' ? 1 : -1;
  const isEmptyRow = (row: T) => {
    if (column.sortFn || !accessor) return false;
    const value = accessor(row);
    return value === null || value === undefined || value === '';
  };
  // Empty values stay last in both directions; only real values are reversed.
  return copy
    .map((row, index) => ({ row, index, empty: isEmptyRow(row) }))
    .sort((x, y) => (x.empty !== y.empty ? (x.empty ? 1 : -1) : compare(x.row, y.row) * factor) || x.index - y.index)
    .map((entry) => entry.row);
}

function valueToText(value: CellValue, locale?: string): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString(locale);
  return String(value);
}

/** Case- and accent-insensitive "contains" search across searchable columns. */
export function searchRows<T>(rows: readonly T[], columns: readonly DataTableColumn<T>[], query: string, locale?: string): T[] {
  const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase(locale);
  const needle = normalize(query.trim());
  if (!needle) return [...rows];
  const searchable = columns.filter((c) => c.accessor && c.searchable !== false);
  return rows.filter((row) => searchable.some((c) => (c.accessor ? normalize(valueToText(c.accessor(row), locale)).includes(needle) : false)));
}

/** Rows of a 1-based page. */
export function paginateRows<T>(rows: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
}