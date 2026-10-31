import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ArticleCard, ReactionBar } from './ArticleCard';

const en = (ui: ReactElement) => render(<LocaleProvider locale="en-US">{ui}</LocaleProvider>);

describe('ArticleCard', () => {
  it('renders a labelled article with a stretched title link, byline and reading time', () => {
    const ref = createRef<HTMLElement>();
    en(
      <ArticleCard
        ref={ref}
        data-testid="card"
        href="/posts/agents"
        title="Shipping agents"
        excerpt="Lessons learned"
        tags={<span>AI</span>}
        author={{ name: 'Giulia Conti' }}
        date="3 days ago"
        readingMinutes={9}
        cover={<pre>code</pre>}
      />,
    );
    const card = screen.getByTestId('card');
    expect(ref.current).toBe(card);
    expect(card.tagName).toBe('ARTICLE');
    expect(screen.getByRole('article', { name: 'Shipping agents' })).toBe(card);
    expect(screen.getByRole('heading', { level: 3, name: 'Shipping agents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shipping agents' })).toHaveAttribute('href', '/posts/agents');
    expect(screen.getByText('Giulia Conti')).toBeInTheDocument();
    expect(screen.getByText('9 min read')).toBeInTheDocument();
    expect(screen.getByText('3 days ago')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(card).toHaveAttribute('data-variant', 'featured');
    expect(card).toHaveAttribute('data-tone', 'brand');
  });

  it('renders a Date through RelativeTime and hides the cover in the compact variant', () => {
    const { container } = en(
      <ArticleCard data-testid="card" variant="compact" title="Short" date={new Date('2024-01-01T10:00:00Z')} cover={<pre>hidden</pre>} />,
    );
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2024-01-01T10:00:00.000Z');
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });

  it('renders the article image with its alternative text instead of custom cover content', () => {
    const { container } = en(
      <ArticleCard title="Image article" image={{ src: '/article.jpg', alt: 'A team reviewing a design' }} cover={<pre>ignored</pre>} />,
    );
    expect(screen.getByRole('img', { name: 'A team reviewing a design' })).toHaveAttribute('src', '/article.jpg');
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
    expect(container.querySelector('img')).toHaveClass('coverImage');
  });

  it('shows static reaction counts with accessible labels', () => {
    en(<ArticleCard title="Post" likes={412} comments={58} bookmarks={1300} commentsHref="#comments" />);
    expect(screen.getByText('412')).toBeInTheDocument();
    expect(screen.getByText('1.3K')).toBeInTheDocument();
    expect(screen.getByText(/^Like:/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Comments: 58' })).toHaveAttribute('href', '#comments');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('toggles like and bookmark buttons with aria-pressed', async () => {
    const user = userEvent.setup();
    const onBookmark = vi.fn();
    function Demo() {
      const [liked, setLiked] = useState(false);
      return <ArticleCard title="Post" href="/p" likes={10 + (liked ? 1 : 0)} isLiked={liked} onLike={setLiked} bookmarks={3} onBookmark={onBookmark} />;
    }
    en(<Demo />);
    const like = screen.getByRole('button', { name: 'Like: 10' });
    expect(like).toHaveAttribute('aria-pressed', 'false');
    await user.click(like);
    expect(screen.getByRole('button', { name: 'Like: 11' })).toHaveAttribute('aria-pressed', 'true');

    const save = screen.getByRole('button', { name: 'Save: 3' });
    await user.click(save);
    expect(onBookmark).toHaveBeenCalledWith(true);
    expect(save).toHaveAttribute('aria-pressed', 'true');
  });

  it('localizes labels and reading time', () => {
    render(
      <LocaleProvider locale="it-IT">
        <ReactionBar likes={2840} onLike={() => {}} />
        <ArticleCard title="Articolo" readingMinutes={6} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: /^Mi piace:/ })).toBeInTheDocument();
    expect(screen.getByText('6 min di lettura')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = en(
      <div>
        <ArticleCard
          href="/a"
          title="Featured"
          cover={<pre>await agent.run()</pre>}
          tags={<span>AI</span>}
          excerpt="Excerpt"
          author={{ name: 'Sara Leone' }}
          date="yesterday"
          readingMinutes={4}
          likes={5}
          onLike={() => {}}
          comments={2}
          bookmarks={1}
          onBookmark={() => {}}
        />
        <ArticleCard variant="compact" headingLevel={2} title="Compact" likes={1} comments={0} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
