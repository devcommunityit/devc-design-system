import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section title. */
  title: ReactNode;
  /** Short label above the title (category, kicker). */
  eyebrow?: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** Trailing slot (tabs, “see all” link, filters); wraps below the text on narrow widths. */
  actions?: ReactNode;
  /** Heading level of the title. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size of the title. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Id of the heading, e.g. to label the enclosing `<section aria-labelledby>`. Generated when omitted. */
  titleId?: string;
}

/**
 * Header for a page section: eyebrow, title, description and an actions slot aligned to the end,
 * wrapping under the text in narrow containers.
 */
export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(function SectionHeader(
  { title, eyebrow, description, actions, headingLevel = 2, size = 'md', titleId, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const headingId = titleId ?? generatedId;
  const Heading = `h${headingLevel}` as const;
  return (
    <div ref={ref} data-size={size} className={cx(styles.sectionHeader, className)} {...rest}>
      <div className={styles.text}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <Heading id={headingId} className={styles.title}>
          {title}
        </Heading>
        {description ? <div className={styles.description}>{description}</div> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
});
