import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ChatMessage } from './ChatMessage';

describe('ChatMessage', () => {
  it('forwards article props/ref and renders untrusted text as text', () => {
    const ref = createRef<HTMLElement>();
    render(<ChatMessage ref={ref} id="answer" speaker="assistant" footer="Sources available">{'<script>alert(1)</script>'}</ChatMessage>);
    expect(ref.current).toBe(screen.getByRole('article', { name: 'Assistant' }));
    expect(ref.current).toHaveAttribute('id', 'answer');
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
    expect(ref.current?.querySelector('script')).toBeNull();
    expect(screen.getByText('Sources available')).toBeInTheDocument();
  });

  it('marks streamed content busy without announcing every token and exposes errors', () => {
    const { rerender } = render(<ChatMessage status="streaming">Partial answer</ChatMessage>);
    expect(screen.getByText('Partial answer')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Generating response');
    rerender(<ChatMessage status="error" statusText="Connection lost">Partial answer</ChatMessage>);
    expect(screen.getByRole('alert')).toHaveTextContent('Connection lost');
    expect(screen.getByText('Partial answer')).toHaveAttribute('aria-busy', 'false');
  });

  it('localizes speaker and status', () => {
    render(<LocaleProvider locale="it-IT"><ChatMessage speaker="user">Ciao</ChatMessage></LocaleProvider>);
    expect(screen.getByRole('article', { name: 'Tu' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ChatMessage author="Support assistant">A complete response.</ChatMessage>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
