import {
  forwardRef,
  useMemo,
  type OlHTMLAttributes,
  type ReactNode,
} from "react";
import { useLocale, useMessages } from "../../i18n/LocaleProvider";
import { cx } from "../../utils";
import { RelativeTime } from "../RelativeTime";
import { VisuallyHidden } from "../VisuallyHidden";
import { SkeletonList } from "../Skeleton/SkeletonPresets";
import styles from "./DiscussionList.module.css";

export interface DiscussionListItem {
  id: string;
  /** Thread title. With `href` the whole row becomes clickable (stretched link). */
  title: ReactNode;
  href?: string;
  /** Number of replies ("84 replies"). */
  replies?: number;
  /** Last activity: a Date is rendered as RelativeTime, any other node as is. */
  time?: ReactNode | Date;
  /** Chip/badge at the end of the meta line. */
  tag?: ReactNode;
  /** Shows a "New" marker next to the title. */
  isNew?: boolean;
}

export interface DiscussionListProps extends Omit<
  OlHTMLAttributes<HTMLOListElement>,
  "children"
> {
  /** Threads, already in display order. */
  items: DiscussionListItem[];
  /** Renders the titles as headings of this level. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Number of the first item (also the native `start` of the list). @default 1 */
  start?: number;
  /** Replaces the rows with a skeleton list (`aria-busy`) while the data loads. @default false */
  isLoading?: boolean;
  /** Skeleton rows shown while `isLoading`. @default 4 */
  loadingRows?: number;
}

/** Numbered list (`<ol>`) of discussion threads with reply count, last activity and an optional tag. */
export const DiscussionList = forwardRef<HTMLOListElement, DiscussionListProps>(
  function DiscussionList(
    {
      items,
      headingLevel,
      start = 1,
      isLoading = false,
      loadingRows = 4,
      className,
      ...rest
    },
    ref,
  ) {
    const t = useMessages();
    const { locale } = useLocale();
    const indexFormatter = useMemo(
      () =>
        new Intl.NumberFormat(locale, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
      [locale],
    );
    const countFormatter = useMemo(
      () => new Intl.NumberFormat(locale),
      [locale],
    );
    const Title = headingLevel ? (`h${headingLevel}` as const) : "span";

    return (
      <ol
        ref={ref}
        start={start === 1 ? undefined : start}
        aria-busy={isLoading || undefined}
        className={cx(styles.list, className)}
        {...rest}
      >
        {isLoading ? (
          <li className={styles.loading}>
            <VisuallyHidden>{t.loading}</VisuallyHidden>
            <SkeletonList rows={loadingRows} leading="none" />
          </li>
        ) : null}
        {isLoading
          ? null
          : items.map((item, index) => {
              const time =
                item.time instanceof Date ? (
                  <RelativeTime date={item.time} />
                ) : (
                  item.time
                );
              const metaParts = [
                item.replies !== undefined && Number.isFinite(item.replies)
                  ? t.replies(item.replies, countFormatter.format(item.replies))
                  : null,
                time,
              ].filter(
                (part) =>
                  part !== undefined &&
                  part !== null &&
                  part !== false &&
                  part !== "",
              );
              return (
                <li key={item.id} className={styles.item}>
                  <span className={styles.number} aria-hidden="true">
                    {indexFormatter.format(start + index)}
                  </span>
                  <div className={styles.main}>
                    <Title className={styles.title}>
                      {item.href ? (
                        <a className={styles.link} href={item.href}>
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                      {item.isNew ? (
                        <span className={styles.new}>{t.isNew}</span>
                      ) : null}
                    </Title>
                    {metaParts.length > 0 || item.tag ? (
                      <div className={styles.meta}>
                        {metaParts.map((part, partIndex) => (
                          <span key={partIndex} className={styles.metaPart}>
                            {partIndex > 0 ? (
                              <span
                                className={styles.separator}
                                aria-hidden="true"
                              >
                                ·
                              </span>
                            ) : null}
                            {part}
                          </span>
                        ))}
                        {item.tag ? (
                          <span className={styles.tag}>{item.tag}</span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
      </ol>
    );
  },
);
