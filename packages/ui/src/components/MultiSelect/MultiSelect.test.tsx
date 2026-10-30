import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Form, type Key } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { MultiSelect, type MultiSelectOption } from './MultiSelect';

const options: MultiSelectOption[] = [
  { id: 'it', label: 'Italiano' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'de', label: 'Deutsch', isDisabled: true },
];

describe('MultiSelect', () => {
  it('searches, selects several options with the keyboard and removes chips', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<MultiSelect label="Languages" options={options} onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'Languages' });
    await user.type(input, 'esp');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['es']);
    expect(input).toHaveValue('');
    await user.type(input, 'ital');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['es', 'it']);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('row', { name: 'Español' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Remove Español/ }));
    expect(onChange).toHaveBeenLastCalledWith(['it']);
    await user.click(input);
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(await axe(container)).toHaveNoViolations();
  }, 15_000);

  it('remembers labels of selected async results and shows loading/empty states', async () => {
    const user = userEvent.setup();
    function Async() {
      const [query, setQuery] = useState('');
      const [value, setValue] = useState<Key[]>([]);
      const results = query ? options.filter((o) => o.label.toLowerCase().startsWith(query.toLowerCase())) : [];
      return (
        <MultiSelect
          label="Async"
          options={results}
          filter="none"
          inputValue={query}
          onInputChange={setQuery}
          value={value}
          onChange={setValue}
          isLoading={query === 'zz'}
          emptyState="Type to search"
        />
      );
    }
    render(<Async />);
    const input = screen.getByRole('combobox', { name: 'Async' });
    await user.type(input, 'eng');
    await user.keyboard('{ArrowDown}{Enter}');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('row', { name: 'English' })).toBeInTheDocument();
    await user.type(input, 'q');
    expect(await screen.findByText('Type to search')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('row', { name: 'English' })).toBeInTheDocument();
  });

  it('validates required on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <MultiSelect label="Tags" name="tags" options={options} isRequired errorMessage="Choose at least one" />
        <button type="submit">Send</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Choose at least one')).toBeInTheDocument();
  });
});