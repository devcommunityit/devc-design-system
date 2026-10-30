import { forwardRef, type ReactNode } from 'react';
import { Button as RACButton, composeRenderProps, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { Spinner } from '../Spinner/Spinner';
import { cx } from '../../utils';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<RACButtonProps, 'children'> {
  children?: ReactNode;
  /** Visual emphasis. @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  /** Icon before the label (decorative; hidden from assistive tech). */
  startIcon?: ReactNode;
  /** Icon after the label (decorative). */
  endIcon?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
}

/**
 * Triggers an action. Built on react-aria `Button`: supports `onPress` (mouse, touch, keyboard),
 * `isDisabled`, `isPending` (keeps focus, announces progress), `type`, `form` and DOM attributes.
 * For navigation use `LinkButton` (renders a real `<a>`).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', startIcon, endIcon, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <RACButton
      ref={ref}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      className={composeRenderProps(className, (cn) => cx(styles.button, cn))}
      {...rest}
    >
      {composeRenderProps(children, (content, { isPending }) => (
        <>
          {isPending ? <Spinner size="sm" label={null} className={styles.spinner} /> : null}
          {startIcon ? <span className={styles.icon} aria-hidden="true">{startIcon}</span> : null}
          {content !== undefined && content !== null ? <span className={styles.label}>{content}</span> : null}
          {endIcon ? <span className={styles.icon} aria-hidden="true">{endIcon}</span> : null}
        </>
      ))}
    </RACButton>
  );
});
