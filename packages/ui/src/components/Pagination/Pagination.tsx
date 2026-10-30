import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Button as RACButton, Link as RACLink } from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import styles from './Pagination.module.css';

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Pure helper: pages to render for `page` (1-based) of `totalPages`, with `siblingCount`
 * neighbours and ellipses. Always includes the first and last page.
 */
export function getPaginationItems(page: number, totalPages: number, siblingCount = 1): PaginationItem[] {
  const total = Math.max(0, Math.floor(totalPages));
  if (total === 0) return [];
  const current = Math.min(Math.max(1, Math.floor(page)), total);
  const slots = siblingCount * 2 + 5;
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(current - siblingCount, 2);
  const end = Math.min(current + siblingCount, total - 1);
  const showStartEllipsis = start > 3;
  const showEndEllipsis = end < total - 2;
  const items: PaginationItem[] = [1];
  if (showStartEllipsis) items.push('ellipsis-start');
  else for (let p = 2; p < start; p += 1) items.push(p);
  for (let p = start; p <= end; p += 1) items.push(p);
  if (showEndEllipsis) items.push('ellipsis-end');
  else for (let p = end + 1; p < total; p += 1) items.push(p);
  items.push(total);
  return items;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Total number of pages (>= 0). */
  totalPages: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** @default 1 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Neighbours shown around the current page. @default 1 */
  siblingCount?: number;
  /** Show first/last page buttons. @default false */
  showFirstLast?: boolean;
  /**
   * Render real links (better for SEO/public pages) instead of buttons.
   * Works with any router through react-aria-components `RouterProvider`.
   */
  getPageHref?: (page: number) => string;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/**
 * Page navigation (`<nav>` landmark). On narrow containers only previous/next and "Page x of y" remain.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { totalPages, page: pageProp, defaultPage = 1, onPageChange, siblingCount = 1, showFirstLast, getPageHref, size = 'md', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale, direction } = useLocale();
  const [rawPage, setPage] = useControllableState(pageProp, defaultPage, onPageChange, 'Pagination.page');
  const total = Math.max(0, Math.floor(totalPages));
  const page = total === 0 ? 0 : Math.min(Math.max(1, rawPage), total);
  const fmt = new Intl.NumberFormat(locale);
  const go = (p: number) => {
    if (p !== page && p >= 1 && p <= total) setPage(p);
  };
  const rtl = direction === 'rtl';
  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;
  const First = rtl ? ChevronsRight : ChevronsLeft;
  const Last = rtl ? ChevronsLeft : ChevronsRight;

  const control = (target: number, label: string, content: ReactNode, opts: { current?: boolean; disabled?: boolean; kind: 'page' | 'step' }) => {
    const common = {
      className: styles.control,
      'aria-label': label,
      'data-kind': opts.kind,
      'data-current': opts.current || undefined,
    };
    if (getPageHref && !opts.disabled && !opts.current) {
      return (
        <RACLink {...common} href={getPageHref(target)} onPress={() => go(target)}>
          {content}
        </RACLink>
      );
    }
    return (
      <RACButton {...common} aria-current={opts.current ? 'page' : undefined} isDisabled={opts.disabled} onPress={() => go(target)}>
        {content}
      </RACButton>
    );
  };

  return (
    <nav ref={ref} aria-label={ariaLabel ?? t.pagination} data-size={size} className={cx(styles.pagination, className)} {...rest}>
      <ul className={styles.list}>
        {showFirstLast ? <li>{control(1, t.firstPage, <First aria-hidden="true" />, { disabled: page <= 1, kind: 'step' })}</li> : null}
        <li>{control(page - 1, t.previousPage, <Prev aria-hidden="true" />, { disabled: page <= 1, kind: 'step' })}</li>
        {getPaginationItems(page, total, siblingCount).map((item) =>
          typeof item === 'number' ? (
            <li key={item} className={styles.pageItem}>
              {control(item, t.goToPage(item), fmt.format(item), { current: item === page, kind: 'page' })}
            </li>
          ) : (
            <li key={item} className={styles.pageItem} aria-hidden="true">
              <span className={styles.ellipsis}>…</span>
            </li>
          ),
        )}
        <li className={styles.summary}>
          {t.pageOf(page, total)}
        </li>
        <li>{control(page + 1, t.nextPage, <Next aria-hidden="true" />, { disabled: page >= total, kind: 'step' })}</li>
        {showFirstLast ? <li>{control(total, t.lastPage, <Last aria-hidden="true" />, { disabled: page >= total, kind: 'step' })}</li> : null}
      </ul>
    </nav>
  );
});