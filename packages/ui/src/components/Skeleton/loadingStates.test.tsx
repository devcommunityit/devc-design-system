import { render, screen } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ArticleCard } from '../ArticleCard/ArticleCard';
import { DiscussionList } from '../DiscussionList/DiscussionList';
import { EventCard } from '../EventCard/EventCard';
import { KpiCard } from '../KpiCard/KpiCard';
import { Leaderboard } from '../Leaderboard/Leaderboard';
import { PostList } from '../PostList/PostList';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { SkeletonComment, SkeletonKanban, SkeletonProfile } from './SkeletonPresets';

const it_ = (ui: ReactElement) => render(<LocaleProvider locale="it-IT">{ui}</LocaleProvider>);

describe('isLoading on data components', () => {
  it.each([
    ['KpiCard', <KpiCard key="k" label="Iscritti" value={null} sparkline={[1, 2]} isLoading className="slot" />, 'kpi'],
    ['ProfileCard', <ProfileCard key="p" name="" isLoading className="slot" />, 'profile'],
    ['ArticleCard', <ArticleCard key="a" title="" isLoading className="slot" />, 'card'],
    ['EventCard', <EventCard key="e" title="" isLoading className="slot" />, 'card'],
  ])('%s renders a busy box with the matching preset and keeps className', (_, ui, preset) => {
    const { container } = it_(ui);
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveAttribute('aria-busy', 'true');
    expect(box).toHaveClass('slot');
    expect(box.querySelector(`[data-skeleton="${preset}"]`)).toBeInTheDocument();
    expect(screen.getByText('Caricamento…')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('forwards the ref to the loading box', () => {
    const ref = createRef<HTMLDivElement>();
    it_(<KpiCard ref={ref} label="Iscritti" value={1} isLoading />);
    expect(ref.current).toHaveAttribute('aria-busy', 'true');
  });

  it('lists keep their element and show loadingRows skeleton rows', () => {
    const { container } = it_(
      <>
        <PostList isLoading loadingRows={2} aria-label="Post" />
        <DiscussionList items={[{ id: '1', title: 'Thread' }]} isLoading loadingRows={3} aria-label="Discussioni" />
      </>,
    );
    const [posts, threads] = screen.getAllByRole('list');
    expect(posts).toHaveAttribute('aria-busy', 'true');
    expect(threads?.tagName).toBe('OL');
    expect(threads).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Thread')).not.toBeInTheDocument();
    const rows = [...container.querySelectorAll('[data-skeleton="list"]')].map((el) => el.querySelectorAll('[data-part="row"]').length);
    expect(rows).toEqual([2, 3]);
  });

  it('Leaderboard keeps the title while loading', () => {
    it_(<Leaderboard title="Top contributor" items={[{ id: 'a', name: 'Ada', points: 10 }]} isLoading />);
    expect(screen.getByRole('heading', { name: 'Top contributor' })).toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
    expect(screen.getByText('Caricamento…').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
  });

  it('has no axe violations while loading', async () => {
    const { container } = it_(
      <main>
        <KpiCard label="Iscritti" value={null} isLoading />
        <ArticleCard title="" isLoading />
        <PostList isLoading aria-label="Post" />
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('new skeleton presets', () => {
  it('render deterministic, aria-hidden markup', () => {
    const ui = (
      <>
        <SkeletonProfile stats={2} />
        <SkeletonComment rows={2} replies={2} />
        <SkeletonKanban columns={3} cards={2} />
      </>
    );
    expect(renderToString(ui)).toBe(renderToString(ui));
    const { container } = render(ui);
    for (const part of ['profile', 'comments', 'kanban']) {
      expect(container.querySelector(`[data-skeleton="${part}"]`)).toHaveAttribute('aria-hidden', 'true');
    }
    expect(container.querySelectorAll('[data-part="reply"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-part="comment"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-part="column"]')).toHaveLength(3);
  });
});
