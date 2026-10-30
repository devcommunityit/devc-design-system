import { ChevronDown } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import type { Key } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button, type ButtonProps } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { DropdownMenu, Menu } from '../DropdownMenu/DropdownMenu';
import { IconButton } from '../IconButton/IconButton';
import styles from './SplitButton.module.css';

export interface SplitButtonProps {
  /** Label of the primary action. */
  children: ReactNode;
  /** Primary action. */
  onPress?: ButtonProps['onPress'];
  /** `MenuItem`s (with `id`) for the secondary actions. */
  menu: ReactNode;
  /** Called with the `id` of the chosen secondary action. */
  onAction?: (key: Key) => void;
  /** Keys of disabled secondary actions. */
  disabledKeys?: Iterable<Key>;
  /** Accessible name of the menu button. @default localized "More actions" */
  menuLabel?: string;
  /** @default 'primary' */
  variant?: Exclude<ButtonProps['variant'], 'ghost'>;
  /** @default 'md' */
  size?: ButtonProps['size'];
  /** Disables both buttons. */
  isDisabled?: boolean;
  /** Primary action in progress: the primary button shows a spinner, the menu stays available. */
  isPending?: boolean;
  /** Decorative icon of the primary action. */
  startIcon?: ReactNode;
  /** `type` of the primary button (e.g. `submit` inside a form). @default 'button' */
  type?: ButtonProps['type'];
  className?: string;
  id?: string;
  'aria-label'?: string;
}

/**
 * Primary action plus a menu of related secondary actions, rendered as two real buttons in a named group.
 * The menu button opens a `Menu` (Enter, Space, ArrowDown/ArrowUp) and returns focus on close.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  {
    children,
    onPress,
    menu,
    onAction,
    disabledKeys,
    menuLabel,
    variant = 'primary',
    size = 'md',
    isDisabled,
    isPending,
    startIcon,
    type = 'button',
    className,
    id,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const t = useMessages();
  return (
    <ButtonGroup
      ref={ref}
      id={id}
      attached
      aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
      data-variant={variant}
      className={cx(styles.splitButton, className)}
    >
      <Button variant={variant} size={size} isDisabled={isDisabled} isPending={isPending} startIcon={startIcon} type={type} onPress={onPress}>
        {children}
      </Button>
      <DropdownMenu>
        <IconButton
          variant={variant}
          size={size}
          isDisabled={isDisabled}
          label={menuLabel ?? t.moreActions}
          icon={<ChevronDown />}
          className={styles.menuButton}
        />
        <Menu placement="bottom end" onAction={(key) => onAction?.(key)} disabledKeys={disabledKeys}>
          {menu}
        </Menu>
      </DropdownMenu>
    </ButtonGroup>
  );
});
