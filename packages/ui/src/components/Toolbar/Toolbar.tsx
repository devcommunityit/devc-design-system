import { createContext, forwardRef, useContext, type HTMLAttributes } from 'react';
import {
  Separator as RACSeparator,
  Toolbar as RACToolbar,
  composeRenderProps,
  type ToolbarProps as RACToolbarProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import styles from './Toolbar.module.css';

type Orientation = 'horizontal' | 'vertical';

const ToolbarOrientationContext = createContext<Orientation | null>(null);

export interface ToolbarProps extends RACToolbarProps {
  /** Visual container: `plain` has no background, `surface` adds border and background. @default 'surface' */
  variant?: 'plain' | 'surface';
}

/**
 * Set of controls (`role="toolbar"`) with a single tab stop: arrow keys move between the controls,
 * Home/End reach the first and last one. Requires an accessible name (`aria-label` or `aria-labelledby`).
 * Accepts Button, IconButton, Toggle, ToggleGroup, DropdownMenu, SplitButton, ToolbarGroup and ToolbarSeparator.
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { variant = 'surface', orientation = 'horizontal', className, ...rest },
  ref,
) {
  return (
    <ToolbarOrientationContext.Provider value={orientation}>
      <RACToolbar
        ref={ref}
        orientation={orientation}
        data-variant={variant}
        className={composeRenderProps(className, (cn) => cx(styles.toolbar, cn))}
        {...rest}
      />
    </ToolbarOrientationContext.Provider>
  );
});

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Name of the group (e.g. "Formatting"), announced when focus enters it. */
  'aria-label'?: string;
}

/** Visual and semantic grouping (`role="group"`) inside a Toolbar. Arrow navigation crosses groups. */
export const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(function ToolbarGroup({ className, ...rest }, ref) {
  return <div ref={ref} role="group" className={cx(styles.group, className)} {...rest} />;
});

export interface ToolbarSeparatorProps {
  className?: string;
}

/** Divider between toolbar groups; its orientation is perpendicular to the toolbar's. */
export const ToolbarSeparator = forwardRef<HTMLElement, ToolbarSeparatorProps>(function ToolbarSeparator({ className }, ref) {
  const toolbarOrientation = useContext(ToolbarOrientationContext);
  const orientation: Orientation = toolbarOrientation === 'vertical' ? 'horizontal' : 'vertical';
  return <RACSeparator ref={ref} orientation={orientation} data-orientation={orientation} className={cx(styles.separator, className)} />;
});
