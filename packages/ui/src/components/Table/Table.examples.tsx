import { Badge, Table, TableBody, TableCaption, TableCell, TableFoot, TableHead, TableHeaderCell, TableRow } from '@dev-community/ui';

const invoices = [
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
              <Badge tone={tone[inv.status as keyof typeof tone]}>{inv.status}</Badge>
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