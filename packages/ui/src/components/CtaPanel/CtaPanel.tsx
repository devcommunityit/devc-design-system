import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import styles from './CtaPanel.module.css';

export type CtaPanelVariant = 'dark' | 'brand';

export interface CtaPanelStep {
  title: ReactNode;
  description?: ReactNode;
}

export interface CtaPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Main heading. */
  title: ReactNode;
  /** Heading level of the title. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Short chip above the title (campaign, date, category). */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Buttons or links. */
  actions?: ReactNode;
  /** Numbered steps shown beside the text on wide containers, below it on narrow ones. */
  steps?: CtaPanelStep[];
  /** Surface: `dark` is the inverse panel with glows, `brand` the accent gradient. @default 'dark' */
  variant?: CtaPanelVariant;
}

/**
 * Glowing call-to-action section closing a landing page: eyebrow, title, description,
 * actions and optional numbered steps (ordered list). Adapts to its container width.
 */
export const CtaPanel = forwardRef<HTMLElement, CtaPanelProps>(function CtaPanel(
  { title, headingLevel = 2, eyebrow, description, actions, steps, variant = 'dark', className, ...rest },
  ref,
) {
  const titleId = useId();
  const H = `h${headingLevel}` as const;
  const hasSteps = Boolean(steps && steps.length > 0);

  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      data-variant={variant}
      data-has-steps={hasSteps || undefined}
      className={cx(styles.cta, className)}
      {...rest}
    >
      <div className={styles.layout}>
        <div className={styles.content}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <H id={titleId} className={styles.title}>
            {title}
          </H>
          {description ? <div className={styles.description}>{description}</div> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
        {hasSteps ? (
          <ol className={styles.steps}>
            {steps?.map((step, index) => (
              <li key={index} className={styles.step}>
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.stepText}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  {step.description ? <span className={styles.stepDescription}>{step.description}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
});
