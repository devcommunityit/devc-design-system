import { forwardRef, type ReactNode } from 'react';
import { composeRenderProps } from 'react-aria-components';
import { Button, type ButtonProps } from '../Button/Button';
import { cx } from '../../utils';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon' | 'fullWidth' | 'aria-label'> {
  /** Accessible name (required: the button has no visible text). */
  label: string;
  /** Decorative icon (hidden from assistive technology). */
  icon: ReactNode;
  /** @default 'ghost' */
  variant?: ButtonProps['variant'];
  /** @default 'md' */
  size?: ButtonProps['size'];
}

/**
 * Square button with only an icon. The `label` is mandatory and becomes the accessible name;
 * wrap it in a Tooltip when the icon meaning is not obvious to sighted users.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', className, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      variant={variant}
      startIcon={icon}
      className={composeRenderProps(className, (cn) => cx(styles.iconButton, cn))}
      {...rest}
    />
  );
});