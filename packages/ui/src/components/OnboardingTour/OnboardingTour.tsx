import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useMessages } from '../../i18n/LocaleProvider';
import { usePortalContainer } from '../../theme/ThemeProvider';
import { useControllableState } from '../../utils';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Popover } from '../Popover';
import shared from '../composite/Composite.module.css';
import styles from './OnboardingTour.module.css';

export interface OnboardingTourStep {
  id: string;
  title: string;
  content: ReactNode;
  /** CSS selector or a function resolving the element to highlight. */
  target: string | (() => Element | null);
}

export interface OnboardingTourProps {
  'aria-label': string;
  steps: readonly OnboardingTourStep[];
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentStep?: number;
  defaultCurrentStep?: number;
  onStepChange?: (step: number) => void;
  onFinish?: () => void;
  onSkip?: () => void;
  onTargetMissing?: (step: OnboardingTourStep) => void;
  onError?: (error: unknown) => void;
}

interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface TourStepContentProps {
  step: OnboardingTourStep;
  actions: ReactNode;
  onSkip: () => void;
  onTargetMissing?: OnboardingTourProps['onTargetMissing'];
  onError?: OnboardingTourProps['onError'];
}

function TourStepContent({ step, actions, onSkip, onTargetMissing, onError }: TourStepContentProps) {
  const t = useMessages();
  const portal = usePortalContainer();
  const [target, setTarget] = useState<Element | null | undefined>();
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const targetRef = useRef<Element | null>(null);
  const callbacks = useRef({ step, onTargetMissing, onError });
  useEffect(() => {
    callbacks.current = { step, onTargetMissing, onError };
  }, [step, onTargetMissing, onError]);
  const stepId = step.id;
  const stepTarget = step.target;
  useEffect(() => {
    let reported = false;
    let last: Element | null = null;
    const updateBounds = (element: Element | null) => {
      if (!element) {
        setBounds(null);
        return;
      }
      const { left, top, width, height } = element.getBoundingClientRect();
      setBounds((previous) => previous && previous.left === left && previous.top === top
        && previous.width === width && previous.height === height ? previous : { left, top, width, height });
    };
    const reposition = () => updateBounds(targetRef.current);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reposition);
    const resolve = () => {
      let element: Element | null = null;
      try {
        element = typeof stepTarget === 'string' ? document.querySelector(stepTarget) : stepTarget();
      } catch (reason) {
        if (!reported) callbacks.current.onError?.(reason);
      }
      if (!element && !reported) {
        reported = true;
        callbacks.current.onTargetMissing?.(callbacks.current.step);
      } else if (element) reported = false;
      targetRef.current = element;
      setTarget((previous) => previous === element ? previous : element);
      if (element !== last) {
        if (last) resizeObserver?.unobserve?.(last);
        if (element) {
          resizeObserver?.observe(element);
          element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
        }
      }
      last = element;
      updateBounds(element);
    };
    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      resizeObserver?.disconnect();
    };
  }, [stepId, stepTarget]);
  const highlight = target && bounds && typeof document !== 'undefined'
    ? createPortal(<span aria-hidden="true" className={styles.highlight} style={bounds} />, portal ?? document.body)
    : null;
  return (
    <>
      {highlight}
      {target ? (
        <Popover triggerRef={targetRef} title={step.title} isOpen isNonModal
          shouldCloseOnInteractOutside={() => false} onOpenChange={(next) => { if (!next) onSkip(); }}>
          <div>{step.content}</div>
          {actions}
        </Popover>
      ) : target === null ? (
        <Dialog title={step.title} isOpen onOpenChange={(next) => { if (!next) onSkip(); }} footer={actions}>
          <div role="alert">{t.components.tourTargetMissing}</div>
          {step.content}
        </Dialog>
      ) : null}
    </>
  );
}

/** Non-modal guided tour anchored to elements owned by the consumer. */
export function OnboardingTour({
  'aria-label': ariaLabel, steps, isOpen: controlledOpen, defaultOpen = false, onOpenChange,
  currentStep: controlledStep, defaultCurrentStep = 0, onStepChange, onFinish, onSkip, onTargetMissing, onError,
}: OnboardingTourProps) {
  const t = useMessages();
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange, 'isOpen');
  const [current, setCurrent] = useControllableState(controlledStep, defaultCurrentStep, onStepChange, 'currentStep');
  const ids = new Set<string>();
  for (const step of steps) {
    if (ids.has(step.id)) throw new Error(`OnboardingTour: duplicate step id "${step.id}".`);
    ids.add(step.id);
  }
  if (open && (!Number.isInteger(current) || current < 0 || current >= steps.length)) {
    throw new RangeError('OnboardingTour: currentStep must refer to an existing step.');
  }
  const step = open ? steps[current] : undefined;
  if (!step) return null;
  const skip = () => {
    setOpen(false);
    onSkip?.();
  };
  const actions = (
    <div className={shared.actions}>
      <Button variant="ghost" onPress={skip}>{t.components.tourSkip}</Button>
      {current > 0 ? <Button variant="outline" onPress={() => setCurrent(current - 1)}>{t.components.previous}</Button> : null}
      <Button onPress={() => {
        if (current < steps.length - 1) setCurrent(current + 1);
        else {
          setOpen(false);
          onFinish?.();
        }
      }}>{current === steps.length - 1 ? t.components.finish : t.components.next}</Button>
      <span className={shared.muted} aria-label={`${ariaLabel}: ${current + 1} / ${steps.length}`}>{current + 1} / {steps.length}</span>
    </div>
  );
  return <TourStepContent key={step.id} step={step} actions={actions} onSkip={skip} onTargetMissing={onTargetMissing} onError={onError} />;
}
