import { render, screen, within } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { DiscussionList } from './DiscussionList';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

const items = [
  { id: 'a', title: 'Monorepo or polyrepo?', href: '/a', replies: 1084, time: '2h ago' },
  { id: 'b', title: 'RAG chunking', href: '/b', replies: 1, time: new Date('2024-05-01T08:00:00Z'), tag: <span>AI</span>, isNew: true },
];

describe('DiscussionList', () => {
  it('renders an ordered list with decorative zero-padded numbers', () => {
    const ref = createRef<HTMLOListElement>();
    en(<DiscussionList ref={ref} aria-label="Hot" items={items} />);
    const list = screen.getByRole('list', { name: 'Hot' });
    expect(ref.current).toBe(list);
    expect(list.tagName).toBe('OL');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(within(rows[0]!).getByText('01')).toHaveAttribute('aria-hidden', 'true');
    expect(within(rows[1]!).getByText('02')).toBeInTheDocument();
  });

  it('shows links, pluralized replies, time and tag', () => {
    const { container } = en(<DiscussionList items={items} headingLevel={4} />);
    expect(screen.getByRole('link', { name: 'Monorepo or polyrepo?' })).toHaveAttribute('href', '/a');
    expect(screen.getByRole('heading', { level: 4, name: /RAG chunking/ })).toBeInTheDocument();
    expect(screen.getByText('1,084 replies')).toBeInTheDocument();
    expect(screen.getByText('1 reply')).toBeInTheDocument();
    expect(screen.getByText('2h ago')).toBeInTheDocument();
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2024-05-01T08:00:00.000Z');
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('continues numbering from start', () => {
    en(<DiscussionList data-testid="list" start={11} items={items} />);
    expect(screen.getByTestId('list')).toHaveAttribute('start', '11');
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('localizes replies', () => {
    render(
      <LocaleProvider locale="it-IT">
        <DiscussionList items={[{ id: 'x', title: 'Primo talk', replies: 47 }]} />
      </LocaleProvider>,
    );
    expect(screen.getByText('47 risposte')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(<DiscussionList aria-label="Hot" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
