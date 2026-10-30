import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { PromptSuggestions } from './PromptSuggestions';

const items = [{ id: 'summary', label: 'Summarize', prompt: 'Summarize the document' }];

describe('PromptSuggestions', () => {
  it('passes the complete suggestion on keyboard activation', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<PromptSuggestions items={items} onAction={onAction} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledWith(items[0]);
  });

  it('disables every suggestion without triggering callbacks', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<PromptSuggestions items={items} onAction={onAction} isDisabled />);
    await user.click(screen.getByRole('button'));
    expect(onAction).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<PromptSuggestions items={items} onAction={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
