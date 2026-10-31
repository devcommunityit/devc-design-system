import { Children, forwardRef, isValidElement, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import type { Messages } from '../../i18n/messages';
import { cx, type CSSVariables } from '../../utils';
import { Badge } from '../Badge/Badge';
import { Progress } from '../Progress/Progress';
import styles from './AchievementBadge.module.css';

export type AchievementBadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'brand';

export interface AchievementBadgeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Decorative icon inside the medallion. */
  icon: ReactNode;
  /** Achievement name. */
  title: ReactNode;
  /** What the achievement rewards. */
  description?: ReactNode;
  /** Medal colour. `brand` uses the accent gradient and has no default tier name. @default 'brand' */
  tier?: AchievementBadgeTier;
  /** Overrides the localized tier name (required to show a name for the `brand` tier). */
  tierLabel?: string;
  /** Date the achievement was earned; shown as "Earned on …" formatted for the locale. Ignored when locked. */
  earnedAt?: Date | string;
  /** Intl.DateTimeFormat options for `earnedAt`. @default { dateStyle: 'medium' } */
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  /** Not yet earned: grayscale medal, lock icon and "Locked" text. @default false */
  isLocked?: boolean;
  /** Progress towards a locked achievement. */
  progress?: { value: number; max: number };
  /** Medallion shape (circle in forced-colors mode). @default 'hexagon' */
  shape?: 'hexagon' | 'circle';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** `stacked`: medal above centred text. `inline`: medal beside the text. @default 'stacked' */
  layout?: 'stacked' | 'inline';
  /** When set, the title is rendered as a heading of this level. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const tierText: Record<Exclude<AchievementBadgeTier, 'brand'>, (t: Messages) => string> = {
  bronze: (t) => t.achievementTierBronze,
  silver: (t) => t.achievementTierSilver,
  gold: (t) => t.achievementTierGold,
  platinum: (t) => t.achievementTierPlatinum,
};

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

function toDate(value: Date | string | undefined): Date | undefined {
  if (value === undefined) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Community gamification medal: hexagonal or round medallion with icon and tier colour,
 * title, tier name, earned date or locked state with optional progress.
 */
export const AchievementBadge = forwardRef<HTMLDivElement, AchievementBadgeProps>(function AchievementBadge(
  {
    icon,
    title,
    description,
    tier = 'brand',
    tierLabel,
    earnedAt,
    dateFormatOptions = DEFAULT_DATE_FORMAT,
    isLocked = false,
    progress,
    shape = 'hexagon',
    size = 'md',
    layout = 'stacked',
    headingLevel,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, dateFormatOptions), [locale, dateFormatOptions]);
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const date = isLocked ? undefined : toDate(earnedAt);
  const tierName = tierLabel ?? (tier === 'brand' ? undefined : tierText[tier](t));
  const Title = headingLevel ? (`h${headingLevel}` as const) : 'span';
  const progressMax = progress && Number.isFinite(progress.max) && progress.max > 0 ? progress.max : 0;
  const progressValue = progress && Number.isFinite(progress.value) ? Math.min(Math.max(progress.value, 0), progressMax) : 0;

  return (
    <div
      ref={ref}
      data-tier={tier}
      data-shape={shape}
      data-size={size}
      data-layout={layout}
      data-locked={isLocked || undefined}
      className={cx(styles.achievement, className)}
      {...rest}
    >
      <span className={styles.medal} aria-hidden="true">
        <span className={styles.face}>
          <span className={styles.icon}>{icon}</span>
        </span>
        {isLocked ? (
          <span className={styles.lock}>
            <Lock />
          </span>
        ) : null}
      </span>
      <div className={styles.body}>
        <Title id={titleId} className={styles.title}>
          {title}
        </Title>
        {tierName || isLocked ? (
          <span className={styles.meta}>
            {tierName ? (
              <Badge size="sm" variant="outline" className={styles.tier}>
                {tierName}
              </Badge>
            ) : null}
            {isLocked ? (
              <Badge size="sm" icon={<Lock />}>
                {t.achievementLocked}
              </Badge>
            ) : null}
          </span>
        ) : null}
        {description ? <span className={styles.description}>{description}</span> : null}
        {date ? (
          <span className={styles.earned}>{t.achievementEarned(dateFormatter.format(date))}</span>
        ) : null}
        {isLocked && progress && progressMax > 0 ? (
          <Progress
            className={styles.progress}
            size="sm"
            aria-labelledby={titleId}
            minValue={0}
            maxValue={progressMax}
            value={progressValue}
            valueLabel={`${numberFormatter.format(progressValue)} / ${numberFormatter.format(progressMax)}`}
          />
        ) : null}
      </div>
    </div>
  );
});

export interface AchievementBadgeGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** AchievementBadge elements; each one is wrapped in a list item. */
  children: ReactNode;
  /** Minimum column width of the responsive grid. @default '9rem' */
  minItemWidth?: string;
}

/** Responsive grid list (`<ul>`) of AchievementBadge items. */
export const AchievementBadgeGroup = forwardRef<HTMLUListElement, AchievementBadgeGroupProps>(function AchievementBadgeGroup(
  { children, minItemWidth = '9rem', className, style, ...rest },
  ref,
) {
  return (
    <ul ref={ref} className={cx(styles.group, className)} style={{ '--_min': minItemWidth, ...style } as CSSVariables} {...rest}>
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <li className={styles.item}>
            {child}
          </li>
        ) : null,
      )}
    </ul>
  );
});
