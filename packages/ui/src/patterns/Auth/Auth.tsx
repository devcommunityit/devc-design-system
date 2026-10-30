import { forwardRef, useCallback, useRef, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Form, type FormProps } from '../../components/Field/Field';
import { Divider } from '../../components/Layout/Layout';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { TextField } from '../../components/TextField/TextField';
import { Heading, Link } from '../../components/Typography/Typography';
import styles from './Auth.module.css';

/* ------------------------------------------------------------------ helpers */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pending state that follows the promise returned by `onSubmit`, unless `isPending` is controlled. */
function useSubmitState(isPending: boolean | undefined) {
  const [internal, setInternal] = useState(false);
  const busy = useRef(false);
  const run = useCallback((result: void | Promise<void>, onSuccess?: () => void) => {
    if (!(result instanceof Promise)) {
      onSuccess?.();
      return;
    }
    busy.current = true;
    setInternal(true);
    result.then(
      () => {
        busy.current = false;
        setInternal(false);
        onSuccess?.();
      },
      (error: unknown) => {
        busy.current = false;
        setInternal(false);
        // Not swallowed: handle errors inside onSubmit and pass them through the `error` prop.
        throw error;
      },
    );
  }, []);
  const pending = isPending ?? internal;
  return { pending, isBusy: () => pending || busy.current, run };
}

function readString(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}

type BaseFormProps = Omit<FormProps, 'onSubmit' | 'children' | 'validationBehavior'>;

interface SharedAuthFormProps {
  /** Error from your auth service (wrong credentials, rate limit…), announced with role="alert". */
  error?: ReactNode;
  /** Controlled pending state. When omitted, a Promise returned by `onSubmit` drives it. */
  isPending?: boolean;
  /** Alternative sign-in buttons (SSO, passkeys) shown under an “or continue with” divider. */
  providers?: ReactNode;
  /** Content under the form, e.g. a link to the other auth page. */
  footer?: ReactNode;
  /** Submit button text. */
  submitLabel?: ReactNode;
}

