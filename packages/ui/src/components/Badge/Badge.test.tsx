import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text, data attributes, ref and DOM props', async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <Badge ref={ref} tone="success" variant="solid" size="sm" dot data-testid="b" title="Stato">
        Attivo
      </Badge>,
    );
    const el = screen.getByTestId('b');
    expect(ref.current).toBe(el);
    expect(el).toHaveTextContent('Attivo');
    expect(el).toHaveAttribute('data-tone', 'success');
    expect(el).toHaveAttribute('data-variant', 'solid');
    expect(el).toHaveAttribute('data-size', 'sm');
    expect(el).toHaveAttribute('title', 'Stato');
    expect(el.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses neutral soft defaults', () => {
    render(<Badge data-testid="b">3</Badge>);
    const el = screen.getByTestId('b');
    expect(el).toHaveAttribute('data-tone', 'neutral');
    expect(el).toHaveAttribute('data-variant', 'soft');
  });
});