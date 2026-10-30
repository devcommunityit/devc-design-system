import { forwardRef, type ReactNode } from 'react';
import {
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
  composeRenderProps,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import buttonStyles from '../Button/Button.module.css';
import groupStyles from '../ButtonGroup/ButtonGroup.module.css';
import { cx } from '../../utils';
import styles from './Toggle.module.css';

export interface ToggleProps extends Omit<RACToggleButtonProps, 'children'> {
  children?: ReactNode;
  /** @default 'outline' */
  variant?: 'outline' | 'ghost';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Decorative icon before the label. */
  icon?: ReactNode;
}

/**
 * Two-state button (`aria-pressed`) for a persistent on/off option such as "Bold" or "Favourite".
 * Controlled (`isSelected` + `onChange`) or uncontrolled (`defaultSelected`). Inside a ToggleGroup pass an `id`.
 * Icon-only toggles need `aria-label`.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { variant = 'outline', size = 'md', icon, className, children, ...rest },
  ref,
) {
  const iconOnly = !children;
  return (
    <RACToggleButton
      ref={ref}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      className={composeRenderProps(className, (cn) => cx(buttonStyles.button, styles.toggle, cn))}
      {...rest}
    >
      {icon ? (
        <span className={buttonStyles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children ? <span className={buttonStyles.label}>{children}</span> : null}
    </RACToggleButton>
  );
});

export interface ToggleGroupProps extends RACToggleButtonGroupProps {
  /** Join the toggles into a segmented control. @default true */
  attached?: boolean;
}

/**
 * Set of Toggles with single (`selectionMode="single"`, default) or multiple selection.
 * Arrow keys move focus between items (one tab stop). Controlled via `selectedKeys`/`onSelectionChange`
 * or uncontrolled via `defaultSelectedKeys`. Requires an accessible name (`aria-label`/`aria-labelledby`).
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  { attached = true, orientation = 'horizontal', selectionMode = 'single', className, ...rest },
  ref,
) {
  return (
    <RACToggleButtonGroup
      ref={ref}
      orientation={orientation}
      selectionMode={selectionMode}
      data-attached={attached || undefined}
      className={composeRenderProps(className, (cn) => cx(groupStyles.group, styles.toggleGroup, cn))}
      {...rest}
    />
  );
});