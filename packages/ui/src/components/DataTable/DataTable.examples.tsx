import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  DataTable,
  NativeSelect,
  Stack,
  Switch,
  Text,
  searchRows,
  sortRows,
  type DataTableColumn,
  type SortState,
} from '@devcommunityit/ui';

type Status = 'attivo' | 'sospeso' | 'invitato';
interface Customer {
  id: string;
  name: string;
  city: string;
  status: Status;
  revenue: number;
  lastOrder: Date | null;
}

const cities = ['Bologna', 'Milano', 'Torino', 'Napoli', 'Roma', 'Firenze', 'Bari'];
const names = ['Acme', 'Bottega Rossi', 'Studio Verdi', 'Officine Neri', 'Gallo & Figli', 'Riva Logistica', 'Fontana Design', 'Conti Alimentari', 'Moretti Tech', 'Esposito Casa', 'Ferri Energia', 'Lombardi Viaggi'];
const statuses: Status[] = ['attivo', 'attivo', 'sospeso', 'attivo', 'invitato'];
const statusValues: Status[] = ['attivo', 'sospeso', 'invitato'];

/** Deterministic sample data: same output on every render and in tests. */
export const customers: Customer[] = Array.from({ length: 57 }, (_, i) => ({
  id: `C-${String(1001 + i)}`,
  name: `${names[i % names.length]}${i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''}`,
  city: cities[(i * 3) % cities.length] ?? 'Bologna',
  status: statuses[i % statuses.length] ?? 'attivo',
  revenue: 1500 + ((i * 7919) % 48000),
  lastOrder: i % 9 === 4 ? null : new Date(2025, (i * 5) % 12, 1 + ((i * 11) % 27)),
}));

const statusTone = { attivo: 'success', sospeso: 'danger', invitato: 'info' } as const;
const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const columns: DataTableColumn<Customer>[] = [
  { id: 'name', header: 'Cliente', accessor: (c) => c.name, sortable: true, isRowHeader: true, minWidth: '12rem' },
  { id: 'city', header: 'Città', accessor: (c) => c.city, sortable: true },
  { id: 'status', header: 'Stato', accessor: (c) => c.status, sortable: true, cell: (c) => <Badge tone={statusTone[c.status]}>{c.status}</Badge> },
  { id: 'revenue', header: 'Fatturato', accessor: (c) => c.revenue, sortable: true, align: 'end', cell: (c) => euro.format(c.revenue) },
  { id: 'lastOrder', header: 'Ultimo ordine', accessor: (c) => c.lastOrder, sortable: true, searchable: false },
];

export function Basic() {
  return <DataTable aria-label="Clienti" columns={columns} rows={customers} getRowId={(c) => c.id} defaultSort={{ column: 'name', direction: 'ascending' }} />;
}

export function LocalFilters() {
  const [rows, setRows] = useState(customers);
  const [status, setStatus] = useState<'' | Status>('');
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [opened, setOpened] = useState<Customer | null>(null);
  return (
    <Stack gap={3}>
      <DataTable
        aria-label="Clienti filtrabili"
        columns={columns}
        rows={rows}
        getRowId={(c) => c.id}
        searchable
        searchLabel="Cerca clienti"
        filter={status ? (c) => c.status === status : undefined}
        isFiltered={status !== ''}
        onClearFilters={() => setStatus('')}
        toolbar={
          <NativeSelect
            label="Stato"
            value={status}
            onChange={(e) => setStatus(statusValues.find((s) => s === e.target.value) ?? '')}
            options={[{ value: '', label: 'Tutti' }, ...statusValues.map((s) => ({ value: s, label: s }))]}
          />
        }
        selectionMode="multiple"
        selectedIds={selected}
        onSelectionChange={setSelected}
        renderBulkActions={(ids) => (
          <Button
            size="sm"
            variant="danger"
            onPress={() => {
              setRows((current) => current.filter((c) => !ids.includes(c.id)));
              setSelected(new Set());
            }}
          >
            Rimuovi dalla lista ({ids.length})
          </Button>
        )}
        onRowAction={setOpened}
      />
      <Text variant="body-sm" tone="secondary" role="status">
        {opened ? `Aperto: ${opened.name} (${opened.id})` : 'Premi Invio su una riga, o fai clic, per aprire il dettaglio.'}
        {rows.length < customers.length ? ` · ${customers.length - rows.length} righe rimosse localmente.` : ''}
      </Text>
      {rows.length < customers.length ? (
        <Button variant="ghost" size="sm" onPress={() => setRows(customers)}>
          Ripristina dati di esempio
        </Button>
      ) : null}
    </Stack>
  );
}

interface Query {
  sort: SortState | null;
  search: string;
  page: number;
  pageSize: number;
  attempt: number;
}
interface Result {
  key: string;
  rows: Customer[];
  total: number;
  error: string | null;
}

/**
 * Simulated server: filters, sorts and pages the local dataset after a fake latency.
 * Replace `fakeFetch` with your API call; the table only reports state changes.
 */
function fakeFetch(query: Query, failing: boolean): Promise<Omit<Result, 'key'>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (failing) {
        resolve({ rows: [], total: 0, error: 'Il server ha risposto 503 (simulazione).' });
        return;
      }
      const filtered = sortRows(searchRows(customers, columns, query.search, 'it'), columns, query.sort, 'it');
      const start = (query.page - 1) * query.pageSize;
      resolve({ rows: filtered.slice(start, start + query.pageSize), total: filtered.length, error: null });
    }, 600);
  });
}

export function ServerSide() {
  const [query, setQuery] = useState<Query>({ sort: null, search: '', page: 1, pageSize: 10, attempt: 0 });
  const [failing, setFailing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const key = useMemo(() => JSON.stringify({ ...query, failing }), [query, failing]);

  useEffect(() => {
    let cancelled = false;
    void fakeFetch(query, failing).then((r) => {
      if (!cancelled) setResult({ ...r, key });
    });
    return () => {
      cancelled = true;
    };
  }, [key, query, failing]);

  const isLoading = result?.key !== key;
  return (
    <Stack gap={3}>
      <Switch isSelected={failing} onChange={setFailing}>
        Simula errore del server
      </Switch>
      <DataTable
        aria-label="Clienti (server)"
        mode="server"
        columns={columns}
        rows={result?.rows ?? []}
        totalRows={result?.total ?? 0}
        getRowId={(c) => c.id}
        isLoading={isLoading}
        error={!isLoading ? result?.error ?? undefined : undefined}
        onRetry={() => setQuery((q) => ({ ...q, attempt: q.attempt + 1 }))}
        sort={query.sort}
        onSortChange={(sort) => setQuery((q) => ({ ...q, sort, page: 1 }))}
        searchable
        search={query.search}
        onSearchChange={(search) => setQuery((q) => ({ ...q, search, page: 1 }))}
        page={query.page}
        onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        pageSize={query.pageSize}
        onPageSizeChange={(pageSize) => setQuery((q) => ({ ...q, pageSize, page: 1 }))}
      />
    </Stack>
  );
}

type DemoState = 'empty' | 'loading' | 'error';
const demoStates: DemoState[] = ['empty', 'loading', 'error'];

export function States() {
  const [state, setState] = useState<DemoState>('empty');
  return (
    <Stack gap={3}>
      <NativeSelect
        label="Stato da mostrare"
        value={state}
        onChange={(e) => setState(demoStates.find((s) => s === e.target.value) ?? 'empty')}
        options={[
          { value: 'empty', label: 'Nessun dato' },
          { value: 'loading', label: 'Caricamento' },
          { value: 'error', label: 'Errore' },
        ]}
      />
      <DataTable
        aria-label="Esempio stati"
        columns={columns}
        rows={[]}
        getRowId={(c) => c.id}
        isLoading={state === 'loading'}
        error={state === 'error' ? 'Impossibile caricare i clienti.' : undefined}
        onRetry={() => setState('empty')}
        density="compact"
      />
    </Stack>
  );
}
export function CompactSticky() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set(['C-1003']));
  const current = customers.find((c) => selected.has(c.id));
  return (
    <Stack gap={3}>
      <DataTable
        aria-label="Clienti, vista compatta"
        columns={columns}
        rows={customers.slice(0, 20)}
        getRowId={(c) => c.id}
        density="compact"
        striped
        stickyHeader
        maxHeight="18rem"
        paginated={false}
        selectionMode="single"
        selectedIds={selected}
        onSelectionChange={setSelected}
        isRowDisabled={(c) => c.status === 'sospeso'}
      />
      <Text variant="body-sm" tone="secondary" role="status">
        {current
          ? `Selezionato: ${current.name} · ultimo ordine: ${current.lastOrder ? current.lastOrder.toLocaleDateString('it-IT') : 'nessun dato'}`
          : 'Nessun cliente selezionato. I clienti sospesi non sono selezionabili.'}
      </Text>
      <Button size="sm" variant="ghost" onPress={() => setSelected(new Set())} isDisabled={selected.size === 0}>
        Deseleziona
      </Button>
    </Stack>
  );
}
