import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { X } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import type { Messages } from '../../i18n/messages';
import { cx } from '../../utils';
import { IconButton } from '../IconButton/IconButton';
import styles from './StageLabel.module.css';

export type StageLabelStage = 'alpha' | 'beta' | 'preview' | 'demo' | 'new' | 'experimental' | 'deprecated' | 'comingSoon';

export interface StageLabelProps extends HTMLAttributes<HTMLElement> {
  /** Release stage: picks the default text and the visual style. */
  stage: StageLabelStage;
  /** Overrides the default localized stage text. */
  children?: ReactNode;
  /** `chip`: inline label. `banner`: full-width site strip (role="note"). @default 'chip' */
  variant?: 'chip' | 'banner';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Decorative leading icon. */
  icon?: ReactNode;
  /** Banner only: explanatory text next to the stage label. */
  description?: ReactNode;
  /** Banner only: action slot, e.g. a "Send feedback" link. */
  action?: ReactNode;
  /** Banner only: shows a dismiss IconButton (localized "Dismiss" label). */
  onDismiss?: () => void;
}

const stageText: Record<StageLabelStage, (t: Messages) => string> = {
  alpha: (t) => t.stageAlpha,
  beta: (t) => t.stageBeta,
  preview: (t) => t.stagePreview,
  demo: (t) => t.stageDemo,
  new: (t) => t.isNew,
  experimental: (t) => t.stageExperimental,
  deprecated: (t) => t.stageDeprecated,
  comingSoon: (t) => t.stageComingSoon,
};

/**
 * Release-stage label for sites and features (Alpha, Beta, Demo, New…). The `chip` variant is a
 * short inline label; the `banner` variant is a full-width strip with description, action and
 * optional dismiss button, e.g. "Demo environment: data is reset every night".
 */
export const StageLabel = forwardRef<HTMLElement, StageLabelProps>(function StageLabel(
  { stage, children, variant = 'chip', size = 'md', icon, description, action, onDismiss, className, ...rest },
  ref,
) {
  const t = useMessages();
  const labelId = useId();
  const content = (
    <>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.text}>{children ?? stageText[stage](t)}</span>
    </>
  );

  if (variant === 'banner') {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        role="note"
        aria-labelledby={labelId}
        data-stage={stage}
        data-size={size}
        className={cx(styles.banner, className)}
        {...rest}
      >
        <div className={styles.content}>
          <span id={labelId} className={styles.chip} data-stage={stage} data-size="sm">
            {content}
          </span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </div>
        {action || onDismiss ? (
          <div className={styles.actions}>
            {action}
            {onDismiss ? <IconButton label={t.dismiss} icon={<X />} size="sm" variant="ghost" onPress={onDismiss} /> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <span ref={ref as Ref<HTMLSpanElement>} data-stage={stage} data-size={size} className={cx(styles.chip, className)} {...rest}>
      {content}
    </span>
  );
});
