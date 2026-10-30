import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('submits on Enter and clears with the button and Escape', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClear = vi.fn();
    const { container } = render(<SearchInput aria-label="Search orders" onSubmit={onSubmit} onClear={onClear} />);
    const input = screen.getByRole('searchbox', { name: 'Search orders' });
    await user.type(input, 'rossi{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('rossi');
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
    await user.type(input, 'abc{Escape}');
    expect(input).toHaveValue('');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('announces a pending state', () => {
    render(<SearchInput aria-label="Search" isPending />);
    expect(screen.getByRole('status')).toHaveTextContent(/Loading/);
  });
});