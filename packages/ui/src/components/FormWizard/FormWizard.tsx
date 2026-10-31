import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button';
import { Stepper, type StepperStep } from '../Stepper';
import shared from '../composite/Composite.module.css';

export interface FormWizardStep extends StepperStep {
  content: ReactNode;
  /** Return false to keep the current step open. Async validation is supported. */
  validate?: () => boolean | Promise<boolean>;
}

export interface FormWizardProps {
  'aria-label': string;
  steps: readonly FormWizardStep[];
  currentStep?: number;
  defaultCurrentStep?: number;
  onStepChange?: (index: number) => void;
  onComplete: () => void | Promise<void>;
  /** Receives rejected validation or completion errors; an error is also shown in the UI. */
  onError?: (error: unknown) => void;
  validationMessage?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
}

/** Multi-step form shell. Form values and persistence are managed by the consumer. */
export function FormWizard({
  'aria-label': ariaLabel, steps, currentStep: controlledStep, defaultCurrentStep = 0, onStepChange,
  onComplete, onError, validationMessage, errorMessage, className,
}: FormWizardProps) {
  const t = useMessages();
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [current, setCurrent] = useControllableState(controlledStep, defaultCurrentStep, onStepChange, 'currentStep');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<'validation' | 'failure' | null>(null);
  const generation = useRef(0);
  const mounted = useRef(false);
  const submitting = useRef(false);
  const previousStep = useRef(current);
  if (!Number.isInteger(current) || current < 0 || current >= steps.length) {
    throw new RangeError('FormWizard: currentStep must refer to an existing step.');
  }
  const step = steps[current]!;
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; generation.current += 1; };
  }, []);
  useEffect(() => {
    generation.current += 1;
    if (previousStep.current !== current) {
      headingRef.current?.focus();
      previousStep.current = current;
    }
  }, [current, step.id]);

  const goBack = (index: number) => {
    if (submitting.current) return;
    setError(null);
    setCurrent(index);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const request = generation.current;
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      const valid = step.validate ? await step.validate() : true;
      if (!mounted.current || request !== generation.current) return;
      if (!valid) {
        setError('validation');
      } else if (current === steps.length - 1) {
        await onComplete();
      } else {
        setCurrent(current + 1);
      }
    } catch (reason) {
      if (mounted.current && request === generation.current) setError('failure');
      onError?.(reason);
    } finally {
      submitting.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return (
    <form className={cx(shared.root, className)} aria-label={ariaLabel} onSubmit={(event) => { void submit(event); }}>
      <Stepper aria-label={ariaLabel} steps={[...steps]} currentStep={current} onStepPress={(index) => goBack(index)} />
      <section className={shared.panel} aria-labelledby={headingId}>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className={shared.heading}>{step.label}</h2>
        {step.content}
      </section>
      {error ? <div role="alert">{error === 'validation' ? (validationMessage ?? t.components.wizardValidation) : (errorMessage ?? t.components.wizardError)}</div> : null}
      <div className={shared.actions}>
        {current > 0 ? <Button type="button" variant="outline" isDisabled={pending} onPress={() => goBack(current - 1)}>{t.components.previous}</Button> : null}
        <Button type="submit" isPending={pending}>{current === steps.length - 1 ? t.components.finish : t.components.next}</Button>
      </div>
    </form>
  );
}
