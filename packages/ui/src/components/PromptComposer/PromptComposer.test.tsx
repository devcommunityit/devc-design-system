import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { PromptComposer } from './PromptComposer';

describe('PromptComposer', () => {
  it('sends trimmed text by Enter without clearing the consumer value and forwards the ref', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const ref = createRef<HTMLTextAreaElement>();
    render(<PromptComposer ref={ref} onSend={onSend} />);
    const input = screen.getByRole('textbox');
    expect(ref.current).toBe(input);
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    await user.type(input, '  A useful prompt  ');
    await user.keyboard('{Enter}');
    expect(onSend).toHaveBeenCalledWith('A useful prompt');
    expect(input).toHaveValue('  A useful prompt  ');
  });

  it('keeps newlines, IME composition and consumer-prevented keyboard events from submitting', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const { rerender } = render(<PromptComposer defaultValue="Hello" onSend={onSend} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    expect(input).toHaveValue('Hello\n');
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(onSend).not.toHaveBeenCalled();
    rerender(<PromptComposer defaultValue="Hello" onSend={onSend} textareaProps={{ onKeyDown: (event) => event.preventDefault() }} />);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('supports controlled input and stop, and prevents duplicate sends while generating', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const onChange = vi.fn();
    const onStop = vi.fn();
    const { rerender } = render(<PromptComposer value="Hello" onChange={onChange} onSend={onSend} />);
    await user.type(screen.getByRole('textbox'), '!');
    expect(onChange).toHaveBeenCalledWith('Hello!');
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
    rerender(<PromptComposer value="Hello" onChange={onChange} onSend={onSend} isGenerating onStop={onStop} />);
    await user.click(screen.getByRole('button', { name: 'Stop generating' }));
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onStop).toHaveBeenCalledOnce();
    expect(onSend).not.toHaveBeenCalled();
  });

  it('disables send for read-only and disabled fields', () => {
    const { rerender } = render(<PromptComposer defaultValue="Hello" onSend={vi.fn()} isReadOnly />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    rerender(<PromptComposer defaultValue="Hello" onSend={vi.fn()} isDisabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<PromptComposer onSend={vi.fn()} description="Shift+Enter for a newline." />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('prevents sends for explicit errors and prompt length constraints', () => {
    const onSend = vi.fn();
    const { rerender } = render(<PromptComposer value="tiny" minLength={5} onSend={onSend} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    rerender(<PromptComposer value="too long" maxLength={5} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
    rerender(<PromptComposer value="valid" isInvalid errorMessage="Not allowed" onSend={onSend} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
