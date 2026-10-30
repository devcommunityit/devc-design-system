import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { PromoBanner } from './PromoBanner';

describe('PromoBanner', () => {
  it('renders the whole surface as one link and forwards ref and DOM props to the wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PromoBanner
        ref={ref}
        data-testid="promo"
        tone="accent"
        href="#upgrade"
        linkProps={{ target: '_blank', rel: 'noreferrer' }}
        icon={<svg data-testid="icon" />}
        title="Passa al piano Pro"
        description="Report illimitati e SSO"
      />,
    );
    const link = screen.getByRole('link', { name: /Passa al piano Pro.*Report illimitati e SSO/ });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#upgrade');
    expect(link).toHaveAttribute('target', '_blank');
    expect(ref.current).toBe(screen.getByTestId('promo'));
    expect(ref.current).toHaveAttribute('data-tone', 'accent');
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('renders a native button and calls onPress from mouse and keyboard', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<PromoBanner onPress={onPress} title="Prova le nuove dashboard" />);
    const button = screen.getByRole('button', { name: 'Prova le nuove dashboard' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('renders the dismiss button as a sibling of the interactive surface', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onPress = vi.fn();
    render(<PromoBanner onPress={onPress} onDismiss={onDismiss} title="Novità" tone="neutral" />);
    const surface = screen.getByRole('button', { name: 'Novità' });
    const dismiss = screen.getByRole('button', { name: 'Dismiss' });
    expect(surface.contains(dismiss)).toBe(false);
    expect(dismiss.parentElement).toBe(surface.parentElement);
    expect(dismiss.parentElement).toHaveAttribute('data-dismissible', 'true');
    await user.click(dismiss);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('localizes the dismiss label and accepts a custom one', () => {
    const { rerender } = render(
      <LocaleProvider locale="it-IT">
        <PromoBanner href="#x" onDismiss={() => {}} title="Webinar" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Ignora' })).toBeInTheDocument();
    rerender(
      <LocaleProvider locale="it-IT">
        <PromoBanner href="#x" onDismiss={() => {}} dismissLabel="Nascondi promozione" title="Webinar" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Nascondi promozione' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <PromoBanner href="#a" title="Link" description="Descrizione" onDismiss={() => {}} />
        <PromoBanner onPress={() => {}} tone="success" title="Button" />
        <PromoBanner href="#b" tone="warning" title="Warning" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
