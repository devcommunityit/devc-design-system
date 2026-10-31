import {
  forwardRef,
  useId,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useLocale, useMessages } from "../../i18n/LocaleProvider";
import { cx } from "../../utils";
import { Avatar } from "../Avatar";
import { VisuallyHidden } from "../VisuallyHidden";
import { SkeletonList } from "../Skeleton/SkeletonPresets";
import styles from "./Leaderboard.module.css";

export interface LeaderboardEntry {
  id: string;
  /** Person name: visible label and avatar initials. */
  name: string;
  /** Avatar image URL. */
  src?: string;
  /** Secondary line, e.g. "12 articoli · 3 talk". */
  subtitle?: ReactNode;
  /** Score, formatted with Intl ("2,840 pts"). */
  points: number;
  /** Profile URL: the name becomes a link. */
  href?: string;
}

export interface LeaderboardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** People already in rank order (first = #1). */
  items: LeaderboardEntry[];
  /** Optional title; it also names the list. */
  title?: ReactNode;
  /** @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Id of the entry to highlight (e.g. the current user); marked with aria-current. */
  highlightId?: string;
  /** Intl.NumberFormat options for the points. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Shows only the first N entries. */
  maxItems?: number;
  /** Rank of the first entry, for pages after the first. @default 1 */
  start?: number;
  /** `card`: framed surface. `plain`: no frame, to place inside another container. @default 'card' */
  variant?: "card" | "plain";
  /** Bottom slot: link to the full ranking or a note. */
  footer?: ReactNode;
  /** Replaces the rows with a skeleton list (`aria-busy`) while the data loads. @default false */
  isLoading?: boolean;
  /** Skeleton rows shown while `isLoading`. @default 5 */
  loadingRows?: number;
}

/**
 * People leaderboard: ordered list with rank, avatar, name, subtitle and points. The top three ranks get
 * gold/silver/bronze badges and `highlightId` marks the current user.
 */
export const Leaderboard = forwardRef<HTMLDivElement, LeaderboardProps>(
  function Leaderboard(
    {
      items,
      title,
      headingLevel = 3,
      highlightId,
      formatOptions,
      maxItems,
      start = 1,
      variant = "card",
      footer,
      isLoading = false,
      loadingRows = 5,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref,
  ) {
    const t = useMessages();
    const { locale } = useLocale();
    const titleId = useId();
    const formatter = useMemo(
      () => new Intl.NumberFormat(locale, formatOptions),
      [locale, formatOptions],
    );
    const rankFormatter = useMemo(
      () => new Intl.NumberFormat(locale),
      [locale],
    );
    const visible =
      maxItems !== undefined ? items.slice(0, Math.max(0, maxItems)) : items;
    const H = `h${headingLevel}` as const;
    const hasTitle = title !== undefined && title !== null && title !== false;

    return (
      <div
        ref={ref}
        data-variant={variant}
        aria-busy={isLoading || undefined}
        className={cx(styles.leaderboard, className)}
        {...rest}
      >
        {hasTitle ? (
          <H id={titleId} className={styles.title}>
            {title}
          </H>
        ) : null}
        {isLoading ? (
          <>
            <VisuallyHidden>{t.loading}</VisuallyHidden>
            <SkeletonList rows={loadingRows} trailing dividers={false} />
          </>
        ) : (
          <ol
            className={styles.list}
            start={start === 1 ? undefined : start}
            aria-label={ariaLabel}
            aria-labelledby={
              ariaLabelledBy ?? (hasTitle && !ariaLabel ? titleId : undefined)
            }
          >
            {visible.map((item, index) => {
              const rank = start + index;
              const isCurrent = item.id === highlightId;
              return (
                <li
                  key={item.id}
                  className={styles.item}
                  data-top={rank <= 3 ? rank : undefined}
                  data-current={isCurrent || undefined}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  <span className={styles.rank}>
                    {rankFormatter.format(rank)}
                  </span>
                  <Avatar
                    className={styles.avatar}
                    name={item.name}
                    src={item.src}
                    size="sm"
                    isDecorative
                  />
                  <div className={styles.main}>
                    {item.href ? (
                      <a
                        className={cx(styles.name, styles.link)}
                        href={item.href}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className={styles.name}>{item.name}</span>
                    )}
                    {item.subtitle ? (
                      <span className={styles.subtitle}>{item.subtitle}</span>
                    ) : null}
                  </div>
                  <span className={styles.points}>
                    {t.points(formatter.format(item.points))}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    );
  },
);
