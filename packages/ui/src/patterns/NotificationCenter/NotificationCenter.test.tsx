import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { NotificationCenter, type NotificationItem } from './NotificationCenter';

const NOW = Date.parse('2025-03-12T10:00:00Z');
const initial: NotificationItem[] = [
  { id: '1', title: 'Invoice approved', description: 'INV-2025-0142', date: '2025-03-12T09:55:00Z', href: '/invoices/142' },
  { id: '2', title: 'New comment', date: '2025-03-12T08:00:00Z' },
  { id: '3', title: 'Backup completed', date: '2025-03-11T22:00:00Z', read: true },
];

function Demo({ onItemAction }: { onItemAction?: (id: string) => void }) {
  const [items, setItems] = useState(initial);
  return (
    <ThemeProvider>
      <NotificationCenter
        items={items}
        now={NOW}
        onMarkRead={(id) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))}
        onMarkAllRead={() => setItems((list) => list.map((n) => ({ ...n, read: true })))}
        onItemAction={onItemAction}
      />
    </ThemeProvider>
  );
}

describe('NotificationCenter', () => {
  it('names the trigger with the unread count and opens a themed dialog', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Notifications, 2 unread' });
    expect(trigger.parentElement).toHaveTextContent('2');
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Notifications' });
    expect(dialog.closest('[data-dc-portal]')).not.toBeNull();
    const items = within(dialog).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Invoice approved (Unread)');
    expect(items[2]).not.toHaveTextContent('Unread');
    expect(within(items[0]!).getByRole('link', { name: /Invoice approved/ })).toHaveAttribute('href', '/invoices/142');
    expect(within(items[0]!).getByText('5 minutes ago').tagName).toBe('TIME');
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('marks one or all as read and keeps focus inside the panel', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: /Notifications/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Mark "Invoice approved" as read' }));
    // While the popover is open, content outside it (the trigger included) is hidden from assistive technology.
    expect(screen.getByRole('button', { name: 'Notifications, 1 unread', hidden: true })).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Mark "New comment" as read' })).toHaveFocus());
    await user.click(within(dialog).getByRole('button', { name: 'Mark all as read' }));
    expect(screen.getByRole('button', { name: 'Notifications', hidden: true })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Mark all as read' })).toBeDisabled();
    await waitFor(() => expect(within(dialog).getByRole('list')).toHaveFocus());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Notifications' })).toHaveFocus());
  });

  it('calls onItemAction and closes when a linked title is activated', async () => {
    const user = userEvent.setup();
    const onItemAction = vi.fn();
    render(<Demo onItemAction={onItemAction} />);
    await user.click(screen.getByRole('button', { name: /Notifications/ }));
    const link = await screen.findByRole('link', { name: /Invoice approved/ });
    link.addEventListener('click', (event) => event.preventDefault());
    await user.click(link);
    expect(onItemAction).toHaveBeenCalledWith('1');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('shows a localized empty state', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="it-IT">
        <ThemeProvider>
          <NotificationCenter items={[]} onMarkAllRead={() => undefined} />
        </ThemeProvider>
      </LocaleProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Notifiche' }));
    const dialog = await screen.findByRole('dialog', { name: 'Notifiche' });
    expect(dialog).toHaveTextContent('Nessuna notifica');
    expect(within(dialog).queryByRole('button', { name: 'Segna tutte come lette' })).toBeNull();
  });
});
