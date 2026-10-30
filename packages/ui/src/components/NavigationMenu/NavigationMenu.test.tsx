import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { NavigationMenu, type NavigationMenuItem } from './NavigationMenu';

const items: NavigationMenuItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'products',
    label: 'Products',
    items: [
      { id: 'analytics', label: 'Analytics', href: '/analytics', description: 'Dashboards and reports' },
      { id: 'billing', label: 'Billing', href: '/billing', current: true },
    ],
  },
  { id: 'docs', label: 'Docs', href: '/docs' },
];

describe('NavigationMenu', () => {
  it('follows the disclosure navigation pattern', async () => {
    const user = userEvent.setup();
    const { container } = render(<NavigationMenu items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: /Analytics/ })).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Analytics/ })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Billing' })).toHaveAttribute('aria-current', 'page');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Tab reaches the submenu links, Escape closes and returns focus', async () => {
    const user = userEvent.setup();
    render(<NavigationMenu items={items} />);
    await user.tab();
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('link', { name: /Analytics/ })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when focus leaves the navigation or on outside click', async () => {
    const user = userEvent.setup();
    render(
      <>
        <NavigationMenu items={items} />
        <button type="button">Outside</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('vertical orientation keeps groups open until toggled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <NavigationMenu items={items} orientation="vertical" aria-label="Sidebar" />
        <button type="button">Outside</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Products' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});