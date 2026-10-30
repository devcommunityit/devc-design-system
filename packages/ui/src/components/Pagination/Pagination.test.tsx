import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { getPaginationItems, Pagination } from './Pagination';

describe('getPaginationItems', () => {
  it('returns every page when they fit', () => {
    expect(getPaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  it('adds ellipses around the current window', () => {
    expect(getPaginationItems(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
    expect(getPaginationItems(1, 20)).toEqual([1, 2, 'ellipsis-end', 20]);
    expect(getPaginationItems(4, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPaginationItems(20, 20)).toEqual([1, 'ellipsis-start', 19, 20]);
  });
  it('handles empty and out-of-range input', () => {
    expect(getPaginationItems(1, 0)).toEqual([]);
    expect(getPaginationItems(99, 3)).toEqual([1, 2, 3]);
  });
});

describe('Pagination', () => {
  it('uncontrolled: moves between pages and marks the current one', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { container } = render(<Pagination totalPages={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Page 10' }));
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('controlled with first/last buttons', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = useState(5);
      return (
        <>
          <Pagination totalPages={9} page={page} onPageChange={setPage} showFirstLast />
          <output>page {page}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(screen.getByText('page 9')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(screen.getByText('page 1')).toBeInTheDocument();
  });

  it('renders links when getPageHref is provided', () => {
    render(<Pagination totalPages={3} defaultPage={2} getPageHref={(p) => `?page=${p}`} />);
    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '?page=3');
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });
});