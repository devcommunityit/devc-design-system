import { render, screen, within } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Leaderboard } from './Leaderboard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

const people = [
  { id: 'sara', name: 'Sara Leone', subtitle: '12 articles', points: 2840, href: '/u/sara' },
  { id: 'giulia', name: 'Giulia Conti', points: 2115 },
  { id: 'marco', name: 'Marco Rossi', points: 1760 },
  { id: 'luca', name: 'Luca Bianchi', points: 1320 },
];

describe('Leaderboard', () => {
  it('renders a titled ordered list with ranks, names and formatted points', () => {
    const ref = createRef<HTMLDivElement>();
    en(<Leaderboard ref={ref} data-testid="board" title="Top contributors" items={people} />);
    expect(ref.current).toBe(screen.getByTestId('board'));
    expect(screen.getByRole('heading', { level: 3, name: 'Top contributors' })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Top contributors' });
    expect(list.tagName).toBe('OL');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveAttribute('data-top', '1');
    expect(rows[2]).toHaveAttribute('data-top', '3');
    expect(rows[3]).not.toHaveAttribute('data-top');
    expect(within(rows[0]!).getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2,840 pts')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sara Leone' })).toHaveAttribute('href', '/u/sara');
    expect(screen.getByText('12 articles')).toBeInTheDocument();
  });

  it('highlights the current user with aria-current', () => {
    en(<Leaderboard aria-label="Ranking" items={people} highlightId="luca" />);
    const list = screen.getByRole('list', { name: 'Ranking' });
    const current = within(list).getAllByRole('listitem')[3];
    expect(current).toHaveAttribute('aria-current', 'true');
    expect(current).toHaveAttribute('data-current', 'true');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('supports start, maxItems, formatOptions and footer', () => {
    en(
      <Leaderboard
        aria-label="Page 2"
        variant="plain"
        start={11}
        maxItems={2}
        formatOptions={{ notation: 'compact' }}
        items={people}
        footer={<a href="/all">All</a>}
      />,
    );
    const list = screen.getByRole('list', { name: 'Page 2' });
    expect(list).toHaveAttribute('start', '11');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).not.toHaveAttribute('data-top');
    expect(within(rows[0]!).getByText('11')).toBeInTheDocument();
    expect(screen.getByText('2.8K pts')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
  });

  it('localizes points', () => {
    render(
      <LocaleProvider locale="it-IT">
        <Leaderboard title="Classifica" items={[{ id: 'a', name: 'Sara Leone', points: 2840 }]} />
      </LocaleProvider>,
    );
    expect(screen.getByText('2840 pt')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(<Leaderboard title="Top" items={people} highlightId="giulia" footer={<a href="/all">All</a>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
