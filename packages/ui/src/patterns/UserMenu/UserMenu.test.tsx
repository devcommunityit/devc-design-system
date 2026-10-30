import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { MenuItem } from '../../components/DropdownMenu/DropdownMenu';
import { UserMenu } from './UserMenu';

const user = { name: 'Giulia Bianchi', email: 'giulia@example.com', role: 'Amministratrice' };

function Example({ onAction = vi.fn(), onSignOut }: { onAction?: (key: unknown) => void; onSignOut?: () => void }) {
  return (
    <LocaleProvider locale="it-IT">
      <UserMenu user={user} onAction={onAction} onSignOut={onSignOut}>
        <MenuItem id="profile">Profilo</MenuItem>
        <MenuItem id="settings">Impostazioni</MenuItem>
      </UserMenu>
    </LocaleProvider>
  );
}

describe('UserMenu', () => {
  it('names the trigger, shows the identity block and keeps focus management of the menu', async () => {
    const u = userEvent.setup();
    render(<Example onSignOut={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Menu account, Giulia Bianchi' });
    trigger.focus();
    await u.keyboard('{Enter}');
    const menu = await screen.findByRole('menu', { name: /Giulia Bianchi/ });
    expect(menu).toHaveAccessibleDescription(/giulia@example\.com.*Amministratrice/);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Profilo' })).toHaveFocus());
    expect(await axe(menu.closest('[data-dc-portal]') ?? menu)).toHaveNoViolations();
    await u.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('routes item actions and the built-in sign-out item', async () => {
    const u = userEvent.setup();
    const onAction = vi.fn();
    const onSignOut = vi.fn();
    render(<Example onAction={onAction} onSignOut={onSignOut} />);
    await u.click(screen.getByRole('button', { name: /Giulia Bianchi/ }));
    await u.click(await screen.findByRole('menuitem', { name: 'Impostazioni' }));
    expect(onAction).toHaveBeenCalledWith('settings');
    await u.click(screen.getByRole('button', { name: /Giulia Bianchi/ }));
    await u.click(await screen.findByRole('menuitem', { name: 'Esci' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('omits the sign-out item without onSignOut and inherits the nested theme in its portal', async () => {
    const u = userEvent.setup();
    render(
      <ThemeProvider mode="light">
        <ThemeProvider mode="dark" theme="lagoon">
          <Example />
        </ThemeProvider>
      </ThemeProvider>,
    );
    await u.click(screen.getByRole('button', { name: /Giulia Bianchi/ }));
    const menu = await screen.findByRole('menu');
    expect(screen.queryByRole('menuitem', { name: 'Esci' })).not.toBeInTheDocument();
    const portal = menu.closest('[data-dc-portal]');
    expect(portal).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    expect(portal).toHaveAttribute('data-dc-palette', 'lagoon');
  });
});
