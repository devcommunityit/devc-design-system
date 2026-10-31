import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { VenueCard } from './VenueCard';

describe('VenueCard', () => {
  it('shows the address, accessibility details and map link', () => {
    render(<VenueCard name="Hall" address="10 Main Street" accessibility="Step-free entry" mapHref="https://maps.example.test" />);
    expect(screen.getByRole('article', { name: 'Hall' })).toBeInTheDocument();
    expect(screen.getByText('10 Main Street').closest('address')).toBeInTheDocument();
    expect(screen.getByText('Step-free entry')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open map directions/ })).toHaveAttribute('target', '_blank');
  });

  it('has no axe violations', async () => {
    const { container } = render(<VenueCard name="Hall" address="10 Main Street" mapHref="https://maps.example.test" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
