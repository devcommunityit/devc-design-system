import { ChevronDown } from 'lucide-react';
import { forwardRef, useEffect, useId, useRef, useState, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './NavigationMenu.module.css';

export interface NavigationMenuLink {
  id: string;
  label: ReactNode;
  href: string;
  /** Short helper text shown under the label inside a submenu. */
  description?: ReactNode;
  /** Marks the link of the current page (`aria-current="page"`). */
  current?: boolean;
  linkProps?: Omit<RACLinkProps, 'href' | 'children'>;
}

export interface NavigationMenuGroup {
  id: string;
  label: ReactNode;
  /** Links shown when the group is expanded. */
  items: NavigationMenuLink[];
}

export type NavigationMenuItem = NavigationMenuLink | NavigationMenuGroup;

function isGroup(item: NavigationMenuItem): item is NavigationMenuGroup {
  return 'items' in item;
}

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: NavigationMenuItem[];
  /** `horizontal` for a site header, `vertical` for a sidebar or a mobile drawer. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Site navigation following the WAI-ARIA APG "disclosure navigation" pattern: top-level links and
 * buttons with `aria-expanded` that reveal a list of links. It is not an ARIA menu, so Tab moves
 * through every link. Escape closes the open group and returns focus to its button; moving focus
 * or clicking outside closes it too. On small screens render it `vertical` inside a Drawer or AppShell sidebar.
 */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  { items, orientation = 'horizontal', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const t = useMessages();
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (openId === null || orientation === 'vertical') return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && rootRef.current && !rootRef.current.contains(event.target)) setOpenId(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openId, orientation]);

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'Escape' && openId !== null) {
      event.preventDefault();
      buttonRefs.current.get(openId)?.focus();
      setOpenId(null);
    }
  };

  const onBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (orientation === 'vertical') return;
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    if (next !== null) setOpenId(null);
  };

  return (
    <nav ref={ref} aria-label={ariaLabel ?? t.mainNavigation} data-orientation={orientation} className={cx(styles.nav, className)} {...rest}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- delegated Escape/focus-out handling for the disclosure buttons and links inside (APG disclosure navigation); the list itself is not interactive. */}
      <ul ref={rootRef} className={styles.list} onKeyDown={onKeyDown} onBlur={onBlur}>
        {items.map((item) => {
          if (!isGroup(item)) {
            return (
              <li key={item.id} className={styles.item}>
                <RACLink href={item.href} aria-current={item.current ? 'page' : undefined} className={styles.topLink} {...item.linkProps}>
                  {item.label}
                </RACLink>
              </li>
            );
          }
          const open = openId === item.id;
          const panelId = `${baseId}-${item.id}`;
          const containsCurrent = item.items.some((link) => link.current);
          return (
            <li key={item.id} className={styles.item}>
              <button
                ref={(el) => {
                  if (el) buttonRefs.current.set(item.id, el);
                  else buttonRefs.current.delete(item.id);
                }}
                type="button"
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                data-contains-current={containsCurrent || undefined}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span>{item.label}</span>
                <ChevronDown aria-hidden="true" className={styles.chevron} />
              </button>
              <ul id={panelId} className={styles.panel} hidden={!open}>
                {item.items.map((link) => (
                  <li key={link.id}>
                    <RACLink
                      href={link.href}
                      aria-current={link.current ? 'page' : undefined}
                      className={styles.subLink}
                      onPress={() => {
                        if (orientation === 'horizontal') setOpenId(null);
                      }}
                      {...link.linkProps}
                    >
                      <span className={styles.subLabel}>{link.label}</span>
                      {link.description ? <span className={styles.subDescription}>{link.description}</span> : null}
                    </RACLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});