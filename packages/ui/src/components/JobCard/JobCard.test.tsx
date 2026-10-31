import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { JobCard } from './JobCard';

describe('JobCard', () => {
  it('renders a linked job title and optional details', async () => {
    const { container } = render(<JobCard title="Engineer" company="Northstar" href="/jobs/engineer" location="Remote" employmentType="Full time" />);
    expect(screen.getByRole('link', { name: 'Engineer' })).toHaveAttribute('href', '/jobs/engineer');
    expect(screen.getByText('Northstar')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
