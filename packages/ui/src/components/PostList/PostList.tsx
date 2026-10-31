import {
  forwardRef,
  useId,
  useMemo,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from "react";
import {
  ToggleButton,
  composeRenderProps,
  type ToggleButtonProps,
} from "react-aria-components";
import { ChevronUp } from "lucide-react";
import { useLocale, useMessages } from "../../i18n/LocaleProvider";
import { cx, useControllableState } from "../../utils";
import { VisuallyHidden } from "../VisuallyHidden";
import { SkeletonList } from "../Skeleton/SkeletonPresets";
import styles from "./PostList.module.css";

export type PostListTone =
  | "brand"
  | "accent"
  | "data-1"
  | "data-2"
  | "data-3"
  | "data-4"
  | "data-5"
  | "data-6";

export interface VoteButtonProps extends Omit<
  ToggleButtonProps,
  | "children"
  | "aria-label"
  | "aria-describedby"
  | "isSelected"
  | "defaultSelected"
  | "onChange"
> {
  /** Total votes, including the current user's vote when selected. */
  count: number;
  /** Whether the current user upvoted (controlled). */
  isSelected?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultSelected?: boolean;
  /** Receives the next voted state. */
  onChange?: (isSelected: boolean) => void;
  /** Intl.NumberFormat options for the count. @default { notation: 'compact' } */
  formatOptions?: Intl.NumberFormatOptions;
}

const COMPACT: Intl.NumberFormatOptions = { notation: "compact" };

/**
 * Upvote toggle (`aria-pressed`) with a chevron and the formatted vote count. The accessible name is
 * "Upvote" / "Remove upvote"; the full count ("186 votes") is the accessible description.
 */
export const VoteButton = forwardRef<HTMLButtonElement, VoteButtonProps>(
  function VoteButton(
    {
      count,
      isSelected,
      defaultSelected = false,
      onChange,
      formatOptions = COMPACT,
      className,
      ...rest
    },
    ref,
  ) {
    const t = useMessages();
    const { locale } = useLocale();
    const descriptionId = useId();
    const formatter = useMemo(
      () => new Intl.NumberFormat(locale, formatOptions),
      [locale, formatOptions],
    );
    const fullFormatter = useMemo(
      () => new Intl.NumberFormat(locale),
      [locale],
    );
    const [selected, setSelected] = useControllableState(
      isSelected,
      defaultSelected,
      onChange,
      "isSelected",
    );
    const value = Number.isFinite(count) ? count : 0;

    return (
      <ToggleButton
        ref={ref}
        isSelected={selected}
        onChange={setSelected}
        aria-label={selected ? t.removeUpvote : t.upvote}
        aria-describedby={descriptionId}
        className={composeRenderProps(className, (cn) => cx(styles.vote, cn))}
        {...rest}
      >
        <ChevronUp className={styles.voteIcon} aria-hidden="true" />
        <span className={styles.voteCount} aria-hidden="true">
          {formatter.format(value)}
        </span>
        <VisuallyHidden id={descriptionId}>
          {t.votes(value, fullFormatter.format(value))}
        </VisuallyHidden>
      </ToggleButton>
    );
  },
);

export interface PostListItemProps extends Omit<
  LiHTMLAttributes<HTMLLIElement>,
  "title"
> {
  /** Post title. With `href` the whole row becomes clickable (stretched link). */
  title: ReactNode;
  href?: string;
  /** Short text in the gradient thumbnail (e.g. "K8s"). Decorative. */
  thumbLabel?: ReactNode;
  /** Custom thumbnail content (image, icon) instead of `thumbLabel`. */
  thumb?: ReactNode;
  /** Thumbnail gradient. @default 'brand' */
  tone?: PostListTone;
  /** Author name, first item of the meta line. */
  author?: ReactNode;
  /** Extra meta such as reading time or date. */
  meta?: ReactNode;
  /** Chips/badges at the end of the meta line. */
  tags?: ReactNode;
  /** Vote count. Omit to hide the vote box. */
  votes?: number;
  /** Whether the current user upvoted. Leave undefined for an uncontrolled vote. */
  isVoted?: boolean;
  /** Receives the next voted state. */
  onVoteChange?: (isVoted: boolean) => void;
  /** Renders the title as a heading of this level. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** One post row: gradient thumbnail, title, meta line and vote box. Use inside PostList. */
export const PostListItem = forwardRef<HTMLLIElement, PostListItemProps>(
  function PostListItem(
    {
      title,
      href,
      thumbLabel,
      thumb,
      tone = "brand",
      author,
      meta,
      tags,
      votes,
      isVoted,
      onVoteChange,
      headingLevel,
      className,
      ...rest
    },
    ref,
  ) {
    const Title = headingLevel ? (`h${headingLevel}` as const) : "span";
    const metaParts = [author, meta].filter(
      (part) =>
        part !== undefined && part !== null && part !== false && part !== "",
    );
    const hasThumb = thumb !== undefined || thumbLabel !== undefined;

    return (
      <li
        ref={ref}
        data-tone={tone}
        className={cx(styles.item, className)}
        {...rest}
      >
        {hasThumb ? (
          <span
            className={styles.thumb}
            aria-hidden={thumb === undefined ? "true" : undefined}
          >
            {thumb ?? thumbLabel}
          </span>
        ) : null}
        <div className={styles.main}>
          <Title className={styles.title}>
            {href ? (
              <a className={styles.link} href={href}>
                {title}
              </a>
            ) : (
              title
            )}
          </Title>
          {metaParts.length > 0 || tags ? (
            <div className={styles.meta}>
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
              {tags ? <span className={styles.tags}>{tags}</span> : null}
            </div>
          ) : null}
        </div>
        {votes !== undefined ? (
          <VoteButton
            className={styles.itemVote}
            count={votes}
            isSelected={isVoted}
            onChange={onVoteChange}
          />
        ) : null}
      </li>
    );
  },
);

export interface PostListItemData {
  id: string;
  title: ReactNode;
  href?: string;
  thumbLabel?: ReactNode;
  tone?: PostListTone;
  author?: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode;
  votes?: number;
  isVoted?: boolean;
}

export interface PostListProps extends HTMLAttributes<HTMLUListElement> {
  /** Posts to render. Alternatively compose `PostListItem` children. */
  items?: PostListItemData[];
  /** Called when a vote of an `items` row changes. */
  onVote?: (id: string, isVoted: boolean) => void;
  /** Heading level of the titles of `items` rows. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** `card`: framed surface like a Card. `plain`: only the row dividers. @default 'card' */
  variant?: "card" | "plain";
  /** Replaces the rows with a skeleton list (`aria-busy`) while the data loads. @default false */
  isLoading?: boolean;
  /** Skeleton rows shown while `isLoading`. @default 4 */
  loadingRows?: number;
  children?: ReactNode;
}

/** List of community posts (`<ul>`) with gradient thumbnails, meta and upvotes. */
export const PostList = forwardRef<HTMLUListElement, PostListProps>(
  function PostList(
    {
      items,
      onVote,
      headingLevel,
      variant = "card",
      isLoading = false,
      loadingRows = 4,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const t = useMessages();
    return (
      <ul
        ref={ref}
        data-variant={variant}
        aria-busy={isLoading || undefined}
        className={cx(styles.list, className)}
        {...rest}
      >
        {isLoading ? (
          <li className={styles.loading}>
            <VisuallyHidden>{t.loading}</VisuallyHidden>
            <SkeletonList rows={loadingRows} leading="icon" trailing />
          </li>
        ) : items ? (
          items.map(({ id, isVoted, ...item }) => (
            <PostListItem
              key={id}
              {...item}
              headingLevel={headingLevel}
              isVoted={isVoted}
              onVoteChange={onVote ? (next) => onVote(id, next) : undefined}
            />
          ))
        ) : (
          children
        )}
      </ul>
    );
  },
);
