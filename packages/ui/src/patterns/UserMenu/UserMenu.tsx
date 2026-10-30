import { ChevronDown, LogOut } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { Button as RACButton, type Key, type MenuTriggerProps as RACMenuTriggerProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Avatar } from '../../components/Avatar/Avatar';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import { DropdownMenu, Menu, MenuItem, MenuSeparator } from '../../components/DropdownMenu/DropdownMenu';
import { PopoverSurface, type PopoverSurfaceProps } from '../../components/Popover/Popover';
import styles from './UserMenu.module.css';

export interface UserMenuUser {
  name: string;
  /** Secondary identity line (email, username, tenant). */
  email?: string;
  /** Avatar image URL. Initials are shown when missing or when the image fails. */
  avatarSrc?: string;
  /** Short context, e.g. role or organisation. */
  role?: ReactNode;
}

/** `id` of the built-in sign-out item. */
export const USER_MENU_SIGN_OUT_KEY = 'dc-sign-out';

export interface UserMenuProps extends Pick<RACMenuTriggerProps, 'isOpen' | 'defaultOpen' | 'onOpenChange'> {
  user: UserMenuUser;
  /** Menu entries: `MenuItem` (with `href` for links or `id` + `onAction`), `MenuSection`, `MenuSeparator`. */
  children?: ReactNode;
  /** Called with the `id` of the chosen item (items with `href` navigate instead). */
  onAction?: (key: Key) => void;
  /** Adds a final “Sign out” item. The session logic stays in your app. */
  onSignOut?: () => void;
  /** Label of the sign-out item. @default messages.signOut */
  signOutLabel?: string;
  /** Show the name next to the avatar: `always`, `never` or `wide` (from 768px). @default 'wide' */
  showName?: 'always' | 'never' | 'wide';
  /** Popover placement. @default 'bottom end' */
  placement?: PopoverSurfaceProps['placement'];
  /** Class for the trigger button. */
  className?: string;
}

/**
 * Account menu for the signed-in user, usually in `Header` actions: avatar trigger, identity block,
 * consumer-defined items and an optional sign-out item. It contains no authentication logic.
 */
export function UserMenu({
  user,
  children,
  onAction,
  onSignOut,
  signOutLabel,
  showName = 'wide',
  placement = 'bottom end',
  className,
  ...triggerProps
}: UserMenuProps) {
  const messages = useMessages();
  const identityId = useId();
  const signOutText = signOutLabel ?? messages.signOut;
  const handleAction = (key: Key) => {
    if (key === USER_MENU_SIGN_OUT_KEY) onSignOut?.();
    else onAction?.(key);
  };
  return (
    <DropdownMenu {...triggerProps}>
      {/* Name from content (no aria-label): the visible name stays part of the accessible name (WCAG 2.5.3). */}
      <RACButton className={cx(styles.trigger, className)} data-show-name={showName}>
        <VisuallyHidden>{messages.accountMenu(user.name)}</VisuallyHidden>
        <Avatar name={user.name} src={user.avatarSrc} size="sm" isDecorative />
        {showName !== 'never' ? (
          <span className={styles.triggerName} aria-hidden="true">
            {user.name}
          </span>
        ) : null}
        <ChevronDown className={styles.chevron} aria-hidden="true" />
      </RACButton>
      <PopoverSurface placement={placement} className={styles.popover}>
        <div className={styles.identity} id={identityId}>
          <Avatar name={user.name} src={user.avatarSrc} size="md" isDecorative />
          <span className={styles.identityText}>
            <span className={styles.name}>{user.name}</span>
            {user.email ? <span className={styles.email}>{user.email}</span> : null}
            {user.role ? <span className={styles.role}>{user.role}</span> : null}
          </span>
        </div>
        <Menu inline aria-describedby={identityId} onAction={handleAction} className={styles.menu}>
          {children}
          {onSignOut ? <MenuSeparator /> : null}
          {onSignOut ? (
            <MenuItem id={USER_MENU_SIGN_OUT_KEY} icon={<LogOut />} textValue={signOutText}>
              {signOutText}
            </MenuItem>
          ) : null}
        </Menu>
      </PopoverSurface>
    </DropdownMenu>
  );
}
