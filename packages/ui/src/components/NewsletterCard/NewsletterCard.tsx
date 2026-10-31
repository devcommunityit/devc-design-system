import { forwardRef, useEffect, useId, useRef, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import styles from './NewsletterCard.module.css';

export type NewsletterCardStatus = 'idle' | 'pending' | 'success' | 'error';

export interface NewsletterCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onSubmit' | 'onChange' | 'defaultValue'> {
  /** Heading of the card. */
  title: ReactNode;
  /** Heading level of the title. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Short chip above the title (e.g. “Newsletter”). */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Called with the email on a valid submit. Return a Promise to show the pending state until it settles (rejection → error). */
  onSubmit?: (email: string) => void | Promise<unknown>;
  /** Controlled status. When omitted, the card manages it from the `onSubmit` Promise. */
  status?: NewsletterCardStatus;
  /** Announced on success. @default messages.newsletterSubscribed */
  successMessage?: ReactNode;
  /** Announced on error. @default messages.error */
  errorMessage?: ReactNode;
  /** Controlled email value. */
  value?: string;
  /** Initial email value (uncontrolled). */
  defaultValue?: string;
  /** Called when the email changes. */
  onChange?: (value: string) => void;
  /** Placeholder of the email field, e.g. “nome@email.it”. */
  placeholder?: string;
  /** Accessible name of the email field. @default messages.newsletterEmail */
  emailLabel?: string;
  /** Text of the submit button. @default messages.newsletterSubscribe */
  submitLabel?: ReactNode;
  /** Form field name, useful with native form handling. @default 'email' */
  name?: string;
  /** Small print under the form (privacy note, frequency). */
  footer?: ReactNode;
}

/**
 * Dark, glowing newsletter sign-up card: title, description, email field with native
 * validation and a subscribe button with pending state; outcome announced in a live region.
 */
export const NewsletterCard = forwardRef<HTMLElement, NewsletterCardProps>(function NewsletterCard(
  {
    title,
    headingLevel = 3,
    eyebrow,
    description,
    onSubmit,
    status: statusProp,
    successMessage,
    errorMessage,
    value,
    defaultValue = '',
    onChange,
    placeholder,
    emailLabel,
    submitLabel,
    name = 'email',
    footer,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const titleId = useId();
  const H = `h${headingLevel}` as const;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalStatus, setInternalStatus] = useState<NewsletterCardStatus>('idle');
  const mounted = useRef(true);
  const isControlled = value !== undefined;
  const email = isControlled ? value : internalValue;
  const status = statusProp ?? internalStatus;
  const isPending = status === 'pending';

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    if (internalStatus !== 'pending') setInternalStatus('idle');
    onChange?.(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    const submitted = email.trim();
    let result: void | Promise<unknown>;
    try {
      result = onSubmit?.(submitted);
    } catch {
      setInternalStatus('error');
      return;
    }
    if (result instanceof Promise) {
      setInternalStatus('pending');
      result.then(
        () => {
          if (!mounted.current) return;
          setInternalStatus('success');
          if (!isControlled) setInternalValue('');
        },
        () => {
          if (mounted.current) setInternalStatus('error');
        },
      );
    } else {
      setInternalStatus('success');
      if (!isControlled) setInternalValue('');
    }
  };

  return (
    <section ref={ref} aria-labelledby={titleId} data-status={status} className={cx(styles.newsletter, className)} {...rest}>
      <div className={styles.content}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <H id={titleId} className={styles.title}>
          {title}
        </H>
        {description ? <div className={styles.description}>{description}</div> : null}
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            className={styles.field}
            type="email"
            name={name}
            autoComplete="email"
            isRequired
            aria-label={emailLabel ?? t.newsletterEmail}
            placeholder={placeholder}
            value={email}
            onChange={handleChange}
          />
          <Button type="submit" className={styles.submit} isPending={isPending}>
            {submitLabel ?? t.newsletterSubscribe}
          </Button>
        </form>
        <p role="status" className={styles.message} data-kind="success">
          {status === 'success' ? (successMessage ?? t.newsletterSubscribed) : null}
        </p>
        <p role="alert" className={styles.message} data-kind="error">
          {status === 'error' ? (errorMessage ?? t.error) : null}
        </p>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </section>
  );
});
