import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Badge } from '../Badge/Badge';
import { Progress } from '../Progress/Progress';
import styles from './LearningPathCard.module.css';

export type LearningPathCardTone = 'brand' | 'accent' | 'subtle' | 'neutral';

export interface LearningPathCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Path name. */
  title: ReactNode;
  /** Path URL: the title becomes a link whose hit area covers the whole card. */
  href?: string;
  /** Heading level of the title. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Decorative icon shown in the gradient tile. */
  icon?: ReactNode;
  /** Gradient of the icon tile. @default 'brand' */
  tone?: LearningPathCardTone;
  description?: ReactNode;
  /** Short facts such as level, duration or number of modules. */
  meta?: ReactNode;
  /** Modules completed by the user. Shown with `total` as a progress bar. */
  completed?: number;
  /** Total number of modules. The progress bar is shown when it is greater than 0 and `completed` is set. */
  total?: number;
  /** Intl.NumberFormat options for completed / total. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Shows the localized “New” chip. */
  isNew?: boolean;
  /** Bottom slot: a call to action, a note or a link. Stays clickable above the stretched link. */
  footer?: ReactNode;
}

/**
 * Learning path card: gradient icon tile, title, description, meta, user progress
 * (localized “x / y modules” on a labelled progress bar) or a “New” chip, and a footer.
 */
export const LearningPathCard = forwardRef<HTMLElement, LearningPathCardProps>(function LearningPathCard(
  { title, href, headingLevel = 3, icon, tone = 'brand', description, meta, completed, total, formatOptions, isNew = false, footer, className, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const titleId = useId();
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const H = `h${headingLevel}` as const;

  const max = total !== undefined && Number.isFinite(total) && total > 0 ? total : 0;
  const hasProgress = max > 0 && completed !== undefined && Number.isFinite(completed);
  const done = hasProgress ? Math.min(Math.max(completed, 0), max) : 0;
  const progressText = hasProgress ? t.modulesProgress(formatter.format(done), formatter.format(max)) : '';

  return (
    <article
      ref={ref}
      aria-labelledby={titleId}
      data-tone={tone}
      data-linked={href ? true : undefined}
      data-new={isNew || undefined}
      className={cx(styles.path, className)}
      {...rest}
    >
      {icon || isNew ? (
        <div className={styles.top}>
          {icon ? (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          ) : null}
          {isNew ? (
            <Badge tone="success" className={styles.new}>
              {t.isNew}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <H id={titleId} className={styles.title}>
        {href ? (
          <a href={href} className={styles.link}>
            {title}
          </a>
        ) : (
          title
        )}
      </H>
      {description ? <div className={styles.description}>{description}</div> : null}
      {meta ? <div className={styles.meta}>{meta}</div> : null}
      {hasProgress ? (
        <div className={styles.progress}>
          <Progress
            aria-labelledby={titleId}
            value={done}
            minValue={0}
            maxValue={max}
            valueLabel={progressText}
            showValue={false}
            size="sm"
          />
          {/* Already exposed as the progress bar's aria-valuetext. */}
          <span className={styles.progressText} aria-hidden="true">
            {progressText}
          </span>
        </div>
      ) : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </article>
  );
});
