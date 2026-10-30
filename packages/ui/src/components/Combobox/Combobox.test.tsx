import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ListBoxItem } from '../ListBox/ListBox';
import { Combobox } from './Combobox';

const cities = [
  { id: 'mi', name: 'Milano' },
  { id: 'mo', name: 'Modena' },
  { id: 'rm', name: 'Roma' },
];

describe('Combobox', () => {
  it('filters defaultItems locally, navigates with arrows and selects with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <Combobox label="City" defaultItems={cities} onChange={onChange}>
        {(c) => <ListBoxItem id={c.id}>{c.name}</ListBoxItem>}
      </Combobox>,
    );
    const input = screen.getByRole('combobox', { name: 'City' });
    await user.type(input, 'mo');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('mo');
    expect(input).toHaveValue('Modena');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the empty state and a loading state for consumer-driven results', async () => {
    const user = userEvent.setup();
    function Async() {
      const [query, setQuery] = useState('');
      const results = cities.filter((c) => c.name.toLowerCase().startsWith(query.toLowerCase()));
      return (
        <Combobox label="Async" items={results} inputValue={query} onInputChange={setQuery} isLoading={query === 'zz'} emptyState="Nothing found">
          {(c) => <ListBoxItem id={c.id}>{c.name}</ListBoxItem>}
        </Combobox>
      );
    }
    render(<Async />);
    const input = screen.getByRole('combobox', { name: 'Async' });
    await user.type(input, 'x');
    expect(await screen.findByText('Nothing found')).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, 'zz');
    expect(screen.getAllByText('Loading…').length).toBeGreaterThan(0);
  });
});