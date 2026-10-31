import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { MentionInput, MentionTextarea } from './MentionInput';

const suggestions = [{ id: 'maria', label: 'Maria Rossi', handle: 'maria' }, { id: 'marco', label: 'Marco Bianchi', handle: 'marco' }];

describe('MentionInput', () => {
  it('filters suggestions and inserts the selected mention', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MentionInput label="Comment" suggestions={suggestions} onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'Comment' });
    await user.type(input, 'Hi @mar');
    expect(screen.getByRole('option', { name: /Maria Rossi/ })).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('Hi @maria ');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MentionInput label="Comment" suggestions={suggestions} defaultValue="Hi " />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not insert a stale suggestion after the caret moves', async () => {
    const user = userEvent.setup();
    render(<MentionInput label="Comment" suggestions={suggestions} />);
    const input = screen.getByRole('combobox', { name: 'Comment' });
    await user.type(input, 'Hi @mar');
    await user.keyboard('{Home}{Enter}');
    expect(input).toHaveValue('Hi @mar');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('selects an option using a click without a pointer event', async () => {
    const user = userEvent.setup();
    const onMentionSelect = vi.fn();
    render(<MentionInput label="Comment" suggestions={suggestions} onMentionSelect={onMentionSelect} />);
    const input = screen.getByRole('combobox', { name: 'Comment' });
    await user.type(input, '@mar');
    fireEvent.click(screen.getByRole('option', { name: /Maria Rossi/ }));
    expect(input).toHaveValue('@maria ');
    expect(onMentionSelect).toHaveBeenCalledWith(suggestions[0]);
  });

  it('replaces the full token when the caret is in the middle and keeps existing spacing', async () => {
    render(<MentionInput label="Comment" suggestions={suggestions} defaultValue="Hi @marvel and friends" />);
    const input = screen.getByRole('combobox', { name: 'Comment' });
    if (!(input instanceof HTMLInputElement)) throw new Error('Expected an input.');
    await userEvent.setup().click(input);
    input.setSelectionRange(7, 7);
    fireEvent.select(input);
    fireEvent.click(screen.getByRole('option', { name: /Marco Bianchi/ }));
    expect(input).toHaveValue('Hi @marco and friends');
  });

  it('supports multiline text and independent hashtag suggestions', async () => {
    const user = userEvent.setup();
    const onHashtagSelect = vi.fn();
    const { container } = render(
      <MentionTextarea label="Comment" suggestions={suggestions} hashtagSuggestions={[{ id: 'react', label: 'React', handle: 'react' }]} onHashtagSelect={onHashtagSelect} />,
    );
    const input = screen.getByRole('textbox', { name: 'Comment' });
    await user.type(input, 'First line{Enter}#rea');
    expect(await axe(container)).toHaveNoViolations();
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('First line\n#react ');
    expect(onHashtagSelect).toHaveBeenCalledWith({ id: 'react', label: 'React', handle: 'react' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
