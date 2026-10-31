import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils';
import { AchievementBadge, AchievementBadgeGroup, type AchievementBadgeProps } from '../AchievementBadge/AchievementBadge';
import styles from './BadgeCollection.module.css';

export interface BadgeCollectionItem extends Pick<
  AchievementBadgeProps,
  'icon' | 'title' | 'description' | 'tier' | 'tierLabel' | 'earnedAt' | 'dateFormatOptions' | 'isLocked' | 'progress' | 'shape' | 'size' | 'layout' | 'headingLevel'
> {
  /** Stable item identifier. */
  id: string;
}

export interface BadgeCollectionProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Badge data rendered by AchievementBadge. */
  items: BadgeCollectionItem[];
  /** Accessible name passed to AchievementBadgeGroup. @default 'Achievement badges' */
  label?: string;
  /** Minimum responsive grid column width. @default '9rem' */
  minItemWidth?: string;
}

/** Data-driven composition of the existing AchievementBadge and AchievementBadgeGroup components. */
export const BadgeCollection = forwardRef<HTMLUListElement, BadgeCollectionProps>(function BadgeCollection(
  { items, label = 'Achievement badges', minItemWidth, className, ...rest },
  ref,
) {
  return (
    <AchievementBadgeGroup ref={ref} aria-label={label} minItemWidth={minItemWidth} className={cx(styles.collection, className)} {...rest}>
      {items.map(({ id, ...badge }) => <AchievementBadge key={id} {...badge} />)}
    </AchievementBadgeGroup>
  );
});
