import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { ToastProvider, useToast } from './Toast';
import { createToastQueue } from './toastQueue';

function Trigger({ onClose }: { onClose?: () => void }) {
  const toast = useToast();
  return (
    <>
      <button type="button" onClick={() => toast.show({ title: 'Salvato', tone: 'success', onClose })}>
        ok
      </button>
      <button type="button" onClick={() => toast.show({ title: 'Errore di rete', tone: 'danger' })}>
        ko
      </button>
      <button
        type="button"
        onClick={() => toast.show({ title: 'Elemento eliminato', action: { label: 'Annulla', onAction: () => toast.show({ title: 'Ripristinato', duration: null }) } })}
      >
        undo
      </button>
    </>
  );
}

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('announces, auto-dismisses non-critical toasts and pauses on hover', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onClose = vi.fn();
    render(
      <ToastProvider>
        <Trigger onClose={onClose} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'ok' }));
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(within(region).getByRole('status')).toHaveTextContent('Success: Salvato');
    const item = within(region).getByText('Salvato').closest('li');
    if (!item) throw new Error('toast not rendered');
    await user.hover(item);
    act(() => vi.advanceTimersByTime(10000));
    expect(within(region).getByText('Salvato')).toBeInTheDocument();
    await user.unhover(item);
    act(() => vi.advanceTimersByTime(6100));
    expect(within(region).queryByText('Salvato')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps danger toasts and toasts with actions until closed; queues beyond maxVisible', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ToastProvider maxVisible={2}>
        <Trigger />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'ko' }));
    await user.click(screen.getByRole('button', { name: 'undo' }));
    await user.click(screen.getByRole('button', { name: 'ok' }));
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(within(region).getByRole('alert')).toHaveTextContent('Error: Errore di rete');
    expect(within(region).getAllByRole('listitem')).toHaveLength(2);
    act(() => vi.advanceTimersByTime(30000));
    expect(within(region).getByText('Errore di rete')).toBeInTheDocument();
    await user.click(within(region).getByRole('button', { name: 'Annulla' }));
    expect(within(region).getByText('Salvato')).toBeInTheDocument();
    await user.click(within(region).getAllByRole('button', { name: 'Dismiss' })[0]!);
    expect(within(region).queryByText('Errore di rete')).not.toBeInTheDocument();
    expect(within(region).getByText('Ripristinato')).toBeInTheDocument();
  });

  it('renders in the nested theme portal and accepts an external queue', async () => {
    const queue = createToastQueue();
    render(
      <ThemeProvider defaultMode="light" persistence={false}>
        <ThemeProvider defaultMode="dark" persistence={false}>
          <ToastProvider queue={queue}>
            <p>app</p>
          </ToastProvider>
        </ThemeProvider>
      </ThemeProvider>,
    );
    act(() => {
      queue.show({ title: 'Da codice esterno' });
    });
    const toast = await screen.findByText('Da codice esterno');
    const portal = toast.closest('[data-dc-portal]');
    expect(portal).not.toBeNull();
    expect(portal?.getAttribute('data-dc-scheme') ?? portal?.getAttribute('data-dc-mode')).toBe('dark');
  });

  it('throws a clear error outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Trigger />)).toThrow(/inside <ToastProvider>/);
    spy.mockRestore();
  });
});