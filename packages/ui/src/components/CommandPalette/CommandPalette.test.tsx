import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { CommandPalette, type CommandPaletteItem } from './CommandPalette';

const commands: CommandPaletteItem[] = [
  { id: 'new', label: 'New project', section: 'Projects', keywords: ['create'] },
  { id: 'open', label: 'Open project', section: 'Projects' },
  { id: 'theme', label: 'Toggle dark mode', section: 'Preferences', keywords: ['tema', 'scuro'] },
  { id: 'settings', label: 'Impostazioni', section: 'Preferences' },
];

function Harness({ onAction, hotkey = false }: { onAction: (id: string) => void; hotkey?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open palette
      </button>
      <CommandPalette commands={commands} isOpen={open} onOpenChange={setOpen} onAction={onAction} hotkey={hotkey} />
    </>
  );
}

describe('CommandPalette', () => {
  it('filters by label and keywords, runs the command and restores focus', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Harness onAction={onAction} />);
    const opener = screen.getByRole('button', { name: 'Open palette' });
    await user.click(opener);
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveFocus();
    expect(await axe(dialog)).toHaveNoViolations();
    await user.keyboard('scuro');
    expect(screen.getAllByRole('menuitem')).toHaveLength(1);
    expect(screen.getByRole('menuitem', { name: 'Toggle dark mode' })).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenCalledWith('theme', commands[2]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('shows the empty state and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<Harness onAction={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Open palette' }));
    await screen.findByRole('dialog');
    await user.keyboard('zzzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    // The first Escape clears the search field, the second closes the dialog.
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('opt-in Ctrl+K hotkey toggles the palette', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Harness onAction={vi.fn()} hotkey />);
    await user.keyboard('{Control>}k{/Control}');
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    unmount();
    render(<Harness onAction={vi.fn()} />);
    await user.keyboard('{Control>}k{/Control}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});