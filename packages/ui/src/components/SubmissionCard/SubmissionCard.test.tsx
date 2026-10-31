import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { SubmissionCard } from './SubmissionCard';

describe('SubmissionCard', () => {
  it('renders submission status, author and consumer action', () => {
    render(<SubmissionCard title="Inclusive events" summary="A talk" submitter="Morgan" status="Under review" action={<button type="button">Open</button>} />);
    expect(screen.getByRole('article', { name: 'Inclusive events' })).toBeInTheDocument();
    expect(screen.getByText('Under review')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SubmissionCard title="Inclusive events" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
