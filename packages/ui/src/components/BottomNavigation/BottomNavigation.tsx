import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import styles from './BottomNavigation.module.css';

export interface BottomNavigationItem {
  id: string;
  label: string;
  /** Decorative icon (the visible label is always rendered). */
  icon: ReactNode;
  /** Navigate with a link (router via react-aria-components `RouterProvider`). */
  href?: string;
  linkProps?: Omit<RACLinkProps, 'href' | 'children'>;
  /** Small counter/indicator, e.g. a Badge. Include its meaning in `badgeLabel`. */
  badge?: ReactNode;
  /** Accessible text for the badge, e.g. "3 unread". */
  badgeLabel?: string;
}

export interface BottomNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 3–5 primary destinations. */
  items: BottomNavigationItem[];
  /** Controlled current item id. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** `fixed` sticks to the bottom of the viewport (adds safe-area padding). @default 'fixed' */
  position?: 'fixed' | 'static';
  /** Hide from this breakpoint up, where a sidebar or header nav takes over. @default 'lg' */
  hideFrom?: 'md' | 'lg' | 'never';
}

/**
 * Mobile primary navigation bar with icon + label. Items are links (`href`) or buttons;
 * the current one has `aria-current="page"`. Reserve space at the bottom of the page when `position="fixed"`
 * (e.g. `padding-block-end: var(--dc-bottom-navigation-height)`).
 */
export const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(function BottomNavigation(
  { items, value, defaultValue, onChange, position = 'fixed', hideFrom = 'lg', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const t = useMessages();
  const [current, setCurrent] = useControllableState(value, defaultValue ?? items[0]?.id ?? '', onChange, 'BottomNavigation.value');
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? t.mainNavigation}
      data-position={position}
      data-hide-from={hideFrom}
      className={cx(styles.bar, className)}
      {...rest}
    >
      <ul className={styles.list}>
        {items.map((item) => {
          const isCurrent = item.id === current;
          const content = (
            <>
              <span className={styles.iconWrap} aria-hidden="true">
                <span className={styles.icon}>{item.icon}</span>
                {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
              </span>
              <span className={styles.label}>{item.label}</span>
              {item.badgeLabel ? <span className={styles.srOnly}>{`, ${item.badgeLabel}`}</span> : null}
            </>
          );
          return (
            <li key={item.id} className={styles.cell}>
              {item.href !== undefined ? (
                <RACLink
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={styles.item}
                  onPress={() => setCurrent(item.id)}
                  {...item.linkProps}
                >
                  {content}
                </RACLink>
              ) : (
                <button type="button" aria-current={isCurrent ? 'page' : undefined} className={styles.item} onClick={() => setCurrent(item.id)}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
});