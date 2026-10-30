import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders a span with ref, class and DOM props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <VisuallyHidden ref={ref} className="extra" data-testid="vh" id="hint">
        3 notifiche non lette
      </VisuallyHidden>,
    );
    const el = screen.getByTestId('vh');
    expect(ref.current).toBe(el);
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'hint');
    expect(el).not.toHaveAttribute('data-focusable');
  });

  it('contributes to the accessible name of its parent', async () => {
    const { container } = render(
      <button type="button">
        Rimuovi<VisuallyHidden> contratto.pdf</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName(/Rimuovi\s*contratto\.pdf/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('marks focusable content and lets it receive focus', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VisuallyHidden isFocusable data-testid="skip">
        <a href="#contenuto">Vai al contenuto</a>
      </VisuallyHidden>,
    );
    expect(screen.getByTestId('skip')).toHaveAttribute('data-focusable', 'true');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Vai al contenuto' })).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });
});
