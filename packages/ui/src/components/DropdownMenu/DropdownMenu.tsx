import { Check, ChevronRight } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import {
  Header,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuSection as RACMenuSection,
  MenuTrigger as RACMenuTrigger,
  Separator,
  SubmenuTrigger as RACSubmenuTrigger,
  Text,
  composeRenderProps,
  type MenuItemProps as RACMenuItemProps,
  type MenuProps as RACMenuProps,
  type MenuSectionProps as RACMenuSectionProps,
  type MenuTriggerProps as RACMenuTriggerProps,
  type SubmenuTriggerProps as RACSubmenuTriggerProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import { PopoverSurface, type PopoverSurfaceProps } from '../Popover/Popover';
import styles from './DropdownMenu.module.css';

export type DropdownMenuProps = RACMenuTriggerProps;

/**
 * Menu of actions opened by a button. Children: the trigger (Button/IconButton) followed by a `Menu`.
 * Controlled via `isOpen`/`onOpenChange` or uncontrolled. Focus moves into the menu and returns to the trigger.
 */
export function DropdownMenu(props: DropdownMenuProps) {
  return <RACMenuTrigger {...props} />;
}

export interface MenuProps<T extends object> extends RACMenuProps<T> {
  /** Popover placement relative to the trigger. @default 'bottom start' */
  placement?: PopoverSurfaceProps['placement'];
  /** Extra props for the popover surface. */
  popoverProps?: Omit<PopoverSurfaceProps, 'children' | 'placement' | 'className'> & { className?: string };
  /** Render the bare list without a popover (e.g. inside a Card or CommandPalette). @default false */
  inline?: boolean;
}

/**
 * List of `MenuItem`s (role="menu"). Inside `DropdownMenu`/`SubmenuTrigger` it renders in a themed popover.
 * Supports `selectionMode` ('single' | 'multiple') for checkable items.
 */
export function Menu<T extends object>({ placement = 'bottom start', popoverProps, inline, className, ...rest }: MenuProps<T>) {
  const menu = <RACMenu className={composeRenderProps(className, (cn) => cx(styles.menu, cn))} {...rest} />;
  if (inline) return menu;
  return (
    <PopoverSurface placement={placement} {...popoverProps} className={cx(styles.popover, popoverProps?.className)}>
      {menu}
    </PopoverSurface>
  );
}

export interface MenuItemProps<T extends object = object> extends Omit<RACMenuItemProps<T>, 'children'> {
  children?: ReactNode;
  /** Decorative icon. */
  icon?: ReactNode;
  /** Secondary line (linked as description). */
  description?: ReactNode;
  /** Keyboard shortcut hint (visual only: register the shortcut yourself). */
  shortcut?: ReactNode;
  /** Destructive styling. */
  tone?: 'default' | 'danger';
}

export function MenuItem<T extends object = object>({ icon, description, shortcut, tone = 'default', children, className, textValue, ...rest }: MenuItemProps<T>) {
  return (
    <RACMenuItem
      data-tone={tone}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={composeRenderProps(className, (cn) => cx(styles.item, cn))}
      {...rest}
    >
      {({ isSelected, selectionMode, hasSubmenu }) => (
        <>
          {selectionMode !== 'none' ? (
            <span className={styles.check} aria-hidden="true">
              {isSelected ? <Check /> : null}
            </span>
          ) : null}
          {icon ? (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className={styles.text}>
            <Text slot="label" className={styles.label}>
              {children}
            </Text>
            {description ? (
              <Text slot="description" className={styles.description}>
                {description}
              </Text>
            ) : null}
          </span>
          {shortcut ? <kbd className={styles.shortcut}>{shortcut}</kbd> : null}
          {hasSubmenu ? (
            <span className={styles.chevron} aria-hidden="true">
              <ChevronRight />
            </span>
          ) : null}
        </>
      )}
    </RACMenuItem>
  );
}

export interface MenuSectionProps<T extends object> extends Omit<RACMenuSectionProps<T>, 'children' | 'items'> {
  /** Visible group heading. */
  title?: ReactNode;
  children?: ReactNode;
}

export function MenuSection<T extends object>({ title, children, className, ...rest }: MenuSectionProps<T>) {
  return (
    <RACMenuSection className={cx(styles.section, className)} {...rest}>
      {title ? <Header className={styles.header}>{title}</Header> : null}
      {children}
    </RACMenuSection>
  );
}

export const MenuSeparator = forwardRef<HTMLElement, { className?: string }>(function MenuSeparator({ className }, ref) {
  return <Separator ref={ref} className={cx(styles.separator, className)} />;
});

export type SubmenuTriggerProps = RACSubmenuTriggerProps;

/** Wraps a `MenuItem` and a nested `Menu`; opens with ArrowRight (ArrowLeft in RTL), hover or press. */
export function SubmenuTrigger(props: SubmenuTriggerProps) {
  return <RACSubmenuTrigger {...props} />;
}