import { Menu as MenuIcon } from 'lucide-react';
import { forwardRef, useEffect, useId, type ReactNode } from 'react';
import { Link as RACLink } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Header, type HeaderProps } from '../../components/AppShell/AppShell';
import { Drawer } from '../../components/Drawer/Drawer';
import { IconButton } from '../../components/IconButton/IconButton';
import styles from './SiteHeader.module.css';

export interface SiteHeaderLink {
  id: string;
  label: ReactNode;
  href: string;
}

/** Media query used to switch between inline links and the menu drawer (`md` breakpoint). */
export const SITE_HEADER_WIDE_QUERY = '(width >= 768px)';

export interface SiteHeaderProps extends Omit<HeaderProps, 'navigation'> {
  /** Primary links. From 768px they are inline; below they move into a drawer opened by a menu button. */
  links: SiteHeaderLink[];
  /** `id` of the current page link (`aria-current="page"`). */
  currentId?: string;
  /** Called when a link is activated (the browser or RouterProvider still follows `href`). */
  onNavigate?: (link: SiteHeaderLink) => void;
  /** Accessible name of the `<nav>` landmark. @default messages.siteNavigation */
  navigationLabel?: string;
  /** Extra content at the bottom of the mobile drawer (e.g. sign-in buttons hidden in the bar on small screens). */
  drawerFooter?: ReactNode;
  /** Controlled state of the mobile drawer. */
  isMenuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuOpenChange?: (isOpen: boolean) => void;
}

/**
 * Public site header: brand, inline links, actions (e.g. sign-in or UserMenu) and a real mobile menu
 * (modal drawer with focus containment). Router-agnostic: links are `<a href>` routed via RouterProvider.
 */
export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(function SiteHeader(
  { links, currentId, onNavigate, navigationLabel, drawerFooter, isMenuOpen, defaultMenuOpen = false, onMenuOpenChange, actions, className, ...rest },
  ref,
) {
  const messages = useMessages();
  const drawerId = useId();
  const [open, setOpen] = useControllableState(isMenuOpen, defaultMenuOpen, onMenuOpenChange, 'isMenuOpen');
  const label = navigationLabel ?? messages.siteNavigation;

  // Close the drawer when the viewport grows past the breakpoint (the menu button disappears).
  useEffect(() => {
    if (!open || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(SITE_HEADER_WIDE_QUERY);
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [open, setOpen]);

  const renderLinks = (variant: 'bar' | 'drawer') => (
    <ul className={variant === 'bar' ? styles.barList : styles.drawerList}>
      {links.map((link) => (
        <li key={link.id}>
          <RACLink
            href={link.href}
            aria-current={link.id === currentId ? 'page' : undefined}
            className={variant === 'bar' ? styles.barLink : styles.drawerLink}
            onPress={() => {
              if (variant === 'drawer') setOpen(false);
              onNavigate?.(link);
            }}
          >
            {link.label}
          </RACLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Header
        ref={ref}
        className={cx(styles.siteHeader, className)}
        navigation={
          <nav aria-label={label} className={styles.barNav}>
            {renderLinks('bar')}
          </nav>
        }
        actions={
          <>
            {actions}
            <IconButton
              variant="ghost"
              className={styles.menuButton}
              label={open ? messages.closeMenu : messages.openMenu}
              icon={<MenuIcon />}
              aria-expanded={open}
              aria-controls={open ? drawerId : undefined}
              onPress={() => setOpen(!open)}
            />
          </>
        }
        {...rest}
      />
      <Drawer id={drawerId} isOpen={open} onOpenChange={setOpen} placement="end" title={label} className={styles.drawer}>
        <nav aria-label={label}>{renderLinks('drawer')}</nav>
        {drawerFooter ? <div className={styles.drawerFooter}>{drawerFooter}</div> : null}
      </Drawer>
    </>
  );
});
