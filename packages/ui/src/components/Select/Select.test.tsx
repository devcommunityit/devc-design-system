import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Form, type Key } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { ListBoxItem } from '../ListBox/ListBox';
import { Select } from './Select';

const roles = [
  { id: 'admin', name: 'Administrator' },
  { id: 'editor', name: 'Editor' },
  { id: 'viewer', name: 'Viewer' },
];

describe('Select', () => {
  it('opens with the keyboard, selects and restores focus (uncontrolled)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ThemeProvider>
        <Select label="Role" items={roles} placeholder="Choose a role" name="role">
          {(r) => <ListBoxItem id={r.id}>{r.name}</ListBoxItem>}
        </Select>
      </ThemeProvider>,
    );
    const trigger = screen.getByRole('button', { name: /Role/ });
    expect(trigger).toHaveTextContent('Choose a role');
    await user.tab();
    await user.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');
    expect(listbox.closest('[data-dc-portal]')).not.toBeNull();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Editor');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(await axe(container)).toHaveNoViolations();
  });

  it('works controlled and validates required on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    function Controlled() {
      const [value, setValue] = useState<Key | null>(null);
      return (
        <Form onSubmit={onSubmit}>
          <Select label="Role" items={roles} value={value} onChange={setValue} isRequired errorMessage="Pick a role">
            {(r) => <ListBoxItem id={r.id}>{r.name}</ListBoxItem>}
          </Select>
          <output>{String(value)}</output>
          <button type="submit">Save</button>
        </Form>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Pick a role')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Role/ }));
    await user.click(await screen.findByRole('option', { name: 'Viewer' }));
    expect(screen.getByRole('status')).toHaveTextContent('viewer');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});