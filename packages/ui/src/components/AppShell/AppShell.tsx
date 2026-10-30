import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button as RACButton, Link as RACLink } from 'react-aria-components';
import { ChevronDown, Menu } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Drawer } from '../Drawer/Drawer';
import styles from './AppShell.module.css';

/** Viewport width (CSS px) below which the sidebar becomes a Drawer. Matches the `lg` breakpoint. */
export const APP_SHELL_COMPACT_QUERY = '(width < 1024px)';

interface AppShellContextValue {
  hasSidebar: boolean;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCompact: boolean;
  sidebarId: string;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

/** Shell state for custom headers: `{ isSidebarOpen, setSidebarOpen, isCompact, hasSidebar }`. Null outside AppShell. */
export function useAppShell(): AppShellContextValue | null {
  return useContext(AppShellContext);
}

function useIsCompact(): boolean {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(APP_SHELL_COMPACT_QUERY);
    const update = () => setCompact(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return compact;
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Usually a `<Header>`; rendered as the top row. */
  header?: ReactNode;
  /** Usually a `<Sidebar>`. Inline from 1024px, inside a Drawer below. */
  sidebar?: ReactNode;
  footer?: ReactNode;
  /** Title of the mobile navigation drawer. Defaults to the localized "Main" navigation label. */
  sidebarTitle?: ReactNode;
  /** Controlled open state of the mobile sidebar drawer. */
  isSidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** id of the `<main>` element (skip link target). @default auto */
  mainId?: string;
  /** Props for the `<main>` element. */
  mainProps?: HTMLAttributes<HTMLElement>;
}

/**
 * Application frame: skip link, header, responsive sidebar, main landmark and footer.
 * No router dependency: navigation items are links (`href`) and work with RAC `RouterProvider`.
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    header,
    sidebar,
    footer,
    sidebarTitle,
    isSidebarOpen,
    defaultSidebarOpen = false,
    onSidebarOpenChange,
    mainId,
    mainProps,
    className,
    children,
    ...rest
  },
  ref,
) {
  const messages = useMessages();
  const autoId = useId();
  const resolvedMainId = mainId ?? `${autoId}-main`;
  const sidebarId = `${autoId}-sidebar`;
  const isCompact = useIsCompact();
  const [open, setOpen] = useControllableState(isSidebarOpen, defaultSidebarOpen, onSidebarOpenChange, 'isSidebarOpen');
  const hasSidebar = Boolean(sidebar);
  const ctx = useMemo<AppShellContextValue>(
    () => ({ hasSidebar, isSidebarOpen: open, setSidebarOpen: setOpen, isCompact, sidebarId }),
    [hasSidebar, open, setOpen, isCompact, sidebarId],
  );

  return (
    <AppShellContext.Provider value={ctx}>
      <div ref={ref} className={cx(styles.shell, className)} data-has-sidebar={hasSidebar || undefined} {...rest}>
        <a className={styles.skipLink} href={`#${resolvedMainId}`}>
          {messages.skipToContent}
        </a>
        {header ? <div className={styles.headerSlot}>{header}</div> : null}
        <div className={styles.body}>
          {hasSidebar && !isCompact ? (
            <div className={styles.sidebarSlot} id={sidebarId}>
              {sidebar}
            </div>
          ) : null}
          <main tabIndex={-1} {...mainProps} id={resolvedMainId} className={cx(styles.main, mainProps?.className)}>
            {children}
          </main>
        </div>
        {footer ? <div className={styles.footerSlot}>{footer}</div> : null}
        {hasSidebar && isCompact ? (
          <Drawer
            id={sidebarId}
            placement="start"
            title={sidebarTitle ?? messages.mainNavigation}
            isOpen={open}
            onOpenChange={setOpen}
            className={styles.drawer}
          >
            {sidebar}
          </Drawer>
        ) : null}
      </div>
    </AppShellContext.Provider>
  );
});

/* ------------------------------------------------------------------ Header */

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Logo / product name, usually a link to the home page. */
  brand?: ReactNode;
  /** Primary navigation (e.g. NavigationMenu); hidden below 1024px when the shell has a sidebar drawer. */
  navigation?: ReactNode;
  /** Right-aligned actions (search, theme switch, account menu). */
  actions?: ReactNode;
  /** Stick to the top while scrolling. @default true */
  sticky?: boolean;
}

/** Top banner. Inside AppShell it renders the mobile menu button that opens the sidebar drawer. */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { brand, navigation, actions, sticky = true, className, children, ...rest },
  ref,
) {
  const shell = useAppShell();
  const messages = useMessages();
  const showMenuButton = Boolean(shell?.hasSidebar);
  return (
    <header ref={ref} className={cx(styles.header, className)} data-sticky={sticky || undefined} {...rest}>
      {showMenuButton && shell ? (
        <RACButton
          className={styles.menuButton}
          aria-label={shell.isSidebarOpen ? messages.closeMenu : messages.openMenu}
          aria-expanded={shell.isSidebarOpen}
          aria-controls={shell.isSidebarOpen ? shell.sidebarId : undefined}
          onPress={() => shell.setSidebarOpen(!shell.isSidebarOpen)}
        >
          <Menu aria-hidden="true" />
        </RACButton>
      ) : null}
      {brand ? <div className={styles.brand}>{brand}</div> : null}
      {navigation ? (
        <div className={styles.navigation} data-collapsible={showMenuButton || undefined}>
          {navigation}
        </div>
      ) : null}
      {children}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
});

/* ------------------------------------------------------------------ Sidebar */

