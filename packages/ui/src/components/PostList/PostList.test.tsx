import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PostList, PostListItem, VoteButton } from './PostList';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

const items = [
  { id: 'k8s', title: 'AKS + KEDA', href: '/k8s', thumbLabel: 'K8s', tone: 'data-4' as const, author: 'Marco Rossi', meta: '6 min', tags: <span>Cloud</span>, votes: 186 },
  { id: 'gh', title: 'Copilot prompts', href: '/gh', thumbLabel: 'GH', author: 'Sara Leone', votes: 1240, isVoted: true },
];

describe('PostList', () => {
  it('renders a semantic list of posts with stretched links and meta', () => {
    const ref = createRef<HTMLUListElement>();
    en(<PostList ref={ref} aria-label="Posts" items={items} headingLevel={3} />);
    const list = screen.getByRole('list', { name: 'Posts' });
    expect(ref.current).toBe(list);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 3, name: 'AKS + KEDA' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'AKS + KEDA' })).toHaveAttribute('href', '/k8s');
    expect(screen.getByText('K8s')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Marco Rossi')).toBeInTheDocument();
    expect(screen.getByText('Cloud')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('data-tone', 'data-4');
  });

  it('exposes vote buttons with pressed state, label and full count description', () => {
    en(<PostList items={items} />);
    const [first, second] = screen.getAllByRole('button');
    expect(first).toHaveAccessibleName('Upvote 186');
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(first).toHaveAccessibleDescription('186 votes');
    expect(second).toHaveAccessibleName('Remove upvote 1.2K');
    expect(second).toHaveAttribute('aria-pressed', 'true');
    expect(second).toHaveAccessibleDescription('1,240 votes');
    expect(second).toHaveTextContent('1.2K');
  });

  it('reports vote changes with the item id', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();
    en(<PostList items={[{ id: 'a', title: 'A', votes: 1 }]} onVote={onVote} />);
    const vote = screen.getByRole('button', { name: /Upvote/ });
    await user.click(vote);
    expect(onVote).toHaveBeenCalledWith('a', true);
    expect(vote).toHaveAttribute('aria-pressed', 'true');
    expect(vote).toHaveAccessibleName('Remove upvote 1');
  });

  it('supports composable children', () => {
    en(
      <PostList variant="plain" data-testid="list">
        <PostListItem title="Meetup notes" thumbLabel="MI" />
      </PostList>,
    );
    expect(screen.getByTestId('list')).toHaveAttribute('data-variant', 'plain');
    expect(screen.getByRole('listitem')).toHaveTextContent('Meetup notes');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(<PostList aria-label="Trending" items={items} headingLevel={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('VoteButton', () => {
  it('toggles when uncontrolled and stays put when controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    en(
      <>
        <VoteButton count={1} />
        <VoteButton count={2} isSelected={false} onChange={onChange} />
      </>,
    );
    const [uncontrolled, controlled] = screen.getAllByRole('button');
    await user.click(uncontrolled!);
    expect(uncontrolled).toHaveAttribute('aria-pressed', 'true');
    await user.click(controlled!);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(controlled).toHaveAttribute('aria-pressed', 'false');
  });

  it('localizes labels and counts', () => {
    render(
      <LocaleProvider locale="it-IT">
        <VoteButton count={1} />
      </LocaleProvider>,
    );
    const button = screen.getByRole('button', { name: 'Vota 1' });
    expect(button).toHaveAccessibleDescription('1 voto');
  });
});
