import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { ToggleButton } from 'react-aria-components';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Avatar } from '../Avatar';
import { RelativeTime } from '../RelativeTime';
import { VisuallyHidden } from '../VisuallyHidden';
import { LoadingPlaceholder } from '../Skeleton/LoadingPlaceholder';
import { SkeletonCard } from '../Skeleton/SkeletonPresets';
import styles from './ArticleCard.module.css';

export type ArticleCardTone = 'brand' | 'accent' | 'data-1' | 'data-2' | 'data-3' | 'data-4' | 'data-5' | 'data-6';

export interface ArticleCardAuthor {
  /** Full name: shown in the byline and used for the avatar initials. */
  name: string;
  /** Avatar image URL. */
  src?: string;
}

export interface ReactionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of likes. Omit to hide the like reaction (unless `onLike` is set). */
  likes?: number;
  /** Number of comments. Omit to hide the comment count. */
  comments?: number;
  /** Number of bookmarks. Omit to hide the bookmark reaction (unless `onBookmark` is set). */
  bookmarks?: number;
  /** Whether the current user liked the content. Leave undefined for an uncontrolled toggle. */
  isLiked?: boolean;
  /** Makes the like reaction a toggle button (`aria-pressed`); receives the next state. */
  onLike?: (isLiked: boolean) => void;
  /** Whether the current user saved the content. Leave undefined for an uncontrolled toggle. */
  isBookmarked?: boolean;
  /** Makes the bookmark reaction a toggle button (`aria-pressed`); receives the next state. */
  onBookmark?: (isBookmarked: boolean) => void;
  /** Turns the comment count into a link (e.g. to the comments section). */
  commentsHref?: string;
  /** Intl.NumberFormat options for the counts. @default { notation: 'compact' } */
  formatOptions?: Intl.NumberFormatOptions;
}

const COMPACT: Intl.NumberFormatOptions = { notation: 'compact' };

interface ReactionProps {
  kind: 'like' | 'comment' | 'bookmark';
  icon: ReactNode;
  label: string;
  count: string | null;
  isSelected?: boolean;
  onChange?: (value: boolean) => void;
  href?: string;
}

function Reaction({ kind, icon, label, count, isSelected, onChange, href }: ReactionProps) {
  const content = (
    <>
      <span className={styles.reactionIcon} aria-hidden="true">
        {icon}
      </span>
      {count !== null ? (
        <span className={styles.reactionCount} aria-hidden="true">
          {count}
        </span>
      ) : null}
      <VisuallyHidden>{count !== null ? `${label}: ${count}` : label}</VisuallyHidden>
    </>
  );
  if (onChange) {
    return (
      <ToggleButton className={styles.reaction} data-kind={kind} data-interactive="" isSelected={isSelected} onChange={onChange}>
        {content}
      </ToggleButton>
    );
  }
  if (href) {
    return (
      <a className={styles.reaction} data-kind={kind} data-interactive="" href={href}>
        {content}
      </a>
    );
  }
  return (
    <span className={styles.reaction} data-kind={kind} data-selected={isSelected || undefined}>
      {content}
    </span>
  );
}

/**
 * Likes / comments / bookmarks counters with icons. Likes and bookmarks become toggle buttons (`aria-pressed`)
 * when `onLike` / `onBookmark` are provided; counts are formatted with Intl for the current locale.
 */
