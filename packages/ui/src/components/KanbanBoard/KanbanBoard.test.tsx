import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { KanbanBoard, type KanbanColumn } from './KanbanBoard';
import { moveKanbanCard } from './moveKanbanCard';

const initialColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To do', cards: [{ id: 'brief', title: 'Write brief', description: 'Project outline', labels: ['Planning'] }] },
  { id: 'doing', title: 'In progress', cards: [{ id: 'design', title: 'Design page' }] },
  { id: 'done', title: 'Done', cards: [] },
];

describe('KanbanBoard', () => {
  it('renders labeled columns and keyboard-operable move actions accessibly', async () => {
    const { container } = render(<KanbanBoard aria-label="Project board" defaultColumns={initialColumns} />);
    expect(screen.getByRole('region', { name: 'Project board' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'To do' })).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();

    expect(screen.getByRole('button', { name: 'Drag Write brief' })).toBeInTheDocument();
  });

  it('moves cards between adjacent columns and restores focus to a move action', async () => {
    const user = userEvent.setup();
    const onColumnsChange = vi.fn();
    render(
      <KanbanBoard aria-label="Project board" defaultColumns={initialColumns} onColumnsChange={onColumnsChange} />,
    );
    screen.getByRole('button', { name: 'Move Write brief to In progress' }).focus();
    await user.keyboard('{Enter}');
    expect(onColumnsChange).toHaveBeenLastCalledWith([
      { ...initialColumns[0], cards: [] },
      { ...initialColumns[1], cards: [...initialColumns[1]!.cards, initialColumns[0]!.cards[0]!] },
      initialColumns[2],
    ]);
    expect(screen.getByRole('status')).toHaveTextContent('Write brief moved to In progress');
    const doing = screen.getByRole('region', { name: 'Project board' }).querySelectorAll('section')[1]!;
    expect(within(doing).getByRole('heading', { name: 'Write brief' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Move Write brief to Done' })).toHaveFocus());
  });

  it('supports controlled columns and custom card rendering', async () => {
    function ControlledBoard() {
      const [columns, setColumns] = useState(initialColumns);
      return (
        <KanbanBoard
          aria-label="Release plan"
          columns={columns}
          onColumnsChange={setColumns}
          renderCard={(card) => <strong>{card.title.toUpperCase()}</strong>}
        />
      );
    }

    const user = userEvent.setup();
    render(<ControlledBoard />);
    expect(screen.getByText('WRITE BRIEF')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Move Write brief to In progress' }));
    expect(screen.getAllByText('WRITE BRIEF')).toHaveLength(1);
  });

  it('changes status directly to a non-adjacent empty column', async () => {
    const onColumnsChange = vi.fn();
    render(<KanbanBoard aria-label="Workflow" defaultColumns={initialColumns} showStatusSelect onColumnsChange={onColumnsChange} />);
    await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: 'Status Write brief' }), 'done');
    expect(onColumnsChange.mock.lastCall?.[0][2].cards[0].id).toBe('brief');
    expect(screen.getByRole('combobox', { name: 'Status Write brief' })).toHaveValue('done');
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Status Write brief' })).toHaveFocus());
  });

  it('reorders with explicit controls and keeps focus on an enabled action', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard aria-label="Order" defaultColumns={[{ id: 'todo', title: 'Todo', cards: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] }]} />);
    await user.click(screen.getByRole('button', { name: 'Move A down' }));
    const rows = screen.getAllByRole('row');
    expect(rows.map((row) => row.getAttribute('aria-label'))).toEqual(['B', 'A']);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Move A up' })).toHaveFocus());
  });
  it('reorders cards without mutating data or losing custom properties', () => {
    const columns = [{ id: 'todo', title: 'Todo', cards: [{ id: 'a', title: 'A', owner: 'Sara' }, { id: 'b', title: 'B', owner: 'Luca' }, { id: 'c', title: 'C', owner: 'Anna' }] }];
    const down = moveKanbanCard(columns, 'a', 'todo', 'todo', 3);
    expect(down[0]?.cards.map((card) => card.id)).toEqual(['b', 'c', 'a']);
    expect(down[0]?.cards[2]?.owner).toBe('Sara');
    expect(columns[0]?.cards.map((card) => card.id)).toEqual(['a', 'b', 'c']);
    expect(moveKanbanCard(down, 'a', 'todo', 'todo', 0)[0]?.cards.map((card) => card.id)).toEqual(['a', 'b', 'c']);
    expect(moveKanbanCard(columns, 'a', 'todo', 'todo', 1)).toBe(columns);
    expect(moveKanbanCard(columns, 'missing', 'todo', 'todo', 0)).toBe(columns);
  });

  it('reports the actual moved card and its previous and new positions', async () => {
    const onCardMove = vi.fn();
    const columns = [{ id: 'todo', title: 'Todo', cards: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] }, { id: 'done', title: 'Done', cards: [] }];
    render(<KanbanBoard aria-label="Workflow" defaultColumns={columns} onCardMove={onCardMove} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Move A to Done' }));
    expect(onCardMove).toHaveBeenCalledWith({ card: columns[0]!.cards[0], sourceColumnId: 'todo', targetColumnId: 'done', sourceIndex: 0, targetIndex: 0 });
  });

  it('localizes board controls and announcements', async () => {
    render(<LocaleProvider locale="it-IT"><KanbanBoard aria-label="Bacheca" defaultColumns={initialColumns} showStatusSelect /></LocaleProvider>);
    expect(screen.getByRole('button', { name: 'Trascina Write brief' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Stato Write brief' })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Sposta Write brief in In progress' }));
    expect(screen.getByRole('status')).toHaveTextContent('Write brief spostata in In progress');
  });
});
