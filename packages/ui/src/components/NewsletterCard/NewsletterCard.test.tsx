import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { NewsletterCard } from './NewsletterCard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

function deferred() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('NewsletterCard', () => {
  it('renders a named region with an accessible email field and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    en(<NewsletterCard ref={ref} id="news" title="The best of the week" eyebrow="Newsletter" description="No spam." placeholder="name@email.com" />);
    const region = screen.getByRole('region', { name: 'The best of the week' });
    expect(ref.current).toBe(region);
    expect(region).toHaveAttribute('id', 'news');
    expect(region).toHaveAttribute('data-status', 'idle');
    expect(screen.getByRole('heading', { level: 3, name: 'The best of the week' })).toBeInTheDocument();
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByRole('button', { name: 'Subscribe' })).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('does not submit an invalid email (native validation)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    en(<NewsletterCard title="Newsletter" onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    await user.type(screen.getByRole('textbox'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows the pending state while the promise runs, then announces success and clears the field', async () => {
    const user = userEvent.setup();
    const request = deferred();
    const onSubmit = vi.fn(() => request.promise);
    en(<NewsletterCard data-testid="card" title="Newsletter" onSubmit={onSubmit} />);
    await user.type(screen.getByRole('textbox'), ' ada@example.com ');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).toHaveBeenCalledWith('ada@example.com');
    expect(screen.getByTestId('card')).toHaveAttribute('data-status', 'pending');
    const button = screen.getByRole('button', { name: /Subscribe/ });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    // A second submit while pending is ignored.
    fireEvent.submit(button.closest('form') as HTMLFormElement);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => {
      request.resolve();
      await request.promise;
    });
    expect(screen.getByRole('status')).toHaveTextContent('Subscribed');
    expect(screen.getByTestId('card')).toHaveAttribute('data-status', 'success');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('announces the error message when the promise rejects', async () => {
    const user = userEvent.setup();
    const request = deferred();
    en(<NewsletterCard title="Newsletter" onSubmit={() => request.promise} errorMessage="Try again later" />);
    await user.type(screen.getByRole('textbox'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    await act(async () => {
      request.reject(new Error('boom'));
      await request.promise.catch(() => undefined);
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Try again later');
    expect(screen.getByRole('textbox')).toHaveValue('ada@example.com');
  });

  it('supports controlled value and status with custom success message', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    function Controlled() {
      const [email, setEmail] = useState('');
      return <NewsletterCard title="Newsletter" value={email} onChange={setEmail} status={email === 'done@example.com' ? 'success' : 'idle'} successMessage="See you Friday!" onSubmit={onSubmit} />;
    }
    en(<Controlled />);
    await user.type(screen.getByRole('textbox'), 'done@example.com');
    expect(screen.getByRole('textbox')).toHaveValue('done@example.com');
    expect(screen.getByRole('status')).toHaveTextContent('See you Friday!');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).toHaveBeenCalledWith('done@example.com');
    // Controlled value is never cleared by the component.
    expect(screen.getByRole('textbox')).toHaveValue('done@example.com');
  });

  it('marks the button pending when status is controlled as pending', () => {
    en(<NewsletterCard title="Newsletter" status="pending" />);
    expect(screen.getByRole('button', { name: /Subscribe/ })).toHaveAttribute('aria-disabled', 'true');
  });

  it('uses Italian messages', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="it-IT">
        <NewsletterCard title="Il meglio della settimana" onSubmit={() => undefined} />
      </LocaleProvider>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.it');
    await user.click(screen.getByRole('button', { name: 'Iscriviti' }));
    expect(screen.getByRole('status')).toHaveTextContent('Iscrizione completata');
  });

  it('has no axe violations', async () => {
    const { container } = en(<NewsletterCard title="Newsletter" eyebrow="Weekly" description="No spam." status="success" footer="Unsubscribe anytime." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
