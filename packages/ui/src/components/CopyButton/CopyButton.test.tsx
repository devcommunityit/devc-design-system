import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { CopyButton } from './CopyButton';

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
}

describe('CopyButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('copies the value, announces success and resets', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    const onCopy = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<CopyButton ref={ref} value="API-KEY-123" onCopy={onCopy} resetAfter={50} />);
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('data-status', 'idle');
    await user.click(button);
    expect(writeText).toHaveBeenCalledWith('API-KEY-123');
    expect(onCopy).toHaveBeenCalledWith('API-KEY-123');
    expect(button).toHaveAttribute('data-status', 'copied');
    expect(button).toHaveTextContent('Copied');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
    await waitFor(() => expect(button).toHaveAttribute('data-status', 'idle'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('reads a function value at press time', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    let current = 'first';
    render(<CopyButton value={() => current} />);
    current = 'second';
    await user.click(screen.getByRole('button'));
    expect(writeText).toHaveBeenCalledWith('second');
  });

  it('reports errors without throwing (localized)', async () => {
    const user = userEvent.setup();
    const error = new Error('denied');
    mockClipboard(() => Promise.reject(error));
    const onCopyError = vi.fn();
    render(
      <LocaleProvider locale="it-IT">
        <CopyButton value="x" onCopyError={onCopyError} />
      </LocaleProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Copia' }));
    expect(onCopyError).toHaveBeenCalledWith(error);
    expect(screen.getByRole('button')).toHaveAttribute('data-status', 'error');
    expect(screen.getByRole('status')).toHaveTextContent('Copia non riuscita');
  });

  it('icon-only keeps a stable accessible name', async () => {
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    const { container } = render(<CopyButton value="x" iconOnly>Copy link</CopyButton>);
    const button = screen.getByRole('button', { name: 'Copy link' });
    expect(button).not.toHaveTextContent('Copy link');
    await act(async () => {
      await user.click(button);
    });
    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveAttribute('data-status', 'copied');
    expect(await axe(container)).toHaveNoViolations();
  });
});
