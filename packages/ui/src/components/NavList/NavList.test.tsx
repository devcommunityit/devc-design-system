import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { NavList, type NavListItem } from './NavList';

const items: NavListItem[] = [
  { id: 'home', label: 'Dashboard', href: '#home', icon: <svg data-testid="icon-home" /> },
  { id: 'users', label: 'Utenti', href: '#users', icon: <svg />, badge: <span>12</span> },
  {
    id: 'settings',
    label: 'Impostazioni',
    icon: <svg />,
    items: [
      { id: 'general', label: 'Generali', href: '#general' },
      { id: 'billing', label: 'Fatturazione', href: '#billing' },
    ],
  },
  { id: 'audit', label: 'Audit log', href: '#audit', isDisabled: true },
];

describe('NavList', () => {
  it('renders a labelled nav with a list of links, aria-current and forwards ref and DOM props', () => {
    const ref = createRef<HTMLElement>();
    render(<NavList ref={ref} label="Amministrazione" items={items} currentId="users" data-testid="nav" variant="pill" />);
    const nav = screen.getByRole('navigation', { name: 'Amministrazione' });
    expect(ref.current).toBe(nav);
    expect(nav).toHaveAttribute('data-variant', 'pill');
    expect(nav).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getAllByRole('list')[0]?.tagName).toBe('UL');
    expect(screen.getByRole('link', { name: /Utenti/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '#home');
    expect(screen.getByRole('link', { name: 'Audit log' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByTestId('icon-home').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('expands and collapses groups (uncontrolled), auto-expanding the group of the current page', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<NavList label="Admin" items={items} />);
    const trigger = screen.getByRole('button', { name: 'Impostazioni' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    expect(panel).not.toBeVisible();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Generali' })).toBeVisible();
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    unmount();

    render(<NavList label="Admin" items={items} currentId="billing" />);
    expect(screen.getByRole('button', { name: 'Impostazioni' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Fatturazione' })).toHaveAttribute('aria-current', 'page');
  });

  it('supports controlled expandedIds', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<NavList label="Admin" items={items} expandedIds={[]} onExpandedChange={onExpandedChange} />);
    const trigger = screen.getByRole('button', { name: 'Impostazioni' });
    await user.click(trigger);
    expect(onExpandedChange).toHaveBeenCalledWith(['settings']);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onNavigate with the item id and the click event', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((_id: string, event: { preventDefault: () => void }) => event.preventDefault());
    const onClick = vi.fn();
    render(<NavList label="Admin" items={[{ id: 'home', label: 'Home', href: '#home', linkProps: { onClick } }]} onNavigate={onNavigate} />);
    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate.mock.calls[0]?.[0]).toBe('home');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('collapses to an icon-only rail with a localized toggle and tooltips (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(
      <ThemeProvider persistence={false}>
        <NavList label="Admin" items={items} collapsible onCollapsedChange={onCollapsedChange} />
      </ThemeProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'Admin' });
    await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();
    // Labels stay in the accessible name.
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    // Fallback initial for items without icon.
    expect(screen.getByRole('link', { name: 'Audit log' }).querySelector('[data-fallback]')).toHaveTextContent('A');

    // Focus is still on the toggle: the next tab stop is the first link.
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Dashboard');

    // A group in the rail expands the rail and opens the group.
    await user.click(screen.getByRole('button', { name: 'Impostazioni' }));
    expect(nav).not.toHaveAttribute('data-collapsed');
    expect(screen.getByRole('button', { name: 'Impostazioni' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports controlled collapsed state and Italian labels', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [collapsed, setCollapsed] = useState(true);
      return (
        <LocaleProvider locale="it-IT">
          <NavList label="Admin" items={items} collapsible collapsed={collapsed} onCollapsedChange={setCollapsed} />
        </LocaleProvider>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Espandi navigazione' }));
    expect(screen.getByRole('button', { name: 'Comprimi navigazione' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).not.toHaveAttribute('data-collapsed');
  });

  it('renders horizontal lists flat, without toggle or group buttons', () => {
    render(<NavList label="Sezioni" items={items} orientation="horizontal" variant="underline" collapsible defaultCollapsed currentId="general" />);
    const nav = screen.getByRole('navigation', { name: 'Sezioni' });
    expect(nav).toHaveAttribute('data-orientation', 'horizontal');
    expect(nav).not.toHaveAttribute('data-collapsed');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getAllByRole('link')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Generali' })).toHaveAttribute('aria-current', 'page');
  });

  it('hides icons with showIcons={false}', () => {
    render(<NavList label="Admin" items={items} showIcons={false} />);
    expect(screen.queryByTestId('icon-home')).not.toBeInTheDocument();
  });

  it('has no axe violations (vertical, collapsed and horizontal)', async () => {
    const { container } = render(
      <ThemeProvider persistence={false}>
        <NavList label="Verticale" items={items} currentId="general" collapsible />
        <NavList label="Rail" items={items} currentId="home" defaultCollapsed />
        <NavList label="Orizzontale" items={items} orientation="horizontal" currentId="home" />
      </ThemeProvider>,
    );
    await waitFor(() => expect(container.querySelectorAll('nav')).toHaveLength(3));
    expect(await axe(container)).toHaveNoViolations();
  });
});
