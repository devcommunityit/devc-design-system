import { Children, forwardRef, isValidElement, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Person or entity name: used for initials and as the accessible name. */
  name: string;
  /** Image URL. Falls back to initials if missing or if loading fails. */
  src?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default 'circle' */
  shape?: 'circle' | 'square';
  /** Custom fallback content instead of initials (e.g. an icon). */
  fallback?: ReactNode;
  /** Hide from assistive tech when the name is already visible next to it. @default false */
  isDecorative?: boolean;
}

/** Up to two initials from a name, locale-aware upper-casing. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toLocaleUpperCase();
}

/** Deterministic tone index (0–5) from the name so fallbacks are varied but stable. */
function toneOf(name: string): number {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) % 997;
  return hash % 6;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', shape = 'circle', fallback, isDecorative = false, className, ...rest },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  return (
    <span
      ref={ref}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : name}
      aria-hidden={isDecorative || undefined}
      data-size={size}
      data-shape={shape}
      data-tone={toneOf(name)}
      className={cx(styles.avatar, className)}
      {...rest}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailedSrc(src ?? null)} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {fallback ?? getInitials(name)}
        </span>
      )}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the group, e.g. "Team members". */
  'aria-label'?: string;
  /** Max avatars shown; the rest is summarized as "+N". */
  max?: number;
  /** @default 'md' */
  size?: AvatarSize;
  children: ReactNode;
}

/** Overlapping stack of avatars with an overflow counter. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = 'md', className, children, ...rest },
  ref,
) {
  const t = useMessages();
  const items = Children.toArray(children).filter((child): child is ReactElement<AvatarProps> => isValidElement(child));
  const visible = max !== undefined && items.length > max ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <div ref={ref} role="group" data-size={size} className={cx(styles.group, className)} {...rest}>
      {visible.map((item, i) => (
        <span key={item.key ?? i} className={styles.groupItem}>
          <Avatar {...item.props} size={size} />
        </span>
      ))}
      {hidden > 0 ? (
        <span className={styles.groupItem}>
          <span role="img" aria-label={t.moreItems(hidden)} data-size={size} data-shape="circle" className={cx(styles.avatar, styles.more)}>
            <span aria-hidden="true">+{hidden}</span>
          </span>
        </span>
      ) : null}
    </div>
  );
});