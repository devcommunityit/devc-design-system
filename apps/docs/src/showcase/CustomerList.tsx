import { Download, Plus, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertDialog,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DataTable,
  EmptyState,
  Heading,
  Inline,
  LinkButton,
  NativeSelect,
  Stack,
  Tag,
  TagGroup,
  Text,
  useToast,
  type DataTableColumn,
  type Key,
} from '@dev-community/ui';
import {
  actions,
  customerStatusLabel,
  customerStatusTone,
  formatDay,
  initialCustomers,
  useShowcaseData,
  type Customer,
  type CustomerStatus,
  type Plan,
  type Region,
} from './data';

const columns: DataTableColumn<Customer>[] = [
  { id: 'name', header: 'Cliente', accessor: (c) => c.name, sortable: true, isRowHeader: true, minWidth: '14rem' },
  { id: 'contact', header: 'Referente', accessor: (c) => c.contact, sortable: true },
  { id: 'city', header: 'Città', accessor: (c) => c.city, sortable: true },
  { id: 'plan', header: 'Piano', accessor: (c) => c.plan, sortable: true },
  {
    id: 'status',
    header: 'Stato',
    accessor: (c) => customerStatusLabel[c.status],
    sortable: true,
    cell: (c) => <Badge tone={customerStatusTone[c.status]}>{customerStatusLabel[c.status]}</Badge>,
  },
  { id: 'since', header: 'Cliente dal', accessor: (c) => c.since, sortable: true, searchable: false, cell: (c) => formatDay(c.since) },
];

