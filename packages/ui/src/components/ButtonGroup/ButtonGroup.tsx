import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Join the buttons into a single segmented control. @default false */
  attached?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Name of the group, announced by screen readers (recommended). */
  'aria-label'?: string;
}

/**
 * Groups related buttons (`role="group"`). Every child stays an independent tab stop;
 * for single/multiple selection use ToggleGroup, for a set of tools with arrow-key navigation use a Toolbar.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { attached = false, orientation = 'horizontal', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      data-attached={attached || undefined}
      data-orientation={orientation}
      className={cx(styles.group, className)}
      {...rest}
    />
  );
});