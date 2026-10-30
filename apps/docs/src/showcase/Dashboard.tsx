import { Euro, PackageCheck, ShoppingCart, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Inline,
  LinkButton,
  Progress,
  Stack,
  Statistic,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Timeline,
  TimelineItem,
  Toggle,
  ToggleGroup,
  type Selection,
} from '@dev-community/ui';
import { euro, formatDay, orderStatusLabel, orderStatusTone, useShowcaseData } from './data';

type Period = 'q1' | 'q2' | 'q3' | 'q4';
const periods: Record<Period, { label: string; months: number[] }> = {
  q1: { label: 'Gen–Mar', months: [1, 2, 3] },
  q2: { label: 'Apr–Giu', months: [4, 5, 6] },
  q3: { label: 'Lug–Set', months: [7, 8, 9] },
  q4: { label: 'Ott–Dic', months: [10, 11, 12] },
};
const previous: Record<Period, Period | null> = { q1: null, q2: 'q1', q3: 'q2', q4: 'q3' };

function percentChange(current: number, before: number | null) {
  if (before === null || before === 0) return null;
  return Math.round(((current - before) / before) * 100);
}

export function Dashboard() {
  const { orders, customers } = useShowcaseData();
  const [selection, setSelection] = useState<Selection>(new Set<Period>(['q4']));
  const period: Period = selection !== 'all' && selection.has('q1') ? 'q1' : selection !== 'all' && selection.has('q2') ? 'q2' : selection !== 'all' && selection.has('q3') ? 'q3' : 'q4';

  const stats = useMemo(() => {
    const inPeriod = (p: Period) => orders.filter((o) => periods[p].months.includes(Number(o.date.slice(5, 7))) && o.status !== 'annullato');
    const current = inPeriod(period);
    const prevKey = previous[period];
    const before = prevKey ? inPeriod(prevKey) : null;
    const revenue = current.reduce((s, o) => s + o.total, 0);
    const revenueBefore = before ? before.reduce((s, o) => s + o.total, 0) : null;
    const delivered = current.filter((o) => o.status === 'consegnato').length;
    return {
      revenue,
      revenueChange: percentChange(revenue, revenueBefore),
      orders: current.length,
      ordersChange: percentChange(current.length, before ? before.length : null),
      delivered,
      deliveredRate: current.length ? Math.round((delivered / current.length) * 100) : 0,
      latest: [...current].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
      toShip: current.filter((o) => o.status === 'da-spedire').length,
    };
  }, [orders, period]);

  const trials = customers.filter((c) => c.status === 'in-prova').length;
  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? 'Cliente rimosso';
  const trend = (value: number | null) =>
    value === null
      ? undefined
      : { direction: value > 0 ? ('up' as const) : value < 0 ? ('down' as const) : ('neutral' as const), value: `${Math.abs(value)}%`, label: 'rispetto al trimestre precedente' };

  return (
    <Stack gap={6}>
      <Inline justify="between" align="end" gap={4}>
        <Stack gap={1}>
          <Heading level={1} size="headline-md">
            Buongiorno, Giulia
          </Heading>
          <Text tone="secondary">Andamento commerciale 2025 — trimestre {periods[period].label}.</Text>
        </Stack>
        <ToggleGroup aria-label="Trimestre" selectedKeys={selection} onSelectionChange={setSelection} disallowEmptySelection>
          {(Object.keys(periods) as Period[]).map((p) => (
            <Toggle key={p} id={p}>
              {p.toUpperCase()}
            </Toggle>
          ))}
        </ToggleGroup>
      </Inline>

      <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} as="section" aria-label="Indicatori principali">
        <Card variant="outlined">
          <Statistic label="Fatturato" value={stats.revenue} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} icon={<Euro />} trend={trend(stats.revenueChange)} />
        </Card>
        <Card variant="outlined">
          <Statistic label="Ordini" value={stats.orders} icon={<ShoppingCart />} trend={trend(stats.ordersChange)} />
        </Card>
        <Card variant="outlined">
          <Statistic label="Consegnati" value={stats.delivered} icon={<PackageCheck />} description={`${stats.deliveredRate}% degli ordini del periodo`} />
        </Card>
        <Card variant="outlined">
          <Statistic label="Clienti in prova" value={trials} icon={<UserPlus />} description={`su ${customers.length} clienti`} />
        </Card>
      </Grid>

      <Grid columns={{ base: 1, lg: 3 }} gap={4}>
        <Card variant="outlined" className="sc-span-2">
          <CardHeader
            headingLevel={2}
            title="Ultimi ordini"
            subtitle={`${stats.toShip} da spedire nel periodo`}
            actions={
              <LinkButton href="/showcase/elenco" variant="ghost" size="sm">
                Vedi clienti
              </LinkButton>
            }
          />
          <CardBody>
            {stats.latest.length === 0 ? (
              <Text tone="secondary">Nessun ordine nel periodo selezionato.</Text>
            ) : (
              <Table scrollRegionLabel="Ultimi ordini">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Ordine</TableHeaderCell>
                    <TableHeaderCell>Cliente</TableHeaderCell>
                    <TableHeaderCell>Data</TableHeaderCell>
                    <TableHeaderCell>Stato</TableHeaderCell>
                    <TableHeaderCell align="end">Totale</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.latest.map((o) => (
                    <TableRow key={o.id}>
                      <TableHeaderCell scope="row">{o.id}</TableHeaderCell>
                      <TableCell>{customerName(o.customerId)}</TableCell>
                      <TableCell>{formatDay(o.date)}</TableCell>
                      <TableCell>
                        <Badge tone={orderStatusTone[o.status]}>{orderStatusLabel[o.status]}</Badge>
                      </TableCell>
                      <TableCell numeric>{euro.format(o.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader headingLevel={2} title="Obiettivi del trimestre" />
          <CardBody>
            <Stack gap={4}>
              <Progress label="Fatturato (obiettivo 60.000 €)" value={Math.min(100, Math.round((stats.revenue / 60000) * 100))} showValue />
              <Progress label="Ordini consegnati" value={stats.deliveredRate} showValue tone="success" />
              <Progress label="Ordini da spedire" value={stats.orders ? Math.round((stats.toShip / stats.orders) * 100) : 0} showValue tone="warning" />
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card variant="outlined">
        <CardHeader headingLevel={2} title="Attività recenti" subtitle="Registro dimostrativo" />
        <CardBody>
          <Timeline>
            <TimelineItem title="Ordine ORD-24187 creato" time="Oggi, 09:12" tone="info">
              Conti Alimentari · 6 articoli
            </TimelineItem>
            <TimelineItem title="Pagamento ricevuto" time="Ieri, 17:40" tone="success">
              Fontana Design · rinnovo piano Professional
            </TimelineItem>
            <TimelineItem title="Pagamento non riuscito" time="12 dic, 10:03" tone="danger">
              Caruso Ottica · carta scaduta, cliente avvisato via email
            </TimelineItem>
            <TimelineItem title="Nuovo cliente in prova" time="10 dic, 15:26">
              Serra Biotech · prova di 30 giorni
            </TimelineItem>
          </Timeline>
        </CardBody>
      </Card>
    </Stack>
  );
}
