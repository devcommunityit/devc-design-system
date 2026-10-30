import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { SortableList } from './SortableList';

interface Step {
  id: string;
  name: string;
}

const steps: Step[] = [
  { id: 'a', name: 'Draft' },
  { id: 'b', name: 'Review' },
  { id: 'c', name: 'Publish' },
];

const order = () => screen.getAllByRole('row').map((row) => row.textContent?.replace(/\s+/g, ''));

describe('SortableList', () => {
  it('renders a grid with a drag handle and move buttons per row', async () => {
    const { container } = render(<SortableList aria-label="Workflow" defaultItems={steps} getLabel={(s) => s.name} />);
    const grid = screen.getByRole('grid', { name: 'Workflow' });
    const rows = within(grid).getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(within(rows[0]!).getByRole('button', { name: 'Move Draft up' })).toBeDisabled();
    expect(within(rows[2]!).getByRole('button', { name: 'Move Publish down' })).toBeDisabled();
    expect(within(rows[1]!).getAllByRole('button').length).toBeGreaterThanOrEqual(3);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('moves items with the buttons, announces the move and keeps focus in the row', async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(<SortableList aria-label="Workflow" defaultItems={steps} getLabel={(s) => s.name} onReorder={onReorder} />);
    await user.click(screen.getByRole('button', { name: 'Move Publish up' }));
    expect(onReorder).toHaveBeenLastCalledWith([steps[0], steps[2], steps[1]]);
    expect(screen.getByRole('status')).toHaveTextContent('Publish moved to position 2 of 3');
    await user.click(screen.getByRole('button', { name: 'Move Publish up' }));
    expect(onReorder).toHaveBeenLastCalledWith([steps[2], steps[0], steps[1]]);
    expect(screen.getByRole('button', { name: 'Move Publish up' })).toBeDisabled();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Move Publish down' })).toHaveFocus());
  });

  it('is controllable and localized', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [items, setItems] = useState(steps);
      return <SortableList aria-label="Fasi" items={items} onReorder={setItems} getLabel={(s) => s.name} />;
    }
    render(
      <LocaleProvider locale="it-IT">
        <Controlled />
      </LocaleProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Sposta Draft in giù' }));
    expect(screen.getByRole('status')).toHaveTextContent('Draft spostato in posizione 2 di 3');
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Draft');
  });

  it('can disable reordering and render custom content and empty state', () => {
    const { unmount } = render(
      <SortableList aria-label="Steps" defaultItems={steps} getLabel={(s) => s.name} isDisabled>
        {(s) => <strong>{s.name.toUpperCase()}</strong>}
      </SortableList>,
    );
    expect(order()).toEqual(['DRAFT', 'REVIEW', 'PUBLISH']);
    expect(screen.queryByRole('button')).toBeNull();
    unmount();
    render(<SortableList aria-label="Steps" items={[]} getLabel={(s: Step) => s.name} emptyState="Nothing to sort" />);
    expect(screen.getByRole('grid')).toHaveTextContent('Nothing to sort');
  });
});
