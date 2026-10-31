import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('updates controlled filters and emits saved view values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSaveView = vi.fn();
    render(
      <FilterBar
        aria-label="Article filters"
        filters={[{ id: 'status', label: 'Status', value: 'all', options: [{ value: 'all', label: 'All' }, { value: 'draft', label: 'Drafts' }], onChange }]}
        onSaveView={onSaveView}
        saveViewLabel="Save view"
      />,
    );
    await user.selectOptions(screen.getByLabelText('Status'), 'draft');
    expect(onChange).toHaveBeenCalledWith('draft');
    await user.click(screen.getByRole('button', { name: 'Save view' }));
    expect(onSaveView).toHaveBeenCalledWith({ status: 'all' });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FilterBar filters={[{ id: 'type', label: 'Type', value: '', options: [{ value: '', label: 'Any' }], onChange: () => {} }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
