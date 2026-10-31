import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { MemberDirectory } from './MemberDirectory';

describe('MemberDirectory', () => {
  it('filters members and reports controlled query changes', async () => {
    const onQueryChange = vi.fn();
    const { container } = render(
      <MemberDirectory
        aria-label="Members"
        searchLabel="Search members"
        query="ada"
        onQueryChange={onQueryChange}
        members={[
          { id: 'ada', name: 'Ada Lovelace' },
          { id: 'grace', name: 'Grace Hopper' },
        ]}
      />,
    );
    expect(screen.getByRole('article', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Grace Hopper' })).not.toBeInTheDocument();
    await userEvent.setup().clear(screen.getByRole('searchbox', { name: 'Search members' }));
    expect(onQueryChange).toHaveBeenCalledWith('');
    expect(await axe(container)).toHaveNoViolations();
  });
});
