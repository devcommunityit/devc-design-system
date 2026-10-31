import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Avatar } from '../Avatar/Avatar';
import { LoadingPlaceholder } from '../Skeleton/LoadingPlaceholder';
import { SkeletonProfile } from '../Skeleton/SkeletonPresets';
import styles from './ProfileCard.module.css';

export type ProfileCardTone = 'brand' | 'accent' | 'subtle' | 'neutral';

export interface ProfileCardStat {
  /** Caption of the figure (e.g. “talk”, “follower”). */
  label: ReactNode;
  /** Numbers are formatted with Intl for the current locale; other nodes are rendered as they are. */
  value: number | ReactNode;
  /** Intl.NumberFormat options for a numeric value (e.g. `{ notation: 'compact' }`). */
  formatOptions?: Intl.NumberFormatOptions;
}

export interface ProfileCardProps extends HTMLAttributes<HTMLElement> {
  /** Shows a SkeletonProfile skeleton of the same shape, marked `aria-busy`, while the data loads. @default false */
  isLoading?: boolean;
  /** Person name: heading text, avatar initials and accessible name of the card. */
  name: string;
  /** Avatar image URL; falls back to initials. */
  avatarSrc?: string;
  /** Custom avatar element replacing the default Avatar. */
  avatar?: ReactNode;
  /** Job title or role (e.g. “AI Engineer”). */
  jobTitle?: ReactNode;
  /** Company or organization, shown after the job title. */
  company?: ReactNode;
  /** Profile URL: the name becomes a link whose hit area covers the whole card. */
  href?: string;
  /** Heading level of the name. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Tags or badges (topics, technologies). */
  tags?: ReactNode;
  /** Short figures such as talks or followers. */
  stats?: ProfileCardStat[];
  /** Actions such as a Follow button; they stay clickable above the stretched link. */
  actions?: ReactNode;
  /** Gradient of the top band. @default 'brand' */
  tone?: ProfileCardTone;
}

function StatValue({ value, formatOptions, locale }: { value: ProfileCardStat['value']; formatOptions?: Intl.NumberFormatOptions; locale: string }) {
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  return <>{typeof value === 'number' ? formatter.format(value) : value}</>;
}

/**
 * Speaker / mentor card: gradient band, large avatar overlapping it, name, role, tags,
 * a row of locale-formatted stats and optional actions. Centered layout.
 */
export const ProfileCard = forwardRef<HTMLElement, ProfileCardProps>(function ProfileCard(
  { name, avatarSrc, avatar, jobTitle, company, href, headingLevel = 3, tags, stats, actions, tone = 'brand', isLoading = false, className, ...rest },
  ref,
) {
  const { locale } = useLocale();
  const nameId = useId();
  const H = `h${headingLevel}` as const;

  if (isLoading) {
    return (
      <LoadingPlaceholder ref={ref as Ref<HTMLDivElement>} className={className} {...rest}>
        <SkeletonProfile stats={stats?.length} />
      </LoadingPlaceholder>
    );
  }
  return (
    <article
      ref={ref}
      aria-labelledby={nameId}
      data-tone={tone}
      data-linked={href ? true : undefined}
      className={cx(styles.profile, className)}
      {...rest}
    >
      <div className={styles.band} aria-hidden="true" />
      <div className={styles.avatar}>{avatar ?? <Avatar name={name} src={avatarSrc} size="xl" isDecorative />}</div>
      <H id={nameId} className={styles.name}>
        {href ? (
          <a href={href} className={styles.link}>
            {name}
          </a>
        ) : (
          name
        )}
      </H>
      {jobTitle || company ? (
        <p className={styles.role}>
          {jobTitle ? <span>{jobTitle}</span> : null}
          {jobTitle && company ? ' · ' : null}
          {company ? <span>{company}</span> : null}
        </p>
      ) : null}
      {tags ? <div className={styles.tags}>{tags}</div> : null}
      {stats && stats.length > 0 ? (
        <dl className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>
                <StatValue value={stat.value} formatOptions={stat.formatOptions} locale={locale} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </article>
  );
});
