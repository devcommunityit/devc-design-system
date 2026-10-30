import { ChevronRight, X } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Button as RACButton, Link as RACLink, type LinkProps as RACLinkProps, type PressEvent } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { IconButton } from '../IconButton/IconButton';
import styles from './PromoBanner.module.css';

export type PromoBannerTone = 'brand' | 'accent' | 'neutral' | 'success' | 'warning';

interface PromoBannerBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Main text; part of the accessible name of the link/button. */
  title: ReactNode;
  /** Secondary text; also part of the accessible name. Keep it short. */
  description?: ReactNode;
  /** Decorative leading icon. */
  icon?: ReactNode;
  /** @default 'brand' */
  tone?: PromoBannerTone;
  /** When set, a separate dismiss button is rendered next to (not inside) the clickable surface. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss button. @default messages.dismiss */
  dismissLabel?: string;
}

export interface PromoBannerLinkProps extends PromoBannerBaseProps {
  /** Destination: the whole surface is a native `<a href>`. */
  href: string;
  /** Extra props for the react-aria Link (target, rel, routerOptions, onPress…). */
  linkProps?: Omit<RACLinkProps, 'href' | 'children' | 'className' | 'style'>;
  onPress?: never;
}

export interface PromoBannerButtonProps extends PromoBannerBaseProps {
  /** Action: the whole surface is a native `<button>`. */
  onPress: (event: PressEvent) => void;
  href?: never;
  linkProps?: never;
}

export type PromoBannerProps = PromoBannerLinkProps | PromoBannerButtonProps;

/**
 * Clickable promotional banner: the whole surface is ONE real `<a href>` (navigation) or
 * `<button>` (action). An optional dismiss button is a sibling, never nested in the interactive element.
 */
export const PromoBanner = forwardRef<HTMLDivElement, PromoBannerProps>(function PromoBanner(
  { title, description, icon, tone = 'brand', onDismiss, dismissLabel, href, linkProps, onPress, className, ...rest },
  ref,
) {
  const t = useMessages();
  const content = (
    <>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      <ChevronRight aria-hidden="true" className={styles.chevron} />
    </>
  );
  return (
    <div ref={ref} data-tone={tone} data-dismissible={onDismiss ? true : undefined} className={cx(styles.promo, className)} {...rest}>
      {href !== undefined ? (
        <RACLink href={href} className={styles.surface} {...linkProps}>
          {content}
        </RACLink>
      ) : (
        <RACButton className={styles.surface} onPress={onPress}>
          {content}
        </RACButton>
      )}
      {onDismiss ? <IconButton size="sm" label={dismissLabel ?? t.dismiss} icon={<X />} className={styles.dismiss} onPress={onDismiss} /> : null}
    </div>
  );
});