const statusOptions: Array<{ value: '' | CustomerStatus; label: string }> = [
  { value: '', label: 'Tutti gli stati' },
  { value: 'attivo', label: 'Attivo' },
  { value: 'in-prova', label: 'In prova' },
  { value: 'sospeso', label: 'Sospeso' },
];
const planOptions: Array<{ value: '' | Plan; label: string }> = [
  { value: '', label: 'Tutti i piani' },
  { value: 'Base', label: 'Base' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Enterprise', label: 'Enterprise' },
];
const regionOptions: Array<{ value: '' | Region; label: string }> = [
  { value: '', label: 'Tutte le aree' },
  { value: 'Nord', label: 'Nord' },
  { value: 'Centro', label: 'Centro' },
  { value: 'Sud e isole', label: 'Sud e isole' },
];

function toCsv(rows: readonly Customer[]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ['ID', 'Cliente', 'Referente', 'Email', 'Telefono', 'Città', 'Area', 'Piano', 'Stato', 'Cliente dal'];
  const lines = rows.map((c) => [c.id, c.name, c.contact, c.email, c.phone ?? '', c.city, c.region, c.plan, customerStatusLabel[c.status], c.since].map(escape).join(';'));
  return [header.map(escape).join(';'), ...lines].join('\r\n');
}

function downloadCsv(rows: readonly Customer[]) {
  const url = URL.createObjectURL(new Blob(['\uFEFF', toCsv(rows)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clienti.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function CustomerList() {
  const { customers } = useShowcaseData();
  const navigate = useNavigate();
  const toast = useToast();
  const [status, setStatus] = useState<'' | CustomerStatus>('');
  const [plan, setPlan] = useState<'' | Plan>('');
  const [region, setRegion] = useState<'' | Region>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);

  const filter = useMemo(() => {
    if (!status && !plan && !region) return undefined;
    return (c: Customer) => (!status || c.status === status) && (!plan || c.plan === plan) && (!region || c.region === region);
  }, [status, plan, region]);

  const activeFilters = [
    status ? { id: 'status', label: `Stato: ${customerStatusLabel[status]}` } : null,
    plan ? { id: 'plan', label: `Piano: ${plan}` } : null,
    region ? { id: 'region', label: `Area: ${region}` } : null,
  ].filter((f): f is { id: string; label: string } => f !== null);

  const clearFilter = (id: Key) => {
    if (id === 'status') setStatus('');
    if (id === 'plan') setPlan('');
    if (id === 'region') setRegion('');
  };
  const clearAll = () => {
    setStatus('');
    setPlan('');
    setRegion('');
    setSearch('');
  };

  const visibleRows = () => {
    const q = search.trim().toLocaleLowerCase('it');
    return customers.filter((c) => (!filter || filter(c)) && (!q || [c.name, c.contact, c.city, c.plan].some((v) => v.toLocaleLowerCase('it').includes(q))));
  };

  const modified = customers !== initialCustomers;

  return (
    <Stack gap={5}>
      <Breadcrumb>
        <BreadcrumbItem href="/showcase/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Clienti</BreadcrumbItem>
      </Breadcrumb>
      <Inline justify="between" align="end" gap={3}>
        <Stack gap={1}>
          <Heading level={1} size="headline-md">
            Clienti
          </Heading>
          <Text tone="secondary">{customers.length} clienti nel portale dimostrativo.</Text>
        </Stack>
        <Inline gap={2}>
          {modified ? (
            <Button
              variant="ghost"
              startIcon={<RotateCcw />}
              onPress={() => {
                actions.reset();
                setSelected(new Set());
                toast.show({ title: 'Dati di esempio ripristinati', tone: 'success' });
              }}
            >
              Ripristina dati
            </Button>
          ) : null}
          <Button variant="outline" startIcon={<Download />} onPress={() => downloadCsv(visibleRows())}>
            Esporta CSV
          </Button>
          <LinkButton href="/showcase/modulo" startIcon={<Plus />}>
            Nuova richiesta
          </LinkButton>
        </Inline>
      </Inline>

      {activeFilters.length > 0 ? (
        <TagGroup label="Filtri attivi" items={activeFilters} onRemove={(keys) => keys.forEach(clearFilter)}>
          {(f) => <Tag id={f.id}>{f.label}</Tag>}
        </TagGroup>
      ) : null}

      <DataTable
        aria-label="Clienti"
        columns={columns}
        rows={customers}
        getRowId={(c) => c.id}
        defaultSort={{ column: 'name', direction: 'ascending' }}
        searchable
        search={search}
        onSearchChange={setSearch}
        searchLabel="Cerca per nome, referente o città"
        filter={filter}
        isFiltered={Boolean(filter)}
        onClearFilters={clearAll}
        toolbar={
          <Inline gap={3} className="sc-filters">
            <NativeSelect label="Stato" value={status} onChange={(e) => setStatus(statusOptions.find((o) => o.value === e.target.value)?.value ?? '')} options={statusOptions} />
            <NativeSelect label="Piano" value={plan} onChange={(e) => setPlan(planOptions.find((o) => o.value === e.target.value)?.value ?? '')} options={planOptions} />
            <NativeSelect label="Area" value={region} onChange={(e) => setRegion(regionOptions.find((o) => o.value === e.target.value)?.value ?? '')} options={regionOptions} />
          </Inline>
        }
        selectionMode="multiple"
        selectedIds={selected}
        onSelectionChange={setSelected}
        renderBulkActions={(ids) => (
          <Inline gap={2}>
            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                actions.setCustomersStatus(ids, 'sospeso');
                toast.show({ title: `${ids.length} clienti sospesi`, tone: 'success' });
              }}
            >
              Sospendi
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                actions.setCustomersStatus(ids, 'attivo');
                toast.show({ title: `${ids.length} clienti riattivati`, tone: 'success' });
              }}
            >
              Riattiva
            </Button>
            <Button size="sm" variant="danger" onPress={() => setPendingDelete(ids)}>
              Elimina
            </Button>
          </Inline>
        )}
        onRowAction={(c) => void navigate(`/showcase/dettaglio?id=${encodeURIComponent(c.id)}`)}
        emptyState={
          <EmptyState
            title="Nessun cliente"
            description="Hai eliminato tutti i clienti dimostrativi."
            actions={
              <Button onPress={() => actions.reset()} startIcon={<RotateCcw />}>
                Ripristina dati di esempio
              </Button>
            }
          />
        }
        stickyHeader
      />
      <Text variant="body-sm" tone="secondary">
        Premi Invio su una riga o fai clic sul nome per aprire il dettaglio. L’esportazione CSV include i clienti filtrati.
      </Text>

      <AlertDialog
        isOpen={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        tone="danger"
        title={`Eliminare ${pendingDelete?.length ?? 0} clienti?`}
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        onConfirm={() => {
          const ids = pendingDelete ?? [];
          actions.removeCustomers(ids);
          setSelected(new Set());
          setPendingDelete(null);
          toast.show({ title: `${ids.length} clienti eliminati`, description: 'Solo in memoria: ricarica la pagina o usa “Ripristina dati”.', tone: 'success' });
        }}
      >
        I clienti e i loro ordini verranno rimossi dai dati dimostrativi di questa sessione.
      </AlertDialog>
    </Stack>
  );
}