export const ReactionBar = forwardRef<HTMLDivElement, ReactionBarProps>(function ReactionBar(
  { likes, comments, bookmarks, isLiked, onLike, isBookmarked, onBookmark, commentsHref, formatOptions = COMPACT, className, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const format = (value: number | undefined) => (value === undefined || !Number.isFinite(value) ? null : formatter.format(value));

  return (
    <div ref={ref} className={cx(styles.reactions, className)} {...rest}>
      {likes !== undefined || onLike ? (
        <Reaction kind="like" icon={<Heart />} label={t.reactionLike} count={format(likes)} isSelected={isLiked} onChange={onLike} />
      ) : null}
      {comments !== undefined ? (
        <Reaction kind="comment" icon={<MessageCircle />} label={t.reactionComment} count={format(comments)} href={commentsHref} />
      ) : null}
      {bookmarks !== undefined || onBookmark ? (
        <Reaction
          kind="bookmark"
          icon={<Bookmark />}
          label={t.reactionBookmark}
          count={format(bookmarks)}
          isSelected={isBookmarked}
          onChange={onBookmark}
        />
      ) : null}
    </div>
  );
});

export interface ArticleCardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'>,
    Pick<
      ReactionBarProps,
      'likes' | 'comments' | 'bookmarks' | 'isLiked' | 'onLike' | 'isBookmarked' | 'onBookmark' | 'commentsHref'
    > {
  /** Shows a SkeletonCard skeleton of the same shape, marked `aria-busy`, while the data loads. @default false */
  isLoading?: boolean;
  /** Article title. With `href` the whole card becomes clickable (stretched link). */
  title: ReactNode;
  /** Article URL. */
  href?: string;
  /** @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** `featured`: gradient cover beside (wide) or above (narrow) the body. `compact`: no cover, tighter spacing. @default 'featured' */
  variant?: 'featured' | 'compact';
  /** Cover content (code snippet, image, illustration) shown on the gradient. Only in the featured variant. */
  cover?: ReactNode;
  /** Article cover image. When set, it replaces `cover`; provide meaningful alt text or an empty string if decorative. */
  image?: { src: string; alt: string };
  /** Glow colours of the cover. @default 'brand' */
  tone?: ArticleCardTone;
  /** Chips/badges shown above the title (e.g. Badge). */
  tags?: ReactNode;
  /** Short summary. */
  excerpt?: ReactNode;
  author?: ArticleCardAuthor;
  /** Publication date: a Date is rendered as RelativeTime, any other node as is. */
  date?: ReactNode | Date;
  /** Estimated reading time in minutes. */
  readingMinutes?: number;
}

/**
 * Community article card: optional gradient cover, tags, title (stretched link), excerpt, byline with avatar,
 * date and reading time, and a reactions bar whose toggles stay clickable above the link.
 */
export const ArticleCard = forwardRef<HTMLElement, ArticleCardProps>(function ArticleCard(
  {
    title,
    href,
    headingLevel = 3,
    variant = 'featured',
    cover,
    image,
    tone = 'brand',
    tags,
    excerpt,
    author,
    date,
    readingMinutes,
    likes,
    comments,
    bookmarks,
    isLiked,
    onLike,
    isBookmarked,
    onBookmark,
    commentsHref,
    isLoading = false,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const minutesFormatter = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);
  const H = `h${headingLevel}` as const;
  const isFeatured = variant === 'featured';

  const dateNode = date instanceof Date ? <RelativeTime date={date} /> : date;
  const reading =
    readingMinutes !== undefined && Number.isFinite(readingMinutes) ? t.readingTime(minutesFormatter.format(readingMinutes)) : null;
  const metaParts = [dateNode, reading].filter((part) => part !== undefined && part !== null && part !== false && part !== '');
  const hasReactions =
    likes !== undefined || comments !== undefined || bookmarks !== undefined || Boolean(onLike) || Boolean(onBookmark);

  if (isLoading) {
    return (
      <LoadingPlaceholder ref={ref as Ref<HTMLDivElement>} className={className} {...rest}>
        <SkeletonCard media={isFeatured} avatar lines={2} />
      </LoadingPlaceholder>
    );
  }
  return (
    <article
      ref={ref}
      aria-labelledby={titleId}
      data-variant={variant}
      data-tone={tone}
      className={cx(styles.card, className)}
      {...rest}
    >
      <div className={styles.layout}>
        {isFeatured ? (
          <div className={styles.cover}>
            {image ? <img className={styles.coverImage} src={image.src} alt={image.alt} /> : null}
            {!image && cover ? <div className={styles.coverContent}>{cover}</div> : null}
          </div>
        ) : null}
        <div className={styles.body}>
          {tags ? <div className={styles.tags}>{tags}</div> : null}
          <H id={titleId} className={styles.title}>
            {href ? (
              <a className={styles.link} href={href}>
                {title}
              </a>
            ) : (
              title
            )}
          </H>
          {excerpt ? <div className={styles.excerpt}>{excerpt}</div> : null}
          {author || metaParts.length > 0 ? (
            <div className={styles.byline}>
              {author ? <Avatar name={author.name} src={author.src} size={isFeatured ? 'md' : 'sm'} isDecorative /> : null}
              <div className={styles.bylineText}>
                {author ? <span className={styles.author}>{author.name}</span> : null}
                {metaParts.length > 0 ? (
                  <span className={styles.meta}>
                    {metaParts.map((part, index) => (
                      <span key={index} className={styles.metaPart}>
                        {index > 0 ? (
                          <span className={styles.separator} aria-hidden="true">
                            ·
                          </span>
                        ) : null}
                        {part}
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
          {hasReactions ? (
            <ReactionBar
              className={styles.cardReactions}
              likes={likes}
              comments={comments}
              bookmarks={bookmarks}
              isLiked={isLiked}
              onLike={onLike}
              isBookmarked={isBookmarked}
              onBookmark={onBookmark}
              commentsHref={commentsHref}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
});
