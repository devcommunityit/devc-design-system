import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { QuickAction } from './QuickAction';

describe('QuickAction', () => {
  it('renders a native link with href, forwards ref and DOM props', () => {
    const ref = createRef<HTMLAnchorElement | HTMLButtonElement>();
    render(<QuickAction ref={ref} href="#users" icon={<svg data-testid="icon" />} label="Utenti" description="Gestisci accessi" data-testid="qa" id="qa-users" />);
    const link = screen.getByRole('link', { name: /Utenti.*Gestisci accessi/ });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#users');
    expect(link).toHaveAttribute('id', 'qa-users');
    expect(link).toHaveAttribute('data-layout', 'vertical');
    expect(ref.current).toBe(link);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a native button that calls onPress from mouse and keyboard, not when disabled', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const { rerender } = render(<QuickAction icon={<svg />} label="Esporta CSV" layout="horizontal" onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Esporta CSV' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('data-layout', 'horizontal');
    await user.click(button);
    button.focus();
    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(2);
    rerender(<QuickAction icon={<svg />} label="Esporta CSV" onPress={onPress} isDisabled />);
    await user.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('includes the badge in the tile', () => {
    render(<QuickAction href="#t" icon={<svg />} label="Ticket" badge={<span>3 nuovi</span>} />);
    expect(screen.getByRole('link', { name: /Ticket.*3 nuovi/ })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ul>
        <li>
          <QuickAction href="#a" icon={<svg />} label="Nuovo utente" description="Invita via email" />
        </li>
        <li>
          <QuickAction onPress={() => {}} icon={<svg />} label="Backup" isDisabled />
        </li>
      </ul>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
