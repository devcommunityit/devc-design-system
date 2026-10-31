import { render, screen, within } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ActivityCard } from './ActivityCard';

const items = [
  { id: '1', actor: 'Giulia Rossi', action: 'published an article', time: '10 minutes ago', dateTime: '2026-10-30T16:15', tone: 'success' as const },
  { id: '2', actor: 'Marco Bianchi', action: <a href="#c">commented</a>, time: '1 hour ago', dateTime: '2026-10-30T15:20' },
  { id: '3', actor: 'System', action: 'backup failed', time: '03:00', tone: 'danger' as const },
];

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('ActivityCard', () => {
  it('renders a named feed with actor, action and time and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    en(<ActivityCard ref={ref} data-testid="feed" title="Recent activity" items={items} />);
    expect(ref.current).toBe(screen.getByTestId('feed'));
    expect(screen.getByRole('heading', { level: 3, name: 'Recent activity' })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Recent activity' });
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Giulia Rossi published an article');
    expect(rows[0]).toHaveAttribute('data-tone', 'success');
    expect(rows[1]).toHaveAttribute('data-tone', 'neutral');
    const time = rows[0]?.querySelector('time');
    expect(time).toHaveAttribute('dateTime', '2026-10-30T16:15');
    expect(time).toHaveTextContent('10 minutes ago');
    expect(within(rows[1] as HTMLElement).getByRole('link', { name: 'commented' })).toBeInTheDocument();
  });

  it('hides avatars and dots from assistive technology', () => {
    en(<ActivityCard title="Feed" items={items} />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('shows the empty state when there are no items', () => {
    en(<ActivityCard title="Feed" items={[]} emptyState="Nothing yet" footer={<a href="#log">Full log</a>} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Full log' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(<ActivityCard title="Feed" headingLevel={2} items={items} footer={<a href="#log">Full log</a>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
