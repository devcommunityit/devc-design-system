import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { SiteHeader } from './SiteHeader';

const links = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
];

describe('SiteHeader', () => {
  it('renders a named navigation landmark with the current page marked', async () => {
    const { container } = render(
      <LocaleProvider locale="en-US">
        <SiteHeader brand="Acme" links={links} currentId="pricing" />
      </LocaleProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'Site' });
    expect(within(nav).getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens the mobile drawer from the menu button, closes on link press and restores focus', async () => {
    const u = userEvent.setup();
    render(
      <LocaleProvider locale="en-US">
        <SiteHeader brand="Acme" links={links} drawerFooter={<button type="button">Sign in</button>} />
      </LocaleProvider>,
    );
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await u.click(button);
    const dialog = await screen.findByRole('dialog');
    expect(screen.getByRole('button', { name: 'Close menu', hidden: true })).toHaveAttribute('aria-expanded', 'true');
    const drawerNav = within(dialog).getByRole('navigation', { name: 'Site' });
    expect(within(dialog).getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    await u.click(within(drawerNav).getByRole('link', { name: 'Pricing' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus());
  });

  it('closes the drawer with Escape', async () => {
    const u = userEvent.setup();
    render(<SiteHeader brand="Acme" links={links} defaultMenuOpen />);
    await screen.findByRole('dialog');
    await u.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