function AuthFormFrame({ error, providers, footer, children }: { error?: ReactNode; providers?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  const messages = useMessages();
  return (
    <div className={styles.formFrame}>
      {error ? (
        <Alert tone="danger" live="assertive">
          {error}
        </Alert>
      ) : null}
      {children}
      {providers ? (
        <>
          <Divider label={messages.authOrContinueWith} />
          <div className={styles.providers}>{providers}</div>
        </>
      ) : null}
      {footer ? <div className={styles.formFooter}>{footer}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ AuthLayout */

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Logo or product name above the card. */
  brand?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2 | 3;
  /** Under the card (legal links, language switch). */
  footer?: ReactNode;
  /** Side panel shown from 1024px (marketing, illustrations). Must not contain essential content: it is hidden on small screens. */
  aside?: ReactNode;
  /** Fill the viewport height (`100dvh`). Set to false when embedding the layout in a page section or preview. @default true */
  fullHeight?: boolean;
}

/** Centered page frame for sign-in, sign-up and recovery screens. It does not render `<main>`: wrap it if the page has none. */
export const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(function AuthLayout(
  { brand, title, description, headingLevel = 1, footer, aside, fullHeight = true, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(styles.layout, className)}
      data-has-aside={aside ? true : undefined}
      data-full-height={fullHeight ? true : undefined}
      {...rest}
    >
      <div className={styles.column}>
        {brand ? <div className={styles.brand}>{brand}</div> : null}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Heading level={headingLevel} size="headline-sm">
              {title}
            </Heading>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          {children}
        </div>
        {footer ? <div className={styles.layoutFooter}>{footer}</div> : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </div>
  );
});

/* ------------------------------------------------------------------ LoginForm */

export interface LoginFormValues {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface LoginFormProps extends BaseFormProps, SharedAuthFormProps {
  /** Receives the values after client validation. Return a Promise to show the pending state. */
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  /** `email` validates the format; `username` accepts any non-empty value. @default 'email' */
  identifierType?: 'email' | 'username';
  defaultValues?: Partial<LoginFormValues>;
  /** Link to the recovery page. Hidden when omitted. */
  forgotPasswordHref?: string;
  /** Show the “keep me signed in” checkbox. Its meaning (session length) is decided by your backend. @default true */
  showRememberMe?: boolean;
}

/**
 * Sign-in form: identifier, password (with reveal), remember-me and recovery link. Uses the right
 * `autocomplete` tokens for password managers and never blocks paste. Authentication is up to you.
 */
export const LoginForm = forwardRef<HTMLFormElement, LoginFormProps>(function LoginForm(
  {
    onSubmit,
    identifierType = 'email',
    defaultValues,
    forgotPasswordHref,
    showRememberMe = true,
    error,
    isPending,
    providers,
    footer,
    submitLabel,
    className,
    ...rest
  },
  ref,
) {
  const messages = useMessages();
  const { pending, isBusy, run } = useSubmitState(isPending);
  const isEmail = identifierType === 'email';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy()) return;
    const data = new FormData(event.currentTarget);
    run(onSubmit({ identifier: readString(data, 'identifier').trim(), password: readString(data, 'password'), remember: data.get('remember') !== null }));
  };

  return (
    <AuthFormFrame error={error} providers={providers} footer={footer}>
      <Form ref={ref} className={cx(styles.form, className)} onSubmit={handleSubmit} {...rest}>
        <TextField
          name="identifier"
          label={isEmail ? messages.authEmail : messages.authUsername}
          type={isEmail ? 'email' : 'text'}
          autoComplete="username"
          inputMode={isEmail ? 'email' : undefined}
          inputProps={{ autoCapitalize: 'none', spellCheck: false }}
          defaultValue={defaultValues?.identifier}
          isRequired
          validate={(value) => {
            if (!value.trim()) return messages.authRequiredField;
            if (isEmail && !EMAIL_PATTERN.test(value.trim())) return messages.authInvalidEmail;
            return null;
          }}
        />
        <div className={styles.passwordBlock}>
          <PasswordInput
            name="password"
            label={messages.authPassword}
            autoComplete="current-password"
            defaultValue={defaultValues?.password}
            isRequired
            validate={(value) => (value ? null : messages.authRequiredField)}
          />
          {forgotPasswordHref ? (
            <Link href={forgotPasswordHref} variant="standalone" className={styles.forgot}>
              {messages.authForgotPassword}
            </Link>
          ) : null}
        </div>
        {showRememberMe ? (
          <Checkbox name="remember" defaultSelected={defaultValues?.remember}>
            {messages.authRememberMe}
          </Checkbox>
        ) : null}
        <Button type="submit" fullWidth size="lg" isPending={pending}>
          {submitLabel ?? messages.authSignIn}
        </Button>
      </Form>
    </AuthFormFrame>
  );
});

/* ------------------------------------------------------------------ SignUpForm */

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface SignUpFormProps extends BaseFormProps, SharedAuthFormProps {
  onSubmit: (values: SignUpFormValues) => void | Promise<void>;
  defaultValues?: Partial<Omit<SignUpFormValues, 'password'>>;
  /** Ask for the full name. @default true */
  showName?: boolean;
  /** Minimum length, counted in characters (code points). @default 8 */
  passwordMinLength?: number;
  /** Add a second password field that must match. The reveal button is usually enough. @default false */
  confirmPassword?: boolean;
  /** Label of a required acceptance checkbox (may contain links). Omit to hide it. */
  termsLabel?: ReactNode;
}

/** Registration form: name, email, new password (with `autocomplete="new-password"`) and optional terms. */
export const SignUpForm = forwardRef<HTMLFormElement, SignUpFormProps>(function SignUpForm(
  {
    onSubmit,
    defaultValues,
    showName = true,
    passwordMinLength = 8,
    confirmPassword = false,
    termsLabel,
    error,
    isPending,
    providers,
    footer,
    submitLabel,
    className,
    ...rest
  },
  ref,
) {
  const messages = useMessages();
  const { pending, isBusy, run } = useSubmitState(isPending);
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy()) return;
    const data = new FormData(event.currentTarget);
    run(
      onSubmit({
        name: readString(data, 'name').trim(),
        email: readString(data, 'email').trim(),
        password: readString(data, 'password'),
        acceptTerms: data.get('acceptTerms') !== null,
      }),
    );
  };

  return (
    <AuthFormFrame error={error} providers={providers} footer={footer}>
      <Form ref={ref} className={cx(styles.form, className)} onSubmit={handleSubmit} {...rest}>
        {showName ? (
          <TextField
            name="name"
            label={messages.authFullName}
            autoComplete="name"
            defaultValue={defaultValues?.name}
            isRequired
            validate={(value) => (value.trim() ? null : messages.authRequiredField)}
          />
        ) : null}
        <TextField
          name="email"
          label={messages.authEmail}
          type="email"
          autoComplete="email"
          inputMode="email"
          inputProps={{ autoCapitalize: 'none', spellCheck: false }}
          defaultValue={defaultValues?.email}
          isRequired
          validate={(value) => {
            if (!value.trim()) return messages.authRequiredField;
            return EMAIL_PATTERN.test(value.trim()) ? null : messages.authInvalidEmail;
          }}
        />
        <PasswordInput
          name="password"
          label={messages.authPassword}
          autoComplete="new-password"
          description={messages.authPasswordHint(passwordMinLength)}
          value={password}
          onChange={setPassword}
          isRequired
          validate={(value) => {
            if (!value) return messages.authRequiredField;
            return [...value].length < passwordMinLength ? messages.authPasswordTooShort(passwordMinLength) : null;
          }}
        />
        {confirmPassword ? (
          <PasswordInput
            name="passwordConfirmation"
            label={messages.authConfirmPassword}
            autoComplete="new-password"
            isRequired
            validate={(value) => {
              if (!value) return messages.authRequiredField;
              return value === password ? null : messages.authPasswordsDoNotMatch;
            }}
          />
        ) : null}
        {termsLabel ? (
          <Checkbox
            name="acceptTerms"
            isRequired
            validate={(selected) => (selected ? null : messages.authAcceptTermsRequired)}
          >
            {termsLabel}
          </Checkbox>
        ) : null}
        <Button type="submit" fullWidth size="lg" isPending={pending}>
          {submitLabel ?? messages.authSignUp}
        </Button>
      </Form>
    </AuthFormFrame>
  );
});

/* ------------------------------------------------------------------ PasswordResetForm */

export interface PasswordResetFormProps extends BaseFormProps, Omit<SharedAuthFormProps, 'providers'> {
  onSubmit: (values: { email: string }) => void | Promise<void>;
  defaultEmail?: string;
  /** Controlled “sent” state. When omitted it becomes true after `onSubmit` succeeds. */
  isSubmitted?: boolean;
  /** Confirmation text. The default does not reveal whether the account exists. */
  successMessage?: ReactNode;
}

/** Recovery request form. After submit it shows a neutral confirmation that avoids account enumeration. */
export const PasswordResetForm = forwardRef<HTMLFormElement, PasswordResetFormProps>(function PasswordResetForm(
  { onSubmit, defaultEmail, isSubmitted, successMessage, error, isPending, footer, submitLabel, className, ...rest },
  ref,
) {
  const messages = useMessages();
  const { pending, isBusy, run } = useSubmitState(isPending);
  const [sent, setSent] = useState(false);
  const showSuccess = isSubmitted ?? sent;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy()) return;
    const data = new FormData(event.currentTarget);
    run(onSubmit({ email: readString(data, 'email').trim() }), () => setSent(true));
  };

  return (
    <AuthFormFrame error={showSuccess ? undefined : error} footer={footer}>
      {showSuccess ? (
        <Alert tone="success" live="polite" title={messages.authResetLinkSentTitle}>
          {successMessage ?? messages.authResetLinkSent}
        </Alert>
      ) : (
        <Form ref={ref} className={cx(styles.form, className)} onSubmit={handleSubmit} {...rest}>
          <TextField
            name="email"
            label={messages.authEmail}
            type="email"
            autoComplete="email"
            inputMode="email"
            inputProps={{ autoCapitalize: 'none', spellCheck: false }}
            defaultValue={defaultEmail}
            isRequired
            validate={(value) => {
              if (!value.trim()) return messages.authRequiredField;
              return EMAIL_PATTERN.test(value.trim()) ? null : messages.authInvalidEmail;
            }}
          />
          <Button type="submit" fullWidth size="lg" isPending={pending}>
            {submitLabel ?? messages.authSendResetLink}
          </Button>
        </Form>
      )}
    </AuthFormFrame>
  );
});
