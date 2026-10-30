import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { AlertDialog } from '../AlertDialog/AlertDialog';
import { Button } from '../Button/Button';
import { Drawer } from '../Drawer/Drawer';
import { Dialog, DialogTrigger } from './Dialog';

describe('Dialog', () => {
  it('opens from a trigger, focuses inside, closes with Escape and restores focus', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogTrigger>
        <Button>Open</Button>
        <Dialog title="Edit profile" description="Changes are saved locally." onOpenChange={onOpenChange}>
          <input aria-label="Name" />
        </Dialog>
      </DialogTrigger>,
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toHaveAccessibleDescription('Changes are saved locally.');
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    // react-aria restores focus on the frame after the overlay unmounts.
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('traps focus with Tab and closes from the localized close button', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="it-IT">
        <Dialog title="Titolo" defaultOpen>
          <input aria-label="A" />
        </Dialog>
      </LocaleProvider>,
    );
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 4; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await user.click(within(dialog).getByRole('button', { name: 'Chiudi' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('supports controlled state, render-function children and footer', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <span data-testid="state">{String(open)}</span>
          <Dialog title="Controlled" isOpen={open} onOpenChange={setOpen} footer={({ close }) => <Button onPress={close}>Done</Button>}>
            {({ close }) => <Button onPress={close}>Inner close</Button>}
          </Dialog>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByTestId('state')).toHaveTextContent('false');
  });

  it('supports nested dialogs: Escape closes only the top-most', async () => {
    const user = userEvent.setup();
    render(
      <DialogTrigger>
        <Button>Outer</Button>
        <Dialog title="Outer dialog">
          <DialogTrigger>
            <Button>Inner</Button>
            <Dialog title="Inner dialog">inner</Dialog>
          </DialogTrigger>
        </Dialog>
      </DialogTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Outer' }));
    await user.click(screen.getByRole('button', { name: 'Inner' }));
    expect(screen.getByRole('dialog', { name: 'Inner dialog' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Inner dialog' })).not.toBeInTheDocument());
    expect(screen.getByRole('dialog', { name: 'Outer dialog' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Inner' })).toHaveFocus());
  });

  it('renders inside the nearest ThemeProvider portal (nested providers)', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultMode="light" defaultTheme="lagoon">
        <ThemeProvider defaultMode="dark" defaultTheme="ember">
          <DialogTrigger>
            <Button>Open</Button>
            <Dialog title="Scoped">x</Dialog>
          </DialogTrigger>
        </ThemeProvider>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const portal = screen.getByRole('dialog').closest('[data-dc-portal]');
    expect(portal).toHaveAttribute('data-dc-palette', 'ember');
    expect(portal).toHaveAttribute('data-dc-resolved-scheme', 'dark');
  });

  it('Drawer exposes placement and dialog semantics', () => {
    render(
      <Drawer title="Filters" defaultOpen placement="start">
        content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog.closest('[data-placement="start"]')).not.toBeNull();
  });

  it('has no axe violations when open', async () => {
    render(
      <Dialog title="Accessible" description="Desc" defaultOpen footer={<Button>OK</Button>}>
        Body
      </Dialog>,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

describe('AlertDialog', () => {
  it('uses role alertdialog, focuses Cancel and is not dismissed by Escape-less backdrop', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <DialogTrigger>
        <Button>Delete</Button>
        <AlertDialog title="Delete project?" tone="danger" confirmLabel="Delete" onConfirm={onConfirm} onCancel={onCancel}>
          This cannot be undone.
        </AlertDialog>
      </DialogTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project?' });
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm (not onCancel) and closes', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <AlertDialog title="Archive?" defaultOpen onConfirm={onConfirm} onCancel={onCancel}>
        Sure?
      </AlertDialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('shows pending for async confirm and stays open on rejection', async () => {
    const user = userEvent.setup();
    let reject: (e: Error) => void = () => {};
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((_, rej) => {
          reject = rej;
        }),
    );
    render(
      <AlertDialog title="Send?" defaultOpen onConfirm={onConfirm}>
        x
      </AlertDialog>,
    );
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirm);
    expect(confirm).toHaveAttribute('data-pending', 'true');
    await act(async () => reject(new Error('fail')));
    expect(confirm).not.toHaveAttribute('data-pending');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