export interface SidebarItem {
  id: string;
  label: ReactNode;
  href: string;
  /** Decorative icon. */
  icon?: ReactNode;
  /** Trailing element, e.g. a Badge with a count. */
  badge?: ReactNode;
  isDisabled?: boolean;
}

export interface SidebarSection {
  id: string;
  title?: ReactNode;
  items: SidebarItem[];
  /** Section can be collapsed with a disclosure button (requires `title`). */
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  sections: SidebarSection[];
  /** id of the current item: gets `aria-current="page"`. */
  currentId?: string;
  /** Called when an item is activated (after the link navigation starts). Closes the mobile drawer. */
  onNavigate?: (item: SidebarItem) => void;
  /** Accessible name of the `<nav>`. Defaults to the localized "Sidebar". */
  'aria-label'?: string;
  /** Content below the navigation (e.g. help link, user card). */
  footer?: ReactNode;
}

function SidebarGroup({
  section,
  currentId,
  onItemPress,
}: {
  section: SidebarSection;
  currentId?: string;
  onItemPress: (item: SidebarItem) => void;
}) {
  const [expanded, setExpanded] = useState(section.defaultExpanded ?? true);
  const listId = useId();
  const list = (
    <ul className={styles.sidebarList} id={listId} hidden={section.collapsible ? !expanded : undefined}>
      {section.items.map((item) => (
        <li key={item.id}>
          <RACLink
            href={item.href}
            isDisabled={item.isDisabled}
            aria-current={item.id === currentId ? 'page' : undefined}
            className={styles.sidebarLink}
            onPress={() => onItemPress(item)}
          >
            {item.icon ? (
              <span className={styles.sidebarIcon} aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className={styles.sidebarLabel}>{item.label}</span>
            {item.badge ? <span className={styles.sidebarBadge}>{item.badge}</span> : null}
          </RACLink>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={styles.sidebarSection}>
      {section.title && section.collapsible ? (
        <h2 className={styles.sidebarHeading}>
          <RACButton
            className={styles.sidebarToggle}
            aria-expanded={expanded}
            aria-controls={listId}
            onPress={() => setExpanded((v) => !v)}
          >
            <span>{section.title}</span>
            <ChevronDown aria-hidden="true" className={styles.chevron} data-expanded={expanded || undefined} />
          </RACButton>
        </h2>
      ) : section.title ? (
        <h2 className={styles.sidebarHeading}>{section.title}</h2>
      ) : null}
      {list}
    </div>
  );
}

/** Vertical navigation landmark with grouped links. Router-agnostic (`href` + RAC RouterProvider). */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { sections, currentId, onNavigate, footer, className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const messages = useMessages();
  const shell = useAppShell();
  const handlePress = (item: SidebarItem) => {
    onNavigate?.(item);
    if (shell?.isCompact) shell.setSidebarOpen(false);
  };
  return (
    <nav ref={ref} aria-label={ariaLabel ?? messages.sidebar} className={cx(styles.sidebar, className)} {...rest}>
      {sections.map((section) => (
        <SidebarGroup key={section.id} section={section} currentId={currentId} onItemPress={handlePress} />
      ))}
      {footer ? <div className={styles.sidebarFooter}>{footer}</div> : null}
    </nav>
  );
});

/* ------------------------------------------------------------------ Footer */

export interface FooterLinkColumn {
  title: ReactNode;
  links: Array<{ label: ReactNode; href: string }>;
}

export interface FooterLink {
  label: ReactNode;
  href: string;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Columns of links; each column is a labelled `<nav>`-free list (use one landmark per page). */
  columns?: FooterLinkColumn[];
  /** Brand or short description, shown first. */
  brand?: ReactNode;
  /** Bottom line: copyright and similar notes. */
  legal?: ReactNode;
  /** Short links in the bottom line (privacy, cookie, terms, accessibility statement). */
  legalLinks?: FooterLink[];
  /** Social or contact links (e.g. IconButton/LinkButton list), shown in the bottom line. */
  social?: ReactNode;
  /** `default`: columns + bottom line. `compact`: a single row (brand, legal links, legal text) for portals. @default 'default' */
  variant?: 'default' | 'compact';
}

/** Page footer (`contentinfo` landmark when not nested in article/section). */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { columns, brand, legal, legalLinks, social, variant = 'default', className, children, ...rest },
  ref,
) {
  const compact = variant === 'compact';
  const hasBottom = Boolean(legal || legalLinks?.length || social || (compact && brand));
  return (
    <footer ref={ref} className={cx(styles.footer, className)} data-variant={variant} {...rest}>
      {!compact && (brand || columns?.length) ? (
        <div className={styles.footerTop}>
          {brand ? <div className={styles.footerBrand}>{brand}</div> : null}
          {columns?.map((column, index) => (
            <div key={index} className={styles.footerColumn}>
              <h2 className={styles.footerTitle}>{column.title}</h2>
              <ul className={styles.footerLinks}>
                {column.links.map((link, i) => (
                  <li key={i}>
                    <RACLink href={link.href} className={styles.footerLink}>
                      {link.label}
                    </RACLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
      {children}
      {hasBottom ? (
        <div className={styles.footerLegal}>
          {compact && brand ? <div className={styles.footerBrand}>{brand}</div> : null}
          {legal ? <div className={styles.footerLegalText}>{legal}</div> : null}
          {legalLinks?.length ? (
            <ul className={styles.footerLegalLinks}>
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <RACLink href={link.href} className={styles.footerLink}>
                    {link.label}
                  </RACLink>
                </li>
              ))}
            </ul>
          ) : null}
          {social ? <div className={styles.footerSocial}>{social}</div> : null}
        </div>
      ) : null}
    </footer>
  );
});
