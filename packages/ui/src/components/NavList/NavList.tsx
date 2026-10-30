import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { forwardRef, useId, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Button as RACButton, Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from './NavList.module.css';

export interface NavListLink {
  id: string;
  label: ReactNode;
  href: string;
  /** Decorative icon. Needed for a meaningful collapsed rail. */
  icon?: ReactNode;
  /** Trailing element, e.g. a Badge with a count (still announced when the rail is collapsed). */
  badge?: ReactNode;
  isDisabled?: boolean;
  /** Extra props for the react-aria Link (target, rel, routerOptions…). */
  linkProps?: Omit<RACLinkProps, 'href' | 'children' | 'className' | 'isDisabled'>;
}

export interface NavListGroup {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** One level of nested links. */
  items: NavListLink[];
}

export type NavListItem = NavListLink | NavListGroup;

export type NavListVariant = 'pill' | 'underline' | 'subtle';

export interface NavListProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'aria-label'> {
  /** Accessible name of the `<nav>` landmark (required: pages usually have several navigations). */
  label: string;
  items: NavListItem[];
  /** id of the link of the current page: gets `aria-current="page"`. */
  currentId?: string;
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** @default 'subtle' */
  variant?: NavListVariant;
  /** Show item icons. @default true */
  showIcons?: boolean;
  /** Vertical only: icon-only rail with tooltips (controlled). */
  collapsed?: boolean;
  /** @default false */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Vertical only: shows the expand/collapse toggle button. @default false */
  collapsible?: boolean;
  /** Ids of the expanded groups (controlled). */
  expandedIds?: string[];
  /** @default groups containing `currentId` */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Called when a link is activated (mouse or keyboard). Call `event.preventDefault()` to route client-side. */
  onNavigate?: (id: string, event: MouseEvent<Element>) => void;
}

function isGroup(item: NavListItem): item is NavListGroup {
  return 'items' in item;
}

function initial(label: ReactNode): string | null {
  if (typeof label !== 'string') return null;
  const first = Array.from(label.trim())[0];
  return first ? first.toLocaleUpperCase() : null;
}

/**
 * Navigation list for portals and admin areas: `<nav aria-label>` + `<ul>` of real links,
 * `aria-current="page"` on the current one. Vertical lists support one level of expandable
 * groups (disclosure buttons) and an icon-only collapsed rail with tooltips; horizontal lists
 * are flat and scroll inline when they overflow.
 */
export const NavList = forwardRef<HTMLElement, NavListProps>(function NavList(
  {
    label,
    items,
    currentId,
    orientation = 'vertical',
    variant = 'subtle',
    showIcons = true,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    collapsible = false,
    expandedIds: expandedProp,
    defaultExpandedIds,
    onExpandedChange,
    onNavigate,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const baseId = useId();
  const vertical = orientation === 'vertical';
  const [collapsedState, setCollapsed] = useControllableState(collapsedProp, defaultCollapsed, onCollapsedChange, 'collapsed');
  const collapsed = vertical && collapsedState;
  const [expanded, setExpanded] = useControllableState(
    expandedProp,
    defaultExpandedIds ?? items.filter((item) => isGroup(item) && item.items.some((link) => link.id === currentId)).map((item) => item.id),
    onExpandedChange,
    'expandedIds',
  );

  const toggleGroup = (id: string) => {
    if (collapsed) {
      setCollapsed(false);
      if (!expanded.includes(id)) setExpanded([...expanded, id]);
      return;
    }
    setExpanded(expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id]);
  };

  const iconFor = (item: { label: ReactNode; icon?: ReactNode }) => {
    if (showIcons && item.icon) {
      return (
        <span className={styles.icon} aria-hidden="true">
          {item.icon}
        </span>
      );
    }
    if (!collapsed) return null;
    return (
      <span className={styles.icon} data-fallback aria-hidden="true">
        {initial(item.label) ?? <span className={styles.dot} />}
      </span>
    );
  };

  const renderLink = (link: NavListLink, nested: boolean) => {
    const { onClick, ...linkProps } = link.linkProps ?? {};
    const anchor = (
      <RACLink
        href={link.href}
        isDisabled={link.isDisabled}
        aria-current={link.id === currentId ? 'page' : undefined}
        data-nested={nested || undefined}
        className={styles.link}
        onClick={(event) => {
          onClick?.(event);
          onNavigate?.(link.id, event);
        }}
        {...linkProps}
      >
        {iconFor(link)}
        <span className={styles.label}>{link.label}</span>
        {link.badge ? <span className={styles.badge}>{link.badge}</span> : null}
      </RACLink>
    );
    return (
      <li key={link.id} className={styles.item}>
        {collapsed ? (
          <Tooltip content={link.label} placement="end">
            {anchor}
          </Tooltip>
        ) : (
          anchor
        )}
      </li>
    );
  };

  const flat: NavListLink[] = vertical ? [] : items.flatMap((item) => (isGroup(item) ? item.items : [item]));

  return (
    <nav
      ref={ref}
      aria-label={label}
      data-orientation={orientation}
      data-variant={variant}
      data-collapsed={collapsed || undefined}
      className={cx(styles.nav, className)}
      {...rest}
    >
      {vertical && collapsible ? (
        <div className={styles.toolbar}>
          <IconButton
            size="sm"
            label={collapsed ? t.expandNavigation : t.collapseNavigation}
            icon={collapsed ? <PanelLeftOpen className={styles.mirror} /> : <PanelLeftClose className={styles.mirror} />}
            onPress={() => setCollapsed(!collapsed)}
          />
        </div>
      ) : null}
      <ul className={styles.list}>
        {vertical
          ? items.map((item) => {
              if (!isGroup(item)) return renderLink(item, false);
              const open = !collapsed && expanded.includes(item.id);
              const panelId = `${baseId}-${item.id}`;
              const containsCurrent = item.items.some((link) => link.id === currentId);
              const trigger = (
                <RACButton
                  className={styles.link}
                  data-group
                  data-contains-current={containsCurrent || undefined}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onPress={() => toggleGroup(item.id)}
                >
                  {iconFor(item)}
                  <span className={styles.label}>{item.label}</span>
                  <ChevronDown aria-hidden="true" className={styles.chevron} data-open={open || undefined} />
                </RACButton>
              );
              return (
                <li key={item.id} className={styles.item}>
                  {collapsed ? (
                    <Tooltip content={item.label} placement="end">
                      {trigger}
                    </Tooltip>
                  ) : (
                    trigger
                  )}
                  <ul id={panelId} className={styles.sublist} hidden={!open}>
                    {item.items.map((link) => renderLink(link, true))}
                  </ul>
                </li>
              );
            })
          : flat.map((link) => renderLink(link, false))}
      </ul>
    </nav>
  );
});
