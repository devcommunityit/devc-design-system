import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { ReviewScorecard } from './ReviewScorecard';

const criteria = [{ id: 'clarity', label: 'Clarity', score: 4, maxScore: 5, comment: 'Easy to follow.' }];

describe('ReviewScorecard', () => {
  it('renders score criteria, accessible meter and recommendation', () => {
    render(<ReviewScorecard title="Review" criteria={criteria} recommendation="Accept" />);
    expect(screen.getByRole('meter', { name: 'Clarity score' })).toHaveAttribute('value', '4');
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Easy to follow.')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ReviewScorecard title="Review" criteria={criteria} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
