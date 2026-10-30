import { forwardRef, type ReactNode } from 'react';
import { Link as RACLink, composeRenderProps, type LinkProps as RACLinkProps } from 'react-aria-components';
import { cx } from '../../utils';
import type { ButtonSize, ButtonVariant } from './Button';
import styles from './Button.module.css';

export interface LinkButtonProps extends Omit<RACLinkProps, 'children'> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * A link (`<a href>`) styled as a button, for navigation. Router-agnostic: wrap the app in
 * react-aria `RouterProvider` to route client-side, or pass your router's link via `href`.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  { variant = 'primary', size = 'md', startIcon, endIcon, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <RACLink
      ref={ref}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      className={composeRenderProps(className, (cn) => cx(styles.button, cn))}
      {...rest}
    >
      {composeRenderProps(children, (content) => (
        <>
          {startIcon ? <span className={styles.icon} aria-hidden="true">{startIcon}</span> : null}
          {content !== undefined && content !== null ? <span className={styles.label}>{content}</span> : null}
          {endIcon ? <span className={styles.icon} aria-hidden="true">{endIcon}</span> : null}
        </>
      ))}
    </RACLink>
  );
});
