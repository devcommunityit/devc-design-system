import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { CommunityEngagementHub } from './CommunityEngagementHub';

describe('CommunityEngagementHub', () => {
  it('renders supplied community sections and delegates actions without choosing a winner', async () => {
    const user = userEvent.setup();
    const onPollVote = vi.fn();
    const onNpsRate = vi.fn();
    const onQuestionReact = vi.fn();
    const onRaffleEnter = vi.fn();
    const { baseElement } = render(
      <ThemeProvider>
        <CommunityEngagementHub
          title="Community"
          members={[{ id: 'member', name: 'Ari Kim', role: 'Engineer' }]}
          polls={[{ id: 'poll', question: 'Favorite topic?', options: [{ id: 'a', label: 'Design', votes: 1 }] }]}
          onPollVote={onPollVote}
          nps={{ question: 'Recommend this community?', selectedScore: 8 }}
          onNpsRate={onNpsRate}
          questions={[{ id: 'q', question: 'How do I join?', author: 'Ari', votes: 2, answers: 1 }]}
          onQuestionReact={onQuestionReact}
          raffle={{ title: 'Monthly raffle', entries: [{ id: 'entry', label: 'Ari Kim' }] }}
          onRaffleEnter={onRaffleEnter}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Community' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ari Kim' })).toBeInTheDocument();
    expect(screen.getByText('Monthly raffle')).toBeInTheDocument();
    expect(screen.queryByText(/Winner:/)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Choose' }));
    await user.click(screen.getByRole('button', { name: '10' }));
    await user.click(screen.getByRole('button', { name: '♥ React' }));
    await user.click(screen.getByRole('button', { name: 'Enter raffle' }));
    expect(onPollVote).toHaveBeenCalledWith('poll', 'a');
    expect(onNpsRate).toHaveBeenCalledWith(10);
    expect(onQuestionReact).toHaveBeenCalledWith('q');
    expect(onRaffleEnter).toHaveBeenCalledOnce();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('shows externally provided raffle winner and supports empty configuration', () => {
    const { rerender } = render(
      <ThemeProvider>
        <CommunityEngagementHub title="Community" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Community activities will appear here.')).toBeInTheDocument();
    rerender(
      <ThemeProvider>
        <CommunityEngagementHub
          title="Community"
          raffle={{ title: 'Raffle', entries: [], winner: { name: 'Ari Kim' } }}
        />
      </ThemeProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Winner: Ari Kim');
  });
});
