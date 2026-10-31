import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { SessionCard } from './SessionCard';

describe('SessionCard', () => {
  it('renders session details and a title link', () => {
    render(<SessionCard title="Accessible design" href="/talk" startTime="09:30" endTime="10:00" speakers="Jordan" action={<button type="button">Save</button>} />);
    expect(screen.getByRole('link', { name: 'Accessible design' })).toHaveAttribute('href', '/talk');
    expect(screen.getByText('Jordan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SessionCard title="Accessible design" startTime="09:30" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
