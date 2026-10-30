import { AlertCircle, Check } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { VisuallyHidden } from 'react-aria';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Stepper.module.css';

export interface StepperStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Marks a step with validation errors (shown with icon and text, not colour only). */
  hasError?: boolean;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  steps: StepperStep[];
  /** Index (0-based) of the current step. Steps before it are completed. */
  currentStep: number;
  /**
   * When provided, completed steps become buttons that let the user go back.
   * The consumer decides whether navigation is allowed.
   */
  onStepPress?: (index: number, step: StepperStep) => void;
  /** @default 'horizontal' (switches to a vertical layout in narrow containers) */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Progress through a multi-step flow. Ordered list with `aria-current="step"` on the current step and
 * textual status for completed/error steps. It does not manage the flow: the consumer owns `currentStep`.
 */
export const Stepper = forwardRef<HTMLElement, StepperProps>(function Stepper(
  { steps, currentStep, onStepPress, orientation = 'horizontal', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const fmt = new Intl.NumberFormat(locale);
  const current = Math.min(Math.max(0, currentStep), Math.max(0, steps.length - 1));
  return (
    <nav ref={ref} aria-label={ariaLabel ?? t.stepOf(current + 1, steps.length)} data-orientation={orientation} className={cx(styles.stepper, className)} {...rest}>
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const status = step.hasError ? 'error' : index < current ? 'complete' : index === current ? 'current' : 'upcoming';
          const marker = status === 'complete' ? <Check aria-hidden="true" /> : status === 'error' ? <AlertCircle aria-hidden="true" /> : fmt.format(index + 1);
          const statusText = status === 'complete' ? t.stepCompleted : status === 'error' ? t.stepError : status === 'current' ? t.stepCurrent : null;
          const content = (
            <>
              <span className={styles.marker}>{marker}</span>
              <span className={styles.text}>
                <span className={styles.label}>
                  {step.label}
                  {statusText ? <VisuallyHidden>{`, ${statusText}`}</VisuallyHidden> : null}
                </span>
                {step.description ? <span className={styles.description}>{step.description}</span> : null}
              </span>
            </>
          );
          const clickable = onStepPress !== undefined && index < current;
          return (
            <li key={step.id} className={styles.step} data-status={status} aria-current={index === current ? 'step' : undefined}>
              {clickable ? (
                <button type="button" className={styles.button} onClick={() => onStepPress(index, step)}>
                  {content}
                </button>
              ) : (
                <div className={styles.button}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});