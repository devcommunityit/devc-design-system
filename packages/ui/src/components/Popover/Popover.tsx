import { forwardRef, type ReactNode } from 'react';
import {
  Dialog as RACDialog,
  DialogTrigger,
  Heading,
  OverlayArrow,
  Popover as RACPopover,
  composeRenderProps,
  type DialogProps as RACDialogProps,
  type DialogTriggerProps,
  type PopoverProps as RACPopoverProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import styles from './Popover.module.css';

export interface PopoverSurfaceProps extends RACPopoverProps {
  /** Show a small arrow pointing at the trigger. @default false */
  showArrow?: boolean;
}

/**
 * Styled floating surface (RAC Popover) shared by Select, Combobox, Menu, DatePicker…
 * Rendered in the ThemeProvider portal; flips and resizes to stay in the viewport.
 */
export const PopoverSurface = forwardRef<HTMLElement, PopoverSurfaceProps>(function PopoverSurface(
  { className, children, showArrow, offset = 6, ...rest },
  ref,
) {
  return (
    <RACPopover ref={ref} offset={showArrow ? offset + 4 : offset} className={composeRenderProps(className, (cn) => cx(styles.popover, cn))} {...rest}>
      {composeRenderProps(children, (content) => (
        <>
          {showArrow ? (
            <OverlayArrow className={styles.arrow}>
              <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </OverlayArrow>
          ) : null}
          {content}
        </>
      ))}
    </RACPopover>
  );
});

export type PopoverTriggerProps = DialogTriggerProps;

/** Wraps a pressable trigger and a `Popover`; toggles it on press and restores focus on close. */
export function PopoverTrigger(props: PopoverTriggerProps) {
  return <DialogTrigger {...props} />;
}

export interface PopoverProps extends Omit<PopoverSurfaceProps, 'children'> {
  /** Optional visible heading, also used as the accessible name. */
  title?: ReactNode;
  /** Accessible name when there is no visible title. */
  'aria-label'?: string;
  children?: ReactNode | ((opts: { close: () => void }) => ReactNode);
  /** Props for the inner dialog element. */
  dialogProps?: Omit<RACDialogProps, 'children' | 'className'> & { className?: string };
}

/**
 * Non-modal floating panel with interactive content (non-modal dialog semantics).
 * Closes with Escape or outside click; focus moves inside and returns to the trigger.
 * For plain descriptions on hover/focus use Tooltip instead.
 */
export const Popover = forwardRef<HTMLElement, PopoverProps>(function Popover(
  { title, children, dialogProps, 'aria-label': ariaLabel, showArrow = true, ...rest },
  ref,
) {
  return (
    <PopoverSurface ref={ref} showArrow={showArrow} {...rest}>
      <RACDialog aria-label={title ? undefined : ariaLabel} {...dialogProps} className={cx(styles.dialog, dialogProps?.className)}>
        {({ close }) => (
          <>
            {title ? (
              <Heading slot="title" className={styles.title}>
                {title}
              </Heading>
            ) : null}
            {typeof children === 'function' ? children({ close }) : children}
          </>
        )}
      </RACDialog>
    </PopoverSurface>
  );
});
