import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { Button } from './Button';
import { LinkButton } from './LinkButton';

describe('Button', () => {
  it('renders a native button with variant/size data attributes and forwards ref and DOM props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} variant="outline" size="sm" data-testid="b" id="save" aria-describedby="hint">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).toHaveAttribute('id', 'save');
    expect(button).toHaveAttribute('aria-describedby', 'hint');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onPress from mouse and keyboard and not when disabled', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const { rerender } = render(<Button onPress={onPress}>Go</Button>);
    await user.click(screen.getByRole('button'));
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(3);
    rerender(
      <Button onPress={onPress} isDisabled>
        Go
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('keeps focus and blocks presses while pending', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} isPending>
        Send
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-pending', 'true');
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).not.toBeDisabled();
  });

  it('submits forms with type="submit"', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Submit</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders LinkButton as a real link', () => {
    render(<LinkButton href="/docs">Docs</LinkButton>);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Button>Primary</Button>
        <Button variant="ghost" isDisabled>
          Disabled
        </Button>
        <LinkButton href="#x">Link</LinkButton>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
