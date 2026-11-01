import { useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Inline,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  VisuallyHidden,
} from '@devcommunityit/ui';

type InvoiceStatus = 'Pagata' | 'In attesa' | 'Scaduta';
const invoices: { id: string; client: string; status: InvoiceStatus; amount: number }[] = [
  { id: 'F-2025-041', client: 'Acme S.p.A.', status: 'Pagata', amount: 1250 },
  { id: 'F-2025-042', client: 'Bottega Rossi S.r.l.', status: 'In attesa', amount: 480.5 },
  { id: 'F-2025-043', client: 'Studio Associato Verdi e Partner con una ragione sociale molto lunga', status: 'Scaduta', amount: 3120 },
];
const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
const tone = { Pagata: 'success', 'In attesa': 'warning', Scaduta: 'danger' } as const;

export function Basic() {
  return (
    <Table scrollRegionLabel="Fatture recenti">
      <TableCaption>Fatture recenti</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Numero</TableHeaderCell>
          <TableHeaderCell>Cliente</TableHeaderCell>
          <TableHeaderCell>Stato</TableHeaderCell>
          <TableHeaderCell align="end">Importo</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableHeaderCell scope="row">{inv.id}</TableHeaderCell>
            <TableCell>{inv.client}</TableCell>
            <TableCell>
              <Badge tone={tone[inv.status]}>{inv.status}</Badge>
            </TableCell>
            <TableCell numeric>{euro.format(inv.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableHeaderCell scope="row" colSpan={3}>
            Totale
          </TableHeaderCell>
          <TableCell numeric>{euro.format(invoices.reduce((s, i) => s + i.amount, 0))}</TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  );
}

export function DenseStriped() {
  const rows = Array.from({ length: 12 }, (_, i) => ({ hour: `${String(8 + i).padStart(2, '0')}:00`, requests: 1200 + ((i * 337) % 900), errors: (i * 7) % 5 }));
  return (
    <Table density="compact" striped stickyHeader maxHeight="16rem" scrollRegionLabel="Traffico orario">
      <TableCaption>Traffico API per ora</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Ora</TableHeaderCell>
          <TableHeaderCell align="end">Richieste</TableHeaderCell>
          <TableHeaderCell align="end">Errori</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.hour}>
            <TableHeaderCell scope="row">{r.hour}</TableHeaderCell>
            <TableCell numeric>{r.requests.toLocaleString('it-IT')}</TableCell>
            <TableCell numeric>{r.errors}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export function SelectableRows() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set(['F-2025-042']));
  const allSelected = selected.size === invoices.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  const total = invoices.filter((i) => selected.has(i.id)).reduce((s, i) => s + i.amount, 0);
  return (
    <Stack gap={3}>
      <Table scrollRegionLabel="Fatture da sollecitare">
        <TableCaption>Fatture da sollecitare</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <Checkbox
                isSelected={allSelected}
                isIndeterminate={selected.size > 0 && !allSelected}
                onChange={(on) => setSelected(on ? new Set(invoices.map((i) => i.id)) : new Set())}
              >
                <VisuallyHidden>Seleziona tutte le fatture</VisuallyHidden>
              </Checkbox>
            </TableHeaderCell>
            <TableHeaderCell>Numero</TableHeaderCell>
            <TableHeaderCell>Cliente</TableHeaderCell>
            <TableHeaderCell align="end">Importo</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id} isSelected={selected.has(inv.id)}>
              <TableCell>
                <Checkbox isSelected={selected.has(inv.id)} onChange={(on) => toggle(inv.id, on)}>
                  <VisuallyHidden>Seleziona fattura {inv.id}</VisuallyHidden>
                </Checkbox>
              </TableCell>
              <TableHeaderCell scope="row">{inv.id}</TableHeaderCell>
              <TableCell>{inv.client}</TableCell>
              <TableCell numeric>{euro.format(inv.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Text variant="body-sm" tone="secondary" role="status">
        {selected.size === 0 ? 'Nessuna fattura selezionata.' : `${selected.size} selezionate · totale ${euro.format(total)}`}
      </Text>
    </Stack>
  );
}

interface Server {
  host: string;
  region: string;
  owner: string | null;
  cpu: number | null;
  memory: number | null;
  uptime: string | null;
  notes: string;
}

const servers: Server[] = [
  { host: 'web-prod-01', region: 'eu-south-1 (Milano)', owner: 'Team Portale', cpu: 42, memory: 61, uptime: '41 giorni', notes: 'Nessuna anomalia.' },
  { host: 'web-prod-02', region: 'eu-south-1 (Milano)', owner: 'Team Portale', cpu: 87, memory: 74, uptime: '41 giorni', notes: 'Carico elevato durante la campagna di fatturazione di fine mese; valutare uno scale-out orizzontale.' },
  { host: 'batch-legacy-07', region: 'eu-west-1 (Dublino)', owner: null, cpu: null, memory: null, uptime: null, notes: 'Agente di monitoraggio non installato: metriche non disponibili.' },
  { host: 'api-gateway-international-backup', region: 'us-east-1 (Virginia)', owner: 'Platform team (EN)', cpu: 12, memory: 33, uptime: '3 days', notes: 'Standby replica, receives traffic only on failover.' },
];

function Missing() {
  return (
    <>
      <span aria-hidden="true">—</span>
      <VisuallyHidden>dato non disponibile</VisuallyHidden>
    </>
  );
}

const percent = new Intl.NumberFormat('it-IT', { style: 'percent', maximumFractionDigits: 0 });

export function WideWithMissingData() {
  const [compact, setCompact] = useState(false);
  const [striped, setStriped] = useState(true);
  return (
    <Stack gap={3}>
      <Inline gap={4} wrap>
        <Switch isSelected={compact} onChange={setCompact}>
          Densità compatta
        </Switch>
        <Switch isSelected={striped} onChange={setStriped}>
          Righe alterne
        </Switch>
      </Inline>
      <Table density={compact ? 'compact' : 'comfortable'} striped={striped} scrollRegionLabel="Inventario server">
        <TableCaption>Inventario server (scorre in orizzontale su schermi stretti)</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Host</TableHeaderCell>
            <TableHeaderCell>Regione</TableHeaderCell>
            <TableHeaderCell>Responsabile</TableHeaderCell>
            <TableHeaderCell align="end">CPU</TableHeaderCell>
            <TableHeaderCell align="end">Memoria</TableHeaderCell>
            <TableHeaderCell>Uptime</TableHeaderCell>
            <TableHeaderCell style={{ minInlineSize: '18rem' }}>Note</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map((s) => (
            <TableRow key={s.host}>
              <TableHeaderCell scope="row">{s.host}</TableHeaderCell>
              <TableCell>{s.region}</TableCell>
              <TableCell>{s.owner ?? <Missing />}</TableCell>
              <TableCell numeric>{s.cpu === null ? <Missing /> : percent.format(s.cpu / 100)}</TableCell>
              <TableCell numeric>{s.memory === null ? <Missing /> : percent.format(s.memory / 100)}</TableCell>
              <TableCell>{s.uptime ?? <Missing />}</TableCell>
              <TableCell>{s.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        size="sm"
        variant="ghost"
        onPress={() => {
          setCompact(false);
          setStriped(true);
        }}
        isDisabled={!compact && striped}
      >
        Ripristina impostazioni
      </Button>
    </Stack>
  );
}
