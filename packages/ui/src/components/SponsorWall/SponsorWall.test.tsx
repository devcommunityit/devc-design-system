import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { SponsorWall } from './SponsorWall';

describe('SponsorWall', () => {
  it('renders sponsor names, optional links and tiers accessibly', async () => {
    const { container } = render(
      <SponsorWall aria-label="Sponsors" sponsors={[
        { id: 'one', name: 'Northstar', logo: 'N', tier: 'Gold', href: '/northstar' },
        { id: 'two', name: 'Orbit', logo: 'O' },
      ]} />,
    );
    expect(screen.getByRole('link', { name: 'Northstar' })).toHaveAttribute('href', '/northstar');
    expect(screen.getByText('Orbit')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
