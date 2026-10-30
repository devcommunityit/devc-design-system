import { forwardRef, type ReactElement, type ReactNode } from 'react';
import {
  OverlayArrow,
  Tooltip as RACTooltip,
  TooltipTrigger as RACTooltipTrigger,
  composeRenderProps,
  type TooltipProps as RACTooltipProps,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Tooltip.module.css';

export interface TooltipContentProps extends RACTooltipProps {
  /** @default true */
  showArrow?: boolean;
}

/** Styled tooltip bubble (role="tooltip"), rendered in the ThemeProvider portal. */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  { className, children, showArrow = true, offset = 8, ...rest },
  ref,
) {
  const { locale, direction } = useLocale();
  return (
    <RACTooltip ref={ref} offset={offset} dir={direction} lang={locale} className={composeRenderProps(className, (cn) => cx(styles.tooltip, cn))} {...rest}>
      {composeRenderProps(children, (content) => (
        <>
          {showArrow ? (
            <OverlayArrow className={styles.arrow}>
              <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true">
                <path d="M0 0 L5 5 L10 0" />
              </svg>
            </OverlayArrow>
          ) : null}
          {content}
        </>
      ))}
    </RACTooltip>
  );
});

export interface TooltipProps extends Omit<TooltipTriggerComponentProps, 'children'> {
  /** Short, non-interactive description. */
  content: ReactNode;
  /** A single focusable element built on react-aria (Button, IconButton, Link…). Wrap native elements in `Focusable` from react-aria-components. */
  children: ReactElement;
  /** @default 'top' */
  placement?: RACTooltipProps['placement'];
  /** @default true */
  showArrow?: boolean;
  className?: string;
}

/**
 * Supplementary description shown on hover (after a delay) and on keyboard focus;
 * Escape hides it. Never put essential information or interactive content in a tooltip:
 * touch users cannot hover. Use Popover for interactive content.
 */
export function Tooltip({ content, children, placement = 'top', showArrow, className, delay = 500, ...triggerProps }: TooltipProps) {
  return (
    <RACTooltipTrigger delay={delay} {...triggerProps}>
      {children}
      <TooltipContent placement={placement} showArrow={showArrow} className={className}>
        {content}
      </TooltipContent>
    </RACTooltipTrigger>
  );
}