import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { EntryList } from './EntryList';

describe('EntryList', () => {
  it('renders entries in order and identifies a supplied winner with text', () => {
    render(
      <EntryList
        label="Draw entries"
        entries={[
          { id: 'one', name: 'Jordan Lee', entryNumber: 'A-042', isWinner: true },
          { id: 'two', name: 'Morgan Patel', entryNumber: 'A-043' },
        ]}
      />,
    );
    expect(screen.getByRole('list', { name: 'Draw entries' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.getByText('#A-042')).toBeInTheDocument();
  });

  it('renders the empty state without axe violations', async () => {
    const { container } = render(<EntryList entries={[]} emptyMessage="Entries are not open." />);
    expect(screen.getByRole('listitem')).toHaveTextContent('Entries are not open.');
    expect(await axe(container)).toHaveNoViolations();
  });
});
