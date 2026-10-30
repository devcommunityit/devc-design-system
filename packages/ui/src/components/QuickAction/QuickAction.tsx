import { forwardRef, type ReactNode } from 'react';
import {
  Button as RACButton,
  Link as RACLink,
  type ButtonProps as RACButtonProps,
  type LinkProps as RACLinkProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import styles from './QuickAction.module.css';

interface QuickActionBaseProps {
  /** Decorative icon (hidden from assistive technology). */
  icon: ReactNode;
  /** Visible label; it is the accessible name together with the description. */
  label: ReactNode;
  description?: ReactNode;
  /** Trailing element, e.g. a Badge with a count. */
  badge?: ReactNode;
  /** @default 'vertical' */
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export interface QuickActionLinkProps extends QuickActionBaseProps, Omit<RACLinkProps, 'children' | 'className'> {
  /** Destination: renders a native `<a href>`. */
  href: string;
}

export interface QuickActionButtonProps extends QuickActionBaseProps, Omit<RACButtonProps, 'children' | 'className'> {
  href?: never;
}

export type QuickActionProps = QuickActionLinkProps | QuickActionButtonProps;

function isLinkProps(props: QuickActionProps): props is QuickActionLinkProps {
  return typeof props.href === 'string';
}

/**
 * Shortcut tile for admin grids: icon + label (+ description), rendered as a real `<a href>`
 * (navigation) or `<button>` (`onPress`, action). Put several in a `<ul>`/Grid.
 */
export const QuickAction = forwardRef<HTMLAnchorElement | HTMLButtonElement, QuickActionProps>(function QuickAction(props, ref) {
  const setRef = (node: HTMLAnchorElement | HTMLButtonElement | null) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {props.icon}
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{props.label}</span>
        {props.description ? <span className={styles.description}>{props.description}</span> : null}
      </span>
      {props.badge ? <span className={styles.badge}>{props.badge}</span> : null}
    </>
  );
  if (isLinkProps(props)) {
    const { icon: _icon, label: _label, description: _description, badge: _badge, layout = 'vertical', className, ...rest } = props;
    return (
      <RACLink ref={setRef} data-layout={layout} className={cx(styles.action, className)} {...rest}>
        {content}
      </RACLink>
    );
  }
  const { icon: _icon, label: _label, description: _description, badge: _badge, layout = 'vertical', className, href: _href, ...rest } = props;
  return (
    <RACButton ref={setRef} data-layout={layout} className={cx(styles.action, className)} {...rest}>
      {content}
    </RACButton>
  );
});
