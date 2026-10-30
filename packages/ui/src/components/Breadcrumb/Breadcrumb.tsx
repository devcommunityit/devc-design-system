import { ChevronRight } from 'lucide-react';
import { Children, forwardRef, isValidElement, useState, type HTMLAttributes, type LiHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /**
   * Collapse middle items into an expandable "…" button when there are more than `maxItems`.
   * The first and the last `maxItems - 1` items stay visible.
   */
  maxItems?: number;
}

/**
 * Trail of links to the current page: `<nav aria-label>` + ordered list. The last item without
 * `href` is the current page (`aria-current="page"`). Router-agnostic: wrap the app in
 * react-aria-components `RouterProvider` for client-side navigation.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { children, maxItems, className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const t = useMessages();
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const collapse = !expanded && maxItems !== undefined && maxItems >= 2 && items.length > maxItems;
  const visible: ReactNode[] = collapse
    ? [
        items[0],
        <li key="__collapsed" className={styles.item}>
          <button type="button" className={styles.more} aria-label={t.moreItems(items.length - maxItems)} onClick={() => setExpanded(true)}>
            …
          </button>
          <Separator />
        </li>,
        ...items.slice(items.length - (maxItems - 1)),
      ]
    : items;
  return (
    <nav ref={ref} aria-label={ariaLabel ?? t.breadcrumb} className={cx(styles.breadcrumb, className)} {...rest}>
      <ol className={styles.list}>{visible}</ol>
    </nav>
  );
});

function Separator() {
  return (
    <span className={styles.separator} aria-hidden="true">
      <ChevronRight />
    </span>
  );
}

export interface BreadcrumbItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  children?: ReactNode;
  /** Link target. Omit on the current page (rendered as text with `aria-current="page"`). */
  href?: string;
  /** Extra props for the inner link (e.g. `routerOptions`, `target`). */
  linkProps?: Omit<RACLinkProps, 'href' | 'children'>;
  /** Force current-page semantics even with an href. */
  isCurrent?: boolean;
}

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, href, linkProps, isCurrent, className, ...rest },
  ref,
) {
  const current = isCurrent ?? href === undefined;
  return (
    <li ref={ref} className={cx(styles.item, className)} {...rest}>
      {current ? (
        <span className={styles.current} aria-current="page">
          {children}
        </span>
      ) : (
        <>
          <RACLink href={href} className={styles.link} {...linkProps}>
            {children}
          </RACLink>
          <Separator />
        </>
      )}
    </li>
  );
});