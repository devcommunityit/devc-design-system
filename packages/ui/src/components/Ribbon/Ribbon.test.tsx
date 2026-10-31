import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Ribbon } from './Ribbon';

describe('Ribbon', () => {
  it('wraps the content and renders the label as readable text before it', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Ribbon ref={ref} label="Beta" data-testid="r" title="Ribbon">
        <article>Mentorship</article>
      </Ribbon>,
    );
    const root = screen.getByTestId('r');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('title', 'Ribbon');
    expect(root).toHaveAttribute('data-variant', 'corner');
    expect(root).toHaveAttribute('data-position', 'top-end');
    expect(root).toHaveAttribute('data-tone', 'brand');
    expect(root).toHaveTextContent(/^BetaMentorship$/);
    const label = screen.getByText('Beta');
    expect(label.closest('[aria-hidden="true"]')).toBeNull();
  });

  it('defaults the banner variant to top-start and honours explicit props', () => {
    const { rerender } = render(
      <Ribbon label="Nuovo" variant="banner" data-testid="r">
        <div />
      </Ribbon>,
    );
    expect(screen.getByTestId('r')).toHaveAttribute('data-position', 'top-start');
    rerender(
      <Ribbon label="-20%" variant="bookmark" position="top-start" tone="danger" data-testid="r">
        <div />
      </Ribbon>,
    );
    const root = screen.getByTestId('r');
    expect(root).toHaveAttribute('data-variant', 'bookmark');
    expect(root).toHaveAttribute('data-position', 'top-start');
    expect(root).toHaveAttribute('data-tone', 'danger');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Ribbon label="Sold out" tone="neutral">
          <a href="#evento">Workshop di ottobre</a>
        </Ribbon>
        <Ribbon label="Top contributor" variant="banner" tone="warning">
          <p>Giulia Bianchi</p>
        </Ribbon>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
