import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { DataTable } from './DataTable';
import { compareValues, searchRows, sortRows, type DataTableColumn, type SortState } from './dataTableEngine';

interface Person {
  id: number;
  name: string;
  city: string;
  age: number | null;
}

const people: Person[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Persona ${String(i + 1).padStart(2, '0')}`,
  city: i % 3 === 0 ? 'Città di Castello' : i % 3 === 1 ? 'Milano' : 'Roma',
  age: i === 4 ? null : 20 + ((i * 7) % 40),
}));

const columns: DataTableColumn<Person>[] = [
  { id: 'name', header: 'Nome', accessor: (p) => p.name, sortable: true, isRowHeader: true },
  { id: 'city', header: 'Città', accessor: (p) => p.city, sortable: true },
  { id: 'age', header: 'Età', accessor: (p) => p.age, sortable: true, align: 'end' },
];

function bodyRows() {
  return screen.getAllByRole('row').slice(1);
}

describe('dataTableEngine', () => {
  it('compares numbers, dates and strings and puts empty values last', () => {
    const collator = new Intl.Collator('it', { numeric: true });
    expect(compareValues(2, 10, collator)).toBeLessThan(0);
    expect(compareValues('item 2', 'item 10', collator)).toBeLessThan(0);
    expect(compareValues(new Date(2024, 0, 2), new Date(2024, 0, 1), collator)).toBeGreaterThan(0);
    expect(compareValues(null, 1, collator)).toBeGreaterThan(0);
  });

  it('sorts stably and ignores unknown columns', () => {
    const sorted = sortRows(people, columns, { column: 'city', direction: 'ascending' }, 'it');
    expect(sorted[0]?.city).toBe('Città di Castello');
    expect(sorted.filter((p) => p.city === 'Milano').map((p) => p.id)).toEqual(people.filter((p) => p.city === 'Milano').map((p) => p.id));
    expect(sortRows(people, columns, { column: 'missing', direction: 'ascending' })).toEqual(people);
  });

  it('searches accent- and case-insensitively', () => {
    expect(searchRows(people, columns, 'citta', 'it')).toHaveLength(8);
    expect(searchRows(people, columns, '   ', 'it')).toHaveLength(23);
  });

  it('keeps empty values last in descending order', () => {
    const sorted = sortRows(people, columns, { column: 'age', direction: 'descending' }, 'it');
    expect(sorted.at(-1)?.age).toBeNull();
  });
});

describe('DataTable (local mode)', () => {
  it('paginates, sorts via header and exposes aria-sort', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Persone" columns={columns} rows={people} getRowId={(p) => p.id} />);
    expect(screen.getByRole('grid', { name: 'Persone' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('1–10 of 23')).toBeInTheDocument();

    const ageHeader = screen.getByRole('columnheader', { name: /Età/ });
    await user.click(ageHeader);
    expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(within(bodyRows()[0]!).getByText('20')).toBeInTheDocument();
    await user.click(ageHeader);
    expect(ageHeader).toHaveAttribute('aria-sort', 'descending');

    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByText('21–23 of 23')).toBeInTheDocument();
    // Missing values are rendered as a dash and stay last in both directions.
    expect(within(bodyRows()[2]!).getByText('—')).toBeInTheDocument();
  });

  it('filters with search, resets the page and shows a no-results state that can be cleared', async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="Persone" columns={columns} rows={people} getRowId={(p) => p.id} searchable defaultPage={3} />);
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'milano');
    expect(screen.getByText('1–8 of 8')).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(bodyRows()).toHaveLength(10);
  });

  it('selects rows across pages; select-all affects the visible page only', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        aria-label="Persone"
        columns={columns}
        rows={people}
        getRowId={(p) => p.id}
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
        renderBulkActions={(ids) => <span>Bulk: {ids.join(',')}</span>}
      />,
    );
    await user.click(screen.getAllByRole('checkbox', { name: /Select row/ })[0]!);
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set([1]));
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
    const last = onSelectionChange.mock.lastCall?.[0] as ReadonlySet<number>;
    expect(last.size).toBe(11);
    expect(screen.getByText('11 selected')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set([1]));
  });

  it('distinguishes empty, loading and error states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<DataTable aria-label="Persone" columns={columns} rows={[]} getRowId={(p) => p.id} />);
    expect(screen.getByText('No data yet')).toBeInTheDocument();
    rerender(<DataTable aria-label="Persone" columns={columns} rows={[]} getRowId={(p) => p.id} isLoading />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    expect(screen.getByRole('grid').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
    rerender(<DataTable aria-label="Persone" columns={columns} rows={people} getRowId={(p) => p.id} error="Timeout del server" onRetry={onRetry} />);
    expect(screen.getByText('Timeout del server')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('uses localized system strings and has no axe violations', async () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <DataTable aria-label="Persone" columns={columns} rows={people} getRowId={(p) => p.id} selectionMode="multiple" searchable />
      </LocaleProvider>,
    );
    expect(screen.getByRole('searchbox', { name: 'Cerca' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Seleziona tutto' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DataTable (server mode)', () => {
  it('reports sort/page changes and renders the given page without re-sorting', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    function Server() {
      const [sort, setSort] = useState<SortState | null>(null);
      const [page, setPage] = useState(1);
      const pageRows = people.slice((page - 1) * 5, page * 5);
      return (
        <DataTable
          aria-label="Server"
          mode="server"
          columns={columns}
          rows={pageRows}
          totalRows={people.length}
          getRowId={(p) => p.id}
          sort={sort}
          onSortChange={(s) => {
            calls.push(`sort:${s?.column}:${s?.direction}`);
            setSort(s);
          }}
          page={page}
          onPageChange={(p) => {
            calls.push(`page:${p}`);
            setPage(p);
          }}
          pageSize={5}
          pageSizeOptions={[5]}
        />
      );
    }
    render(<Server />);
    expect(screen.getByText('1–5 of 23')).toBeInTheDocument();
    await user.click(screen.getByRole('columnheader', { name: /Nome/ }));
    await user.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(calls).toEqual(['sort:name:ascending', 'page:5']);
    expect(bodyRows()).toHaveLength(3);
    expect(within(bodyRows()[0]!).getByText('Persona 21')).toBeInTheDocument();
  });
});