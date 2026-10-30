import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { AuthLayout, LoginForm, PasswordResetForm, SignUpForm } from './Auth';

function en(children: React.ReactNode) {
  return <LocaleProvider locale="en-US">{children}</LocaleProvider>;
}

describe('LoginForm', () => {
  it('validates on submit with localized messages and focuses the first invalid field', async () => {
    const u = userEvent.setup();
    const onSubmit = vi.fn();
    render(en(<LoginForm onSubmit={onSubmit} forgotPasswordHref="/reset" />));
    await u.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).not.toHaveBeenCalled();
    const email = screen.getByRole('textbox', { name: /Email/ });
    await waitFor(() => expect(email).toHaveFocus());
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByText('This field is required.').length).toBeGreaterThan(0);
    await u.type(email, 'not-an-email');
    await u.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText(/Enter a valid email address/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/reset');
  });

  it('clears a shown error while typing, so fixing the last field does not shift the submit button', async () => {
    const u = userEvent.setup();
    const onSubmit = vi.fn();
    render(en(<LoginForm onSubmit={onSubmit} showRememberMe={false} />));
    await u.click(screen.getByRole('button', { name: 'Sign in' }));
    const email = screen.getByRole('textbox', { name: /Email/ });
    const password = screen.getByLabelText(/^Password/);
    await waitFor(() => expect(password).toHaveAttribute('aria-invalid', 'true'));
    await u.type(email, 'ada@example.com');
    // Paste = one input event carrying the whole valid value (like autofill or password managers).
    await u.click(password);
    await u.paste('secret-password');
    // Still focused: without input-time revalidation the error would stay until blur.
    expect(password).toHaveFocus();
    await waitFor(() => expect(password).not.toHaveAttribute('aria-invalid'));
    expect(screen.queryByText('This field is required.')).not.toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledWith({ identifier: 'ada@example.com', password: 'secret-password', remember: false });
  });

  it('submits trimmed values, uses password-manager autocomplete tokens and shows pending from a Promise', async () => {
    const u = userEvent.setup();
    let resolve: () => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const { container } = render(en(<LoginForm onSubmit={onSubmit} />));
    const email = screen.getByRole('textbox', { name: /Email/ });
    expect(email).toHaveAttribute('autocomplete', 'username');
    expect(email).toHaveAttribute('type', 'email');
    const password = screen.getByLabelText(/^Password/);
    expect(password).toHaveAttribute('autocomplete', 'current-password');
    await u.type(email, '  ada@example.com ');
    await u.type(password, 's3cret pass');
    await u.click(screen.getByRole('checkbox', { name: 'Keep me signed in' }));
    await u.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledWith({ identifier: 'ada@example.com', password: 's3cret pass', remember: true });
    await waitFor(() => expect(screen.getByRole('button', { name: /Sign in/ })).toHaveAttribute('aria-disabled', 'true'));
    // A second Enter while pending does not submit twice.
    await u.type(password, '{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolve();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign in' })).not.toHaveAttribute('aria-disabled'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('announces service errors and accepts a username identifier', async () => {
    const u = userEvent.setup();
    const onSubmit = vi.fn();
    render(en(<LoginForm onSubmit={onSubmit} identifierType="username" showRememberMe={false} error="Wrong credentials." />));
    expect(screen.getByRole('alert')).toHaveTextContent('Wrong credentials.');
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    await u.type(screen.getByRole('textbox', { name: /Username/ }), 'ada');
    await u.type(screen.getByLabelText(/^Password/), 'x');
    await u.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledWith({ identifier: 'ada', password: 'x', remember: false });
  });
});

describe('SignUpForm', () => {
  it('enforces password length, confirmation and terms before submitting', async () => {
    const u = userEvent.setup();
    const onSubmit = vi.fn();
    render(en(<SignUpForm onSubmit={onSubmit} confirmPassword passwordMinLength={10} termsLabel="I accept the terms" />));
    await u.type(screen.getByRole('textbox', { name: /Full name/ }), 'Ada Lovelace');
    await u.type(screen.getByRole('textbox', { name: /Email/ }), 'ada@example.com');
    const [password, confirmation] = [screen.getByLabelText(/^Password/), screen.getByLabelText(/^Confirm password/)];
    expect(password).toHaveAttribute('autocomplete', 'new-password');
    await u.type(password, 'short');
    await u.type(confirmation, 'different');
    await u.click(screen.getByRole('button', { name: 'Create account' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('Use at least 10 characters.')).toBeInTheDocument();
    expect(screen.getByText('The passwords do not match.')).toBeInTheDocument();
    expect(screen.getByText('You must accept the terms to continue.')).toBeInTheDocument();
    await u.clear(password);
    await u.type(password, 'long enough pass');
    await u.clear(confirmation);
    await u.type(confirmation, 'long enough pass');
    await u.click(screen.getByRole('checkbox', { name: /I accept the terms/ }));
    await u.click(screen.getByRole('button', { name: 'Create account' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'long enough pass', acceptTerms: true });
  });
});

describe('PasswordResetForm', () => {
  it('shows a neutral confirmation only after onSubmit resolves', async () => {
    const u = userEvent.setup();
    const onSubmit = vi.fn(() => Promise.resolve());
    render(en(<PasswordResetForm onSubmit={onSubmit} />));
    await u.type(screen.getByRole('textbox', { name: /Email/ }), 'ada@example.com');
    await u.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com' });
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('If an account exists for this address');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('supports a controlled submitted state', () => {
    function Controlled() {
      const [sent] = useState(true);
      return en(<PasswordResetForm onSubmit={vi.fn()} isSubmitted={sent} successMessage="Done." />);
    }
    render(<Controlled />);
    expect(screen.getByRole('status')).toHaveTextContent('Done.');
  });
});

describe('AuthLayout', () => {
  it('renders the heading at the requested level with brand, footer and aside', async () => {
    const { container } = render(
      <AuthLayout headingLevel={2} brand="Acme" title="Welcome back" description="Sign in to continue." footer="Legal" aside={<p>Side</p>}>
        <p>Form</p>
      </AuthLayout>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Welcome back' })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-has-aside', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });
});
