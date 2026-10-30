import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './HeroCard.module.css';

export type HeroCardVariant = 'brand' | 'accent' | 'subtle';

export interface HeroCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Main heading. */
  title: ReactNode;
  /** Heading level of the title. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Short line above the title (context, date, category). */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Buttons or links (prefer `secondary` Button/LinkButton: they keep their own contrast on every variant). */
  actions?: ReactNode;
  /** Illustration or image shown beside the text on wide containers, below it on narrow ones. */
  media?: ReactNode;
  /** Decorative icon shown before the eyebrow. */
  icon?: ReactNode;
  /** Surface. `brand` and `accent` use the expressive gradients, `subtle` a tonal fill. @default 'brand' */
  variant?: HeroCardVariant;
  /** Semantic element: `section` (named region) or `article` (self-contained content). @default 'section' */
  as?: 'section' | 'article';
}

/**
 * Prominent welcome/feature card at the top of a dashboard. Text always uses the `*-foreground`
 * role paired with the surface, so it stays readable on gradients, in dark mode and in forced colors.
 */
export const HeroCard = forwardRef<HTMLElement, HeroCardProps>(function HeroCard(
  { title, headingLevel = 2, eyebrow, description, actions, media, icon, variant = 'brand', as = 'section', className, ...rest },
  ref,
) {
  const titleId = useId();
  const H = `h${headingLevel}` as const;
  const shared = {
    ref,
    'aria-labelledby': titleId,
    'data-variant': variant,
    'data-has-media': media ? true : undefined,
    className: cx(styles.hero, className),
    ...rest,
  };
  const content = (
    <>
      <div className={styles.content}>
        {icon || eyebrow ? (
          <div className={styles.eyebrowRow}>
            {icon ? (
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            ) : null}
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          </div>
        ) : null}
        <H id={titleId} className={styles.title}>
          {title}
        </H>
        {description ? <div className={styles.description}>{description}</div> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {media ? <div className={styles.media}>{media}</div> : null}
    </>
  );
  return as === 'article' ? <article {...shared}>{content}</article> : <section {...shared}>{content}</section>;
});
