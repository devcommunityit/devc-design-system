import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Key, Selection } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Button } from '../Button/Button';
import { DropdownMenu, Menu, MenuItem, MenuSection, MenuSeparator, SubmenuTrigger } from './DropdownMenu';

function Example({ onAction }: { onAction: (key: unknown) => void }) {
  return (
    <DropdownMenu>
      <Button variant="outline">Actions</Button>
      <Menu onAction={onAction}>
        <MenuSection title="File">
          <MenuItem id="edit" shortcut="E">
            Edit
          </MenuItem>
          <MenuItem id="duplicate" description="Creates a copy">
            Duplicate
          </MenuItem>
        </MenuSection>
        <MenuSeparator />
        <SubmenuTrigger>
          <MenuItem id="share">Share</MenuItem>
          <Menu>
            <MenuItem id="email">Email</MenuItem>
            <MenuItem id="link">Copy link</MenuItem>
          </Menu>
        </SubmenuTrigger>
        <MenuItem id="archive" isDisabled>
          Archive
        </MenuItem>
        <MenuItem id="delete" tone="danger">
          Delete
        </MenuItem>
      </Menu>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens from the keyboard, focuses the first item and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(<Example onAction={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    await user.tab();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus());
    expect(await axe(menu)).toHaveNoViolations();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('runs actions, skips disabled items and opens submenus with ArrowRight', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Share' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2));
    await user.keyboard('{ArrowLeft}');
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(1));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onAction.mock.calls[0]?.[0]).toBe('delete');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('renders inside the nested ThemeProvider portal container', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider mode="light">
        <ThemeProvider mode="dark" theme="ember">
          <Example onAction={vi.fn()} />
        </ThemeProvider>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const menu = await screen.findByRole('menu');
    const portal = menu.closest('[data-dc-portal]');
    expect(portal).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    expect(portal).toHaveAttribute('data-dc-palette', 'ember');
  });

  it('supports checkable items with selectionMode (controlled, so the choice survives closing)', async () => {
    const user = userEvent.setup();
    function Sort() {
      const [selected, setSelected] = useState<Selection>(new Set<Key>(['name']));
      return (
        <DropdownMenu>
          <Button>Sort</Button>
          <Menu selectionMode="single" selectedKeys={selected} onSelectionChange={setSelected}>
            <MenuItem id="name">Name</MenuItem>
            <MenuItem id="date">Date</MenuItem>
          </Menu>
        </DropdownMenu>
      );
    }
    render(<Sort />);
    await user.click(screen.getByRole('button', { name: 'Sort' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('menuitemradio', { name: 'Date' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Sort' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Date' })).toHaveAttribute('aria-checked', 'true');
  });
});
