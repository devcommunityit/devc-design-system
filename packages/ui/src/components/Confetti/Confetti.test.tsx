import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Confetti } from './Confetti';

describe('Confetti', () => {
  it('renders a bounded number of decorative particles hidden from assistive technology', async () => {
    const { container } = render(<Confetti particleCount={99} data-testid="confetti" />);
    const decoration = screen.getByTestId('confetti');
    expect(decoration).toHaveAttribute('aria-hidden', 'true');
    expect(decoration.children).toHaveLength(16);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('clamps a non-positive count to one particle', () => {
    const { getByTestId } = render(<Confetti particleCount={0} data-testid="confetti" />);
    expect(getByTestId('confetti').children).toHaveLength(1);
  });
});
