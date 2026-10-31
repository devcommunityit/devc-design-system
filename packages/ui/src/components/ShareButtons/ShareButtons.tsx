import { Check, Link as LinkIcon, Share2, X } from 'lucide-react';
import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Button as RACButton, Link as RACLink } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { useCopyToClipboard } from '../CopyButton/CopyButton';
import { socialNetworks } from '../SocialLinks/networks';
import socialStyles from '../SocialLinks/SocialLinks.module.css';
import styles from './ShareButtons.module.css';

/** Networks with a documented share URL (Mastodon has no universal endpoint, so it is not included). */
export type ShareNetwork = 'linkedin' | 'x' | 'facebook' | 'whatsapp' | 'telegram' | 'email' | 'bluesky';
/** What triggered a share: a network link, the native share sheet or the copy button. */
export type ShareTarget = ShareNetwork | 'native' | 'copy';
export type ShareButtonsVariant = 'icon' | 'pill';
export type ShareButtonsSize = 'sm' | 'md' | 'lg';
export type ShareButtonsTone = 'neutral' | 'brand' | 'inverse';

export interface ShareContent {
  /** Absolute URL to share. */
  url: string;
  /** Title (email subject; fallback message for X, Telegram, WhatsApp, Bluesky). */
  title?: string;
  /** Short message accompanying the link. */
  text?: string;
}

const enc = encodeURIComponent;
const join = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(' ');

/** Builds the share intent URL for a network. Pure: safe on the server. */
export function getShareUrl(network: ShareNetwork, { url, title, text }: ShareContent): string {
  const message = text || title;
  switch (network) {
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
    case 'x':
      return `https://x.com/intent/post?url=${enc(url)}${message ? `&text=${enc(message)}` : ''}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case 'whatsapp':
      return `https://wa.me/?text=${enc(join(message, url))}`;
    case 'telegram':
      return `https://t.me/share/url?url=${enc(url)}${message ? `&text=${enc(message)}` : ''}`;
    case 'email': {
      const subject = title || text;
      const body = title && text ? join(text, url) : url;
      return `mailto:?${subject ? `subject=${enc(subject)}&` : ''}body=${enc(body)}`;
    }
    case 'bluesky':
      return `https://bsky.app/intent/compose?text=${enc(join(message, url))}`;
  }
}

export interface ShareButtonsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, ShareContent {
  /** Network links, in display order. @default ['linkedin', 'x', 'facebook', 'email'] */
  networks?: ShareNetwork[];
  /** “Share” button opening the system share sheet; shown only where `navigator.share` exists. @default true */
  showNativeShare?: boolean;
  /** “Copy link” button with polite live feedback. @default true */
  showCopy?: boolean;
  /** `icon` round icon-only buttons, `pill` icon + label. @default 'icon' */
  variant?: ShareButtonsVariant;
  /** @default 'md' */
  size?: ShareButtonsSize;
  /** `inverse` inherits the text colour, for dark sections. @default 'neutral' */
  tone?: ShareButtonsTone;
  /** Analytics hook: link pressed, native share completed or link copied. */
  onShare?: (target: ShareTarget) => void;
  /** Group name. @default localized “Share” */
  'aria-label'?: string;
}

const DEFAULT_NETWORKS: ShareNetwork[] = ['linkedin', 'x', 'facebook', 'email'];

/**
 * Share bar: native share sheet (when supported), network intent links and copy-link button,
 * in a labelled `role="group"`.
 */
export const ShareButtons = forwardRef<HTMLDivElement, ShareButtonsProps>(function ShareButtons(
  {
    url,
    title,
    text,
    networks = DEFAULT_NETWORKS,
    showNativeShare = true,
    showCopy = true,
    variant = 'icon',
    size = 'md',
    tone = 'neutral',
    onShare,
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  // Detected after mount so server and first client render match.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);
  const { status, copy } = useCopyToClipboard({ onCopy: () => onShare?.('copy') });

  const itemProps = { 'data-variant': variant, 'data-size': size, 'data-tone': tone, className: socialStyles.link };
  const content = (icon: ReactNode, label: string, visible: string = label) => (
    <>
      <span className={socialStyles.icon} aria-hidden="true">
        {icon}
      </span>
      {variant === 'pill' ? (
        <>
          {visible !== label ? <span className={socialStyles.srOnly}>{label}</span> : null}
          <span className={socialStyles.label} aria-hidden={visible !== label || undefined}>
            {visible}
          </span>
        </>
      ) : (
        <span className={socialStyles.srOnly}>{label}</span>
      )}
    </>
  );

  const nativeShare = async () => {
    try {
      await navigator.share({ url, title, text });
      onShare?.('native');
    } catch {
      // Dismissed by the user or blocked: nothing to report.
    }
  };

  const copyLabel = status === 'copied' ? t.linkCopied : t.copyLink;
  const feedback = status === 'copied' ? t.linkCopied : status === 'error' ? t.copyFailed : '';
  const copyIcon = status === 'copied' ? <Check /> : status === 'error' ? <X /> : <LinkIcon />;

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel ?? t.share}
      data-variant={variant}
      className={cx(styles.group, className)}
      {...rest}
    >
      {showNativeShare && canShare ? (
        <RACButton {...itemProps} data-target="native" onPress={() => void nativeShare()}>
          {content(<Share2 />, t.share)}
        </RACButton>
      ) : null}
      {networks.map((network) => {
        const info = socialNetworks[network];
        const Icon = info.icon;
        const newTab = network !== 'email';
        return (
          <RACLink
            key={network}
            {...itemProps}
            data-network={network}
            href={getShareUrl(network, { url, title, text })}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            onPress={() => onShare?.(network)}
          >
            {content(<Icon />, newTab ? `${t.shareOn(info.name)} ${t.opensInNewTab}` : t.shareOn(info.name), info.name)}
          </RACLink>
        );
      })}
      {showCopy ? (
        <>
          <RACButton {...itemProps} data-target="copy" data-status={status} onPress={() => void copy(url)}>
            {content(copyIcon, copyLabel)}
          </RACButton>
          <span className={socialStyles.srOnly} role="status">
            {feedback}
          </span>
        </>
      ) : null}
    </div>
  );
});
