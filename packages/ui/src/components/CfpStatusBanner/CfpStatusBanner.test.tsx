import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { CfpStatusBanner } from './CfpStatusBanner';

describe('CfpStatusBanner', () => {
  it('communicates state, deadline and supplied action', () => {
    render(<CfpStatusBanner status="open" title="Call for talks" deadline="2026-09-30" action={<a href="/submit">Submit</a>} />);
    expect(screen.getByRole('complementary', { name: 'Call for talks' })).toHaveAttribute('data-status', 'open');
    expect(screen.getByText('Call for proposals open')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Submit' })).toHaveAttribute('href', '/submit');
  });

  it('has no axe violations', async () => {
    const { container } = render(<CfpStatusBanner status="closed" title="Call closed" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
