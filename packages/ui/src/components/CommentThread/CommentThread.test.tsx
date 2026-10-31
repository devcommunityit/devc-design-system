import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { CommentThread } from './CommentThread';

describe('CommentThread', () => {
  it('renders nested comments and dispatches replies and likes', async () => {
    const user = userEvent.setup();
    const onReply = vi.fn();
    const onLike = vi.fn();
    const comments = [{ id: 'a', author: 'Sara', content: 'Hello', replies: [{ id: 'b', author: 'Luca', content: 'Hi' }] }];
    const { container } = render(<LocaleProvider locale="en-US"><CommentThread aria-label="Discussion" comments={comments} onReply={onReply} onLike={onLike} /></LocaleProvider>);
    const article = screen.getByRole('article', { name: 'Sara' });
    await user.click(within(article).getByRole('button', { name: 'Like comment by Sara' }));
    expect(onLike).toHaveBeenCalledWith(comments[0], true);
    await user.click(within(article).getByRole('button', { name: 'Reply to Sara' }));
    await user.type(within(article).getByRole('textbox', { name: 'Reply to Sara' }), 'Thanks');
    await user.click(within(article).getByRole('button', { name: 'Send reply' }));
    expect(onReply).toHaveBeenCalledWith(comments[0], 'Thanks');
    expect(screen.getByRole('article', { name: 'Luca' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
