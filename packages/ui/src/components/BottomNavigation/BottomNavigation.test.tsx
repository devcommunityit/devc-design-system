import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell, Home, Search, User } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { BottomNavigation, type BottomNavigationItem } from './BottomNavigation';

const items: BottomNavigationItem[] = [
  { id: 'home', label: 'Home', icon: <Home /> },
  { id: 'search', label: 'Search', icon: <Search /> },
  { id: 'inbox', label: 'Inbox', icon: <Bell />, badge: <span>3</span>, badgeLabel: '3 unread' },
  { id: 'profile', label: 'Profile', icon: <User />, href: '/profile' },
];

describe('BottomNavigation', () => {
  it('uncontrolled: marks the current item and switches on press', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<BottomNavigation items={items} onChange={onChange} position="static" />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Inbox, 3 unread' }));
    expect(onChange).toHaveBeenCalledWith('inbox');
    expect(screen.getByRole('button', { name: 'Inbox, 3 unread' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('controlled value', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('search');
      return (
        <>
          <BottomNavigation items={items} value={value} onChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Home' }));
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });
});