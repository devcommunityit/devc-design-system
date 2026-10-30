import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { AppShell, APP_SHELL_COMPACT_QUERY, Footer, Header, Sidebar, type SidebarSection } from './AppShell';

const sections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', href: '#home' },
      { id: 'orders', label: 'Orders', href: '#orders' },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    collapsible: true,
    items: [{ id: 'users', label: 'Users', href: '#users' }],
  },
];

function mockCompact(matches: boolean) {
  const original = window.matchMedia;
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === APP_SHELL_COMPACT_QUERY ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
  return () => {
    window.matchMedia = original;
  };
}

function Shell(props: { onNavigate?: () => void }) {
  return (
    <AppShell
      header={<Header brand={<a href="#home">Acme</a>} actions={<button type="button">Account</button>} />}
      sidebar={<Sidebar sections={sections} currentId="orders" onNavigate={props.onNavigate} />}
      footer={<Footer legal="© 2025 Acme" columns={[{ title: 'Help', links: [{ label: 'Docs', href: '#docs' }] }]} />}
    >
      <h1>Orders</h1>
    </AppShell>
  );
}

describe('AppShell (desktop)', () => {
  let restore: () => void = () => {};
  afterEach(() => restore());

  it('exposes landmarks, a skip link to main and the current page', async () => {
    restore = mockCompact(false);
    const { container } = render(<Shell />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2025 Acme');
    const nav = screen.getByRole('navigation', { name: 'Sidebar' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page');
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip.getAttribute('href')).toBe(`#${screen.getByRole('main').id}`);
    // No hamburger needed: the sidebar is inline on desktop… but the button stays for consistency only when compact.
    expect(await axe(container)).toHaveNoViolations();
  });

  it('collapsible sidebar sections are disclosure buttons', async () => {
    restore = mockCompact(false);
    const user = userEvent.setup();
    render(<Shell />);
    const toggle = screen.getByRole('button', { name: 'Admin' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
  });

  it('localizes system strings', () => {
    restore = mockCompact(false);
    render(
      <LocaleProvider locale="it-IT">
        <Shell />
      </LocaleProvider>,
    );
    expect(screen.getByRole('link', { name: 'Vai al contenuto' })).toBeInTheDocument();
  });
});

describe('AppShell (compact)', () => {
  let restore: () => void = () => {};
  afterEach(() => restore());

  it('renders the sidebar in a drawer opened by the header menu button; Escape closes and restores focus', async () => {
    restore = mockCompact(true);
    const user = userEvent.setup();
    render(<Shell />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument());
    expect(screen.queryByRole('navigation', { name: 'Sidebar' })).not.toBeInTheDocument();
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(menuButton);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toContainElement(screen.getByRole('navigation', { name: 'Sidebar' }));
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(document.activeElement).toBe(menuButton));
  });

  it('closes the drawer after navigating', async () => {
    restore = mockCompact(true);
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Shell onNavigate={onNavigate} />);
    await user.click(await screen.findByRole('button', { name: 'Open menu' }));
    await user.click(await screen.findByRole('link', { name: 'Home' }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: 'home' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
