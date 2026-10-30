import { forwardRef, useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { useField, useObjectRef } from 'react-aria';
import {
  FieldError as RACFieldError,
  Form as RACForm,
  Label as RACLabel,
  Text,
  composeRenderProps,
  type FieldErrorProps as RACFieldErrorProps,
  type FormProps as RACFormProps,
  type LabelProps as RACLabelProps,
  type ValidationResult,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Field.module.css';

export type FormProps = RACFormProps;

const NON_TEXT_INPUTS = new Set(['checkbox', 'radio', 'file', 'range', 'color', 'submit', 'button', 'reset', 'image', 'hidden']);

/**
 * Native `<form>` that coordinates field validation: on submit it shows errors and focuses
 * the first invalid field. Pass server-side errors with `validationErrors={{ fieldName: 'msg' }}`.
 *
 * Once a text field shows an error, it is revalidated while the user types (react-aria otherwise
 * waits for blur). This removes fixed errors before the user reaches the submit button, so the
 * layout does not shift under the pointer and the first click on "submit" is not lost.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form({ className, ...rest }, ref) {
  const formRef = useObjectRef(ref);
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const onInput = (event: Event) => {
      const target = event.target;
      const isText =
        target instanceof HTMLTextAreaElement || (target instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(target.type));
      if (!isText || target.getAttribute('aria-invalid') !== 'true') return;
      // This native listener runs before React handles the input: wait for the render so react-aria
      // has the new value's validation, then commit it through the `change` event it listens to.
      // The event does not bubble, so React's onChange is not triggered.
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (target.isConnected) target.dispatchEvent(new Event('change'));
      }, 0);
      timers.add(timer);
    };
    form.addEventListener('input', onInput);
    return () => {
      form.removeEventListener('input', onInput);
      timers.forEach(clearTimeout);
    };
  }, [formRef]);
  return <RACForm ref={formRef} className={cx(styles.form, className)} {...rest} />;
});

export type NecessityIndicator = 'icon' | 'label' | 'none';

export interface LabelProps extends RACLabelProps {
  isRequired?: boolean;
  /** How to show the required state. `icon` = asterisk plus localized hidden text. @default 'icon' */
  necessityIndicator?: NecessityIndicator;
}

function Necessity({ isRequired, indicator }: { isRequired?: boolean; indicator: NecessityIndicator }) {
  const messages = useMessages();
  if (!isRequired || indicator === 'none') return null;
  if (indicator === 'label') return <span className={styles.necessity}> ({messages.required})</span>;
  return (
    <span className={styles.required}>
      <span aria-hidden="true"> *</span>
      <span className={styles.srOnly}> ({messages.required})</span>
    </span>
  );
}

/** Field label. Inside react-aria based fields it is associated automatically. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { isRequired, necessityIndicator = 'icon', className, children, ...rest },
  ref,
) {
  return (
    <RACLabel ref={ref} className={cx(styles.label, className)} {...rest}>
      {children}
      <Necessity isRequired={isRequired} indicator={necessityIndicator} />
    </RACLabel>
  );
});

export interface DescriptionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/** Help text, linked with `aria-describedby` inside react-aria fields. */
export function Description({ className, ...rest }: DescriptionProps) {
  return <Text slot="description" className={cx(styles.description, className)} {...rest} />;
}

export type FieldErrorProps = RACFieldErrorProps;

/** Validation message, rendered only while the parent field is invalid. */
export function FieldError({ className, ...rest }: FieldErrorProps) {
  return <RACFieldError className={composeRenderProps(className, (cn) => cx(styles.error, cn))} {...rest} />;
}

/** Shared props of labelled form controls. */
export interface FieldBaseProps {
  label?: ReactNode;
  description?: ReactNode;
  /** Shown while invalid (`isInvalid`, `validate`, native constraints or server errors via `<Form validationErrors>`). */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator;
}

/** Internal helper used by form components: label, control, description and error. */
export function FieldParts({
  label,
  description,
  errorMessage,
  isRequired,
  necessityIndicator = 'icon',
  children,
}: FieldBaseProps & { isRequired?: boolean; children: ReactNode }) {
  return (
    <>
      {label ? (
        <Label isRequired={isRequired} necessityIndicator={necessityIndicator}>
          {label}
        </Label>
      ) : null}
      {children}
      {description ? <Description>{description}</Description> : null}
      <FieldError>{errorMessage}</FieldError>
    </>
  );
}

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  description?: ReactNode;
  /** Error text, shown and linked with aria-describedby when `isInvalid` is true. */
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  necessityIndicator?: NecessityIndicator;
  /** Render prop receiving id/ARIA props to spread on your control. */
  children: (controlProps: FieldControlProps) => ReactNode;
}

/**
 * Generic field for custom or third-party controls not built on react-aria.
 * Library inputs (TextField, Select, …) already include label, description and error.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, errorMessage, isInvalid, isRequired, necessityIndicator = 'icon', className, children, ...rest },
  ref,
) {
  const showError = Boolean(isInvalid && errorMessage);
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useField({
    label,
    description,
    errorMessage: showError ? errorMessage : undefined,
    isInvalid,
  });
  const control: FieldControlProps = {
    id: fieldProps.id ?? '',
    'aria-describedby': fieldProps['aria-describedby'],
    'aria-labelledby': fieldProps['aria-labelledby'],
    'aria-invalid': isInvalid ? true : undefined,
    'aria-required': isRequired ? true : undefined,
  };
  return (
    <div ref={ref} className={cx(styles.field, className)} data-invalid={isInvalid || undefined} {...rest}>
      <label {...labelProps} className={styles.label}>
        {label}
        <Necessity isRequired={isRequired} indicator={necessityIndicator} />
      </label>
      {children(control)}
      {description ? (
        <div {...descriptionProps} className={styles.description}>
          {description}
        </div>
      ) : null}
      {showError ? (
        <div {...errorMessageProps} className={styles.error}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
});
