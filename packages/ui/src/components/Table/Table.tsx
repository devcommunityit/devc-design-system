import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { ScrollArea } from '../ScrollArea';
import styles from './Table.module.css';

export type TableDensity = 'comfortable' | 'compact';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Row height and cell padding. Defaults to the ThemeProvider density. */
  density?: TableDensity;
  /** Zebra rows. @default false */
  striped?: boolean;
  /** Keep the header visible while the wrapper scrolls vertically (needs `maxHeight`). @default false */
  stickyHeader?: boolean;
  /** Max block size of the scroll wrapper (CSS length). */
  maxHeight?: string;
  /** Accessible name of the scroll region when the table overflows. Defaults to `aria-label` or a localized label. */
  scrollRegionLabel?: string;
  /** Class for the scroll wrapper. */
  wrapperClassName?: string;
}

/**
 * Visual, semantic HTML table (no state). Wide tables scroll horizontally inside their own
 * focusable region, never the page. For sorting, selection, filters and paging use DataTable.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density, striped = false, stickyHeader = false, maxHeight, scrollRegionLabel, wrapperClassName, className, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <ScrollArea
      orientation={maxHeight ? 'both' : 'horizontal'}
      maxHeight={maxHeight}
      aria-label={scrollRegionLabel ?? rest['aria-label'] ?? t.scrollableRegion}
      className={cx(styles.wrapper, wrapperClassName)}
    >
      <table
        ref={ref}
        data-density={density}
        data-striped={striped || undefined}
        data-sticky-header={stickyHeader || undefined}
        className={cx(styles.table, className)}
        {...rest}
      />
    </ScrollArea>
  );
});

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption(
  { className, ...rest },
  ref,
) {
  return <caption ref={ref} className={cx(styles.caption, className)} {...rest} />;
});

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHead(
  { className, ...rest },
  ref,
) {
  return <thead ref={ref} className={cx(styles.head, className)} {...rest} />;
});

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody(
  { className, ...rest },
  ref,
) {
  return <tbody ref={ref} className={cx(styles.body, className)} {...rest} />;
});

export const TableFoot = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableFoot(
  { className, ...rest },
  ref,
) {
  return <tfoot ref={ref} className={cx(styles.foot, className)} {...rest} />;
});

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Highlights the row; pair with a visible selected control or text. */
  isSelected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ isSelected, className, ...rest }, ref) {
  return <tr ref={ref} data-selected={isSelected || undefined} className={cx(styles.row, className)} {...rest} />;
});

export type CellAlign = 'start' | 'center' | 'end';

export interface TableHeaderCellProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** @default 'start' */
  align?: CellAlign;
}

/** Header cell (<th>). `scope` defaults to "col"; use scope="row" for row headers. */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell(
  { align = 'start', scope = 'col', className, ...rest },
  ref,
) {
  return <th ref={ref} scope={scope} data-align={align} className={cx(styles.headerCell, className)} {...rest} />;
});

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** @default 'start' */
  align?: CellAlign;
  /** Tabular numerals, end-aligned. @default false */
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, numeric = false, className, ...rest },
  ref,
) {
  return <td ref={ref} data-align={align ?? (numeric ? 'end' : 'start')} data-numeric={numeric || undefined} className={cx(styles.cell, className)} {...rest} />;
});