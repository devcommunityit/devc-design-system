import { ArrowDown, ArrowUp, ArrowUpDown, Check, Minus } from 'lucide-react';
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import {
  Cell,
  Checkbox as RACCheckbox,
  Column,
  Row,
  Table as RACTable,
  TableBody as RACTableBody,
  TableHeader as RACTableHeader,
  type Key,
  type Selection,
  type SortDescriptor,
} from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Alert } from '../Alert';
import { Button } from '../Button';
import checkboxStyles from '../Checkbox/Checkbox.module.css';
import { NativeSelect } from '../NativeSelect';
import { Pagination } from '../Pagination';
import { Progress } from '../Progress';
import { ScrollArea } from '../ScrollArea';
import { SearchInput } from '../SearchInput';
import { Spinner } from '../Spinner';
import tableStyles from '../Table/Table.module.css';
import { VisuallyHidden } from '../VisuallyHidden';
import {
  pageCount,
  paginateRows,
  searchRows,
  sortRows,
  type CellValue,
  type DataTableColumn,
  type RowId,
  type SortState,
} from './dataTableEngine';
import styles from './DataTable.module.css';

export interface DataTableProps<T extends object, K extends RowId = RowId> {
  columns: readonly DataTableColumn<T>[];
  /** Local mode: all rows. Server mode: only the rows of the current page, already sorted and filtered. */
  rows: readonly T[];
  /** Stable, unique id of a row. */
  getRowId: (row: T) => K;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /**
   * `local`: sorting, search, `filter` and paging happen in the browser.
   * `server`: the component only reports state changes; you fetch and pass the page rows and `totalRows`. @default 'local'
   */
  mode?: 'local' | 'server';
  /** Server mode: total rows matching the current filters. */
  totalRows?: number;

  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;

  /** Shows a search field in the toolbar. @default false */
  searchable?: boolean;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** @default localized "Search" */
  searchLabel?: string;
  /** Local mode: extra predicate from your own filter controls. */
  filter?: (row: T) => boolean;
  /** Tells the table that filters are active, so an empty result shows "no results" instead of "no data". */
  isFiltered?: boolean;
  /** Shows a "clear filters" action in the no-results state. Reset your own filters here (search is cleared automatically). */
  onClearFilters?: () => void;
  /** Extra toolbar content: filter controls, export button… */
  toolbar?: ReactNode;

  /** @default true */
  paginated?: boolean;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  /** @default [10, 25, 50] */
  pageSizeOptions?: number[];

  /** @default 'none' */
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedIds?: ReadonlySet<K>;
  defaultSelectedIds?: ReadonlySet<K>;
  onSelectionChange?: (ids: ReadonlySet<K>) => void;
  isRowDisabled?: (row: T) => boolean;
  /** Toolbar content shown while rows are selected (e.g. bulk delete). */
  renderBulkActions?: (ids: K[]) => ReactNode;
  /** Primary action of a row (Enter or click when not selecting), e.g. open details. */
  onRowAction?: (row: T) => void;

  isLoading?: boolean;
  /** Error message; when set the error state replaces the rows. */
  error?: ReactNode;
  onRetry?: () => void;
  /** Content when there is no data at all. */
  emptyState?: ReactNode;
  /** Content when filters exclude every row. */
  noResultsState?: ReactNode;

  density?: 'comfortable' | 'compact';
  striped?: boolean;
  stickyHeader?: boolean;
  /** Max block size of the scrolling area (enables a sticky header with `stickyHeader`). */
  maxHeight?: string;
  className?: string;
  style?: CSSProperties;
}

function renderValue(value: CellValue, locale: string): ReactNode {
  if (value === null || value === undefined || value === '') return <span className={styles.missing}>—</span>;
  if (value instanceof Date) return value.toLocaleDateString(locale);
  if (typeof value === 'number') return new Intl.NumberFormat(locale).format(value);
  if (typeof value === 'boolean') return String(value);
  return value;
}

/**
 * Data grid engine on top of the visual Table styles: typed columns, sorting, search/filters,
 * pagination and row selection, in local or server-controlled mode. Implements the APG grid
 * pattern via react-aria (arrow-key cell navigation). No virtualization: page your data.
 */
export function DataTable<T extends object, K extends RowId = RowId>(props: DataTableProps<T, K>) {
  const {
    columns,
    rows,
    getRowId,
    mode = 'local',
    totalRows,
    searchable = false,
    searchLabel,
    filter,
    isFiltered = false,
    onClearFilters,
    toolbar,
    paginated = true,
    pageSizeOptions = [10, 25, 50],
    selectionMode = 'none',
    isRowDisabled,
    renderBulkActions,
    onRowAction,
    isLoading = false,
    error,
    onRetry,
    emptyState,
    noResultsState,
    density,
    striped,
    stickyHeader,
    maxHeight,
    className,
    style,
  } = props;
  const t = useMessages();
  const { locale } = useLocale();

  const [sort, setSort] = useControllableState<SortState | null>(props.sort, props.defaultSort ?? null, props.onSortChange, 'sort');
  const [search, setSearch] = useControllableState(props.search, props.defaultSearch ?? '', props.onSearchChange, 'search');
  const [page, setPage] = useControllableState(props.page, props.defaultPage ?? 1, props.onPageChange, 'page');
  const [pageSize, setPageSize] = useControllableState(props.pageSize, props.defaultPageSize ?? pageSizeOptions[0] ?? 10, props.onPageSizeChange, 'pageSize');
  const [selected, setSelected] = useControllableState<ReadonlySet<K>>(
    props.selectedIds,
    props.defaultSelectedIds ?? new Set<K>(),
    props.onSelectionChange,
    'selectedIds',
  );

  const isLocal = mode === 'local';
  const processed = useMemo(() => {
    if (!isLocal) return rows;
    const filtered = filter ? rows.filter(filter) : rows;
    return sortRows(searchRows(filtered, columns, search, locale), columns, sort, locale);
  }, [isLocal, rows, filter, columns, search, sort, locale]);

  const total = isLocal ? processed.length : (totalRows ?? rows.length);
  const totalPages = paginated ? pageCount(total, pageSize) : 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageRows = isLocal && paginated ? paginateRows(processed, currentPage, pageSize) : processed;
  const visibleRows = error ? [] : pageRows;

  const pageIds = visibleRows.map(getRowId);
  const disabledIds = isRowDisabled ? visibleRows.filter(isRowDisabled).map(getRowId) : [];
  const pageSelected = new Set<Key>(pageIds.filter((id) => selected.has(id)));
  const selectedList = [...selected];

  const filtersActive = isFiltered || search.trim() !== '' || (isLocal && rows.length > 0);

  const handleSelection = (keys: Selection) => {
    const chosen = keys === 'all' ? pageIds.filter((id) => !disabledIds.includes(id)) : pageIds.filter((id) => keys.has(id));
    if (selectionMode === 'single') {
      setSelected(new Set(chosen));
      return;
    }
    const next = new Set(selected);
    for (const id of pageIds) next.delete(id);
    for (const id of chosen) next.add(id);
    setSelected(next);
  };

  const handleSort = (descriptor: SortDescriptor) => {
    setSort({ column: String(descriptor.column), direction: descriptor.direction });
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    if (currentPage !== 1) setPage(1);
  };

  const clearFilters = () => {
    if (search !== '') changeSearch('');
    onClearFilters?.();
  };

  const renderEmpty = () => {
    if (error) {
      return (
        <div className={styles.state}>
          <Alert tone="danger" title={t.loadError} actions={onRetry ? <Button size="sm" variant="secondary" onPress={onRetry}>{t.retry}</Button> : undefined}>
            {error}
          </Alert>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className={styles.state} role="status">
          <Spinner size="sm" label={null} />
          <span>{t.loading}</span>
        </div>
      );
    }
    if (filtersActive) {
      return (
        <div className={styles.state}>
          {noResultsState ?? <span className={styles.stateTitle}>{t.noResults}</span>}
          {search !== '' || onClearFilters ? (
            <Button size="sm" variant="secondary" onPress={clearFilters}>
              {t.clearFilters}
            </Button>
          ) : null}
        </div>
      );
    }
    return <div className={styles.state}>{emptyState ?? <span className={styles.stateTitle}>{t.noData}</span>}</div>;
  };

  const sortDescriptor: SortDescriptor | undefined = sort ? { column: sort.column, direction: sort.direction } : undefined;
  const rangeStart = total === 0 ? 0 : paginated ? (currentPage - 1) * pageSize + 1 : 1;
  const rangeEnd = paginated ? Math.min(total, currentPage * pageSize) : total;
  const showToolbar = searchable || toolbar || (selectionMode !== 'none' && selected.size > 0);

  return (
    <div className={cx(styles.root, className)} style={style} data-loading={isLoading || undefined}>
      {showToolbar ? (
        <div className={styles.toolbar}>
          {searchable ? (
            <SearchInput
              className={styles.search}
              aria-label={searchLabel ?? t.search}
              placeholder={searchLabel ?? t.search}
              value={search}
              onChange={changeSearch}
            />
          ) : null}
          {toolbar ? <div className={styles.toolbarExtra}>{toolbar}</div> : null}
          {selectionMode !== 'none' && selected.size > 0 ? (
            <div className={styles.bulk}>
              <span role="status" className={styles.selectedCount}>
                {t.selectedCount(selected.size)}
              </span>
              {renderBulkActions?.(selectedList)}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={styles.tableArea} aria-busy={isLoading || undefined}>
        {isLoading && visibleRows.length > 0 ? <Progress aria-label={t.loading} size="sm" className={styles.loadingBar} /> : null}
        <ScrollArea orientation={maxHeight ? 'both' : 'horizontal'} maxHeight={maxHeight} className={tableStyles.wrapper}>
          <RACTable
            aria-label={props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            data-density={density}
            data-striped={striped || undefined}
            data-sticky-header={stickyHeader || undefined}
            className={tableStyles.table}
            selectionMode={selectionMode}
            selectionBehavior="toggle"
            selectedKeys={pageSelected}
            onSelectionChange={handleSelection}
            disabledKeys={disabledIds}
            sortDescriptor={sortDescriptor}
            onSortChange={handleSort}
            onRowAction={onRowAction ? (key) => {
              const row = visibleRows.find((r) => getRowId(r) === key);
              if (row) onRowAction(row);
            } : undefined}
          >
            <RACTableHeader className={tableStyles.head}>
              {selectionMode !== 'none' ? (
                <Column className={cx(tableStyles.headerCell, styles.selectionCell)}>
                  {selectionMode === 'multiple' ? (
                    <RACCheckbox slot="selection" aria-label={t.selectAll} className={checkboxStyles.button}>
                      {({ isSelected, isIndeterminate }) => (
                        <span className={checkboxStyles.box} aria-hidden="true">
                          {isIndeterminate ? <Minus /> : isSelected ? <Check /> : null}
                        </span>
                      )}
                    </RACCheckbox>
                  ) : (
                    <VisuallyHidden>{t.selectRow}</VisuallyHidden>
                  )}
                </Column>
              ) : null}
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  isRowHeader={column.isRowHeader}
                  allowsSorting={column.sortable}
                  data-align={column.align ?? 'start'}
                  style={column.minWidth ? { minInlineSize: column.minWidth } : undefined}
                  className={cx(tableStyles.headerCell, column.sortable && styles.sortable)}
                >
                  {({ sortDirection, allowsSorting }) => (
                    <span className={styles.headerContent}>
                      {column.hideHeader ? <VisuallyHidden>{column.header}</VisuallyHidden> : column.header}
                      {allowsSorting ? (
                        <span className={styles.sortIcon} aria-hidden="true" data-active={sortDirection ? true : undefined}>
                          {sortDirection === 'ascending' ? <ArrowUp /> : sortDirection === 'descending' ? <ArrowDown /> : <ArrowUpDown />}
                        </span>
                      ) : null}
                    </span>
                  )}
                </Column>
              ))}
            </RACTableHeader>
            <RACTableBody className={tableStyles.body} items={visibleRows} renderEmptyState={renderEmpty} dependencies={[columns, selectionMode, locale]}>
              {(row) => (
                <Row id={getRowId(row)} className={tableStyles.row}>
                  {selectionMode !== 'none' ? (
                    <Cell className={cx(tableStyles.cell, styles.selectionCell)}>
                      <RACCheckbox slot="selection" aria-label={t.selectRow} className={checkboxStyles.button}>
                        {({ isSelected }) => (
                          <span className={checkboxStyles.box} aria-hidden="true">
                            {isSelected ? <Check /> : null}
                          </span>
                        )}
                      </RACCheckbox>
                    </Cell>
                  ) : null}
                  {columns.map((column) => (
                    <Cell key={column.id} data-align={column.align ?? 'start'} className={tableStyles.cell}>
                      {column.cell ? column.cell(row) : column.accessor ? renderValue(column.accessor(row), locale) : null}
                    </Cell>
                  ))}
                </Row>
              )}
            </RACTableBody>
          </RACTable>
        </ScrollArea>
      </div>

      {paginated && !error && total > 0 ? (
        <div className={styles.footer}>
          <span className={styles.range} role="status">
            {t.rangeOf(rangeStart, rangeEnd, total)}
          </span>
          {pageSizeOptions.length > 1 ? (
            <NativeSelect
              label={t.rowsPerPage}
              wrapperProps={{ className: styles.pageSize }}
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                if (currentPage !== 1) setPage(1);
              }}
              options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
            />
          ) : null}
          {totalPages > 1 ? <Pagination size="sm" totalPages={totalPages} page={currentPage} onPageChange={setPage} className={styles.pagination} /> : null}
        </div>
      ) : null}
    </div>
  );
}