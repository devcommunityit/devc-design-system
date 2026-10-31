import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { WinnerReveal } from './WinnerReveal';

describe('WinnerReveal', () => {
  it('displays supplied winner details and hides decorative content', () => {
    render(
      <WinnerReveal
        winner={{ id: 'winner-1', name: 'Jordan Lee', entryNumber: 'A-042', detail: 'Conference pass', avatar: <span data-testid="avatar">JL</span> }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Winner' })).toBeInTheDocument();
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument();
    expect(screen.getByText('Entry A-042')).toBeInTheDocument();
    expect(screen.getByTestId('avatar').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('announces empty state accessibly', async () => {
    const { container } = render(<WinnerReveal winner={null} emptyMessage="No result yet." />);
    expect(screen.getByRole('status')).toHaveTextContent('No result yet.');
    expect(await axe(container)).toHaveNoViolations();
  });
});
