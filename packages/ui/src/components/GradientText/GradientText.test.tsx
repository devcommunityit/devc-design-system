import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { GradientText } from './GradientText';

describe('GradientText', () => {
  it('renders a span with the brand tone by default and forwards ref and props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <h2>
        Impara <GradientText ref={ref} data-testid="g" id="x">e cresci</GradientText>
      </h2>,
    );
    const el = screen.getByTestId('g');
    expect(ref.current).toBe(el);
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('data-tone', 'brand');
    expect(el).toHaveAttribute('id', 'x');
    expect(el).toHaveClass('gradientText');
    expect(screen.getByRole('heading', { name: 'Impara e cresci' })).toBeInTheDocument();
  });

  it('supports semantic elements and tones', () => {
    render(
      <GradientText as="strong" tone="inverse" data-testid="g">
        forte
      </GradientText>,
    );
    const el = screen.getByTestId('g');
    expect(el.tagName).toBe('STRONG');
    expect(el).toHaveAttribute('data-tone', 'inverse');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <p>
        Testo <GradientText tone="text">evidenziato</GradientText>
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
