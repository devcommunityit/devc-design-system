import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import {
  Button as RACButton,
  Link as RACLink,
  type ButtonProps as RACButtonProps,
  type LinkProps as RACLinkProps,
} from 'react-aria-components';
import { ArrowRight } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './AnnouncementPill.module.css';

export type AnnouncementPillTone = 'brand' | 'inverse';

interface AnnouncementPillBaseProps {
  /** Highlighted label before the text; defaults to the localized “New”. Pass `null` to hide it. */
  badge?: ReactNode;
  /** Announcement text. */
  children: ReactNode;
  /** `brand` for light surfaces, `inverse` (glass) for dark heroes. @default 'brand' */
  tone?: AnnouncementPillTone;
  /** Trailing arrow; shown by default when the pill is a link or a button. */
  showArrow?: boolean;
  className?: string;
}

export interface AnnouncementPillLinkProps extends AnnouncementPillBaseProps, Omit<RACLinkProps, 'children' | 'className'> {
  /** Destination: renders a native `<a href>`. */
  href: string;
}

export interface AnnouncementPillButtonProps extends AnnouncementPillBaseProps, Omit<RACButtonProps, 'children' | 'className' | 'onPress'> {
  href?: never;
  /** Action: renders a `<button>`. */
  onPress: NonNullable<RACButtonProps['onPress']>;
}

export interface AnnouncementPillStaticProps extends AnnouncementPillBaseProps, Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'className'> {
  href?: never;
  onPress?: never;
}

export type AnnouncementPillProps = AnnouncementPillLinkProps | AnnouncementPillButtonProps | AnnouncementPillStaticProps;

/**
 * Hero announcement pill: a highlighted badge (“New”) followed by a short text. With `href` it is a
 * link, with `onPress` a button, otherwise static text.
 */
export const AnnouncementPill = forwardRef<HTMLElement, AnnouncementPillProps>(function AnnouncementPill(props, ref) {
  const t = useMessages();
  const setRef = (node: HTMLElement | null) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  const interactive = typeof props.href === 'string' || typeof props.onPress === 'function';
  const { badge = t.isNew, children, tone = 'brand', showArrow = interactive, className } = props;
  const content = (
    <>
      {badge !== null && badge !== false ? (
        <>
          <span className={styles.badge}>{badge}</span>{' '}
        </>
      ) : null}
      <span className={styles.text}>{children}</span>
      {showArrow ? <ArrowRight aria-hidden="true" className={styles.arrow} /> : null}
    </>
  );
  const shared = { 'data-tone': tone, 'data-interactive': interactive || undefined, className: cx(styles.pill, className) };

  if (typeof props.href === 'string') {
    const { badge: _b, children: _c, tone: _t, showArrow: _s, className: _cn, ...rest } = props;
    return (
      <RACLink ref={setRef} {...rest} {...shared}>
        {content}
      </RACLink>
    );
  }
  if (typeof props.onPress === 'function') {
    const { badge: _b, children: _c, tone: _t, showArrow: _s, className: _cn, href: _h, ...rest } = props;
    return (
      <RACButton ref={setRef} {...rest} {...shared}>
        {content}
      </RACButton>
    );
  }
  const { badge: _b, children: _c, tone: _t, showArrow: _s, className: _cn, href: _h, onPress: _o, ...rest } = props;
  return (
    <span ref={setRef} {...rest} {...shared}>
      {content}
    </span>
  );
});
