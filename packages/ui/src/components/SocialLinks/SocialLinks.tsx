import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link as RACLink } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { getSocialNetwork, type SocialNetwork } from './networks';
import styles from './SocialLinks.module.css';

export type SocialLinksVariant = 'icon' | 'pill' | 'list';
export type SocialLinksSize = 'sm' | 'md' | 'lg';
export type SocialLinksTone = 'neutral' | 'brand' | 'inverse';

export interface SocialLinkItem {
  /** Network id: picks the built-in icon and display name. */
  network: SocialNetwork;
  /** Profile URL (or `mailto:` for email). */
  href: string;
  /** Overrides the text: accessible name for `icon`, visible label for `pill` and `list`. */
  label?: string;
  /** Overrides the built-in icon (decorative). */
  icon?: ReactNode;
}

export interface SocialLinksProps extends HTMLAttributes<HTMLUListElement> {
  /** Profiles to link, in display order. */
  items: SocialLinkItem[];
  /** `icon` round icon-only buttons, `pill` icon + name, `list` vertical icon + name (footers). @default 'icon' */
  variant?: SocialLinksVariant;
  /** @default 'md' */
  size?: SocialLinksSize;
  /** `inverse` inherits the text colour, for dark sections and heroes. @default 'neutral' */
  tone?: SocialLinksTone;
  /** Open http(s) links in a new tab with `rel="noopener noreferrer"` and announce it. @default true */
  openInNewTab?: boolean;
  /** Names the list for assistive technologies (e.g. “Seguici sui social”). Strongly recommended. */
  'aria-label'?: string;
}

const isWebUrl = (href: string) => /^(https?:)?\/\//i.test(href);

/**
 * List of social profile links (`<ul>` of real `<a href>`, React Aria Link for router integration).
 * Icon-only links keep a visually hidden name; new-tab links announce it.
 */
export const SocialLinks = forwardRef<HTMLUListElement, SocialLinksProps>(function SocialLinks(
  { items, variant = 'icon', size = 'md', tone = 'neutral', openInNewTab = true, className, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <ul ref={ref} data-variant={variant} data-size={size} data-tone={tone} className={cx(styles.list, className)} {...rest}>
      {items.map((item, index) => {
        const info = getSocialNetwork(item.network);
        const Icon = info.icon;
        const newTab = openInNewTab && isWebUrl(item.href);
        const text = item.label ?? (variant === 'icon' ? t.socialProfile(info.name) : info.name);
        return (
          <li key={`${item.network}-${item.href}-${index}`} className={styles.item}>
            <RACLink
              href={item.href}
              target={newTab ? '_blank' : undefined}
              rel={newTab ? 'noopener noreferrer' : undefined}
              data-network={item.network}
              data-variant={variant}
              data-size={size}
              data-tone={tone}
              className={styles.link}
            >
              <span className={styles.icon} aria-hidden="true">
                {item.icon ?? <Icon />}
              </span>
              <span className={variant === 'icon' ? styles.srOnly : styles.label}>{text}</span>
              {newTab ? (
                <>
                  {' '}
                  <span className={styles.srOnly}>{t.opensInNewTab}</span>
                </>
              ) : null}
            </RACLink>
          </li>
        );
      })}
    </ul>
  );
});
