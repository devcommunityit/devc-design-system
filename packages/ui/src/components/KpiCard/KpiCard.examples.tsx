import { Euro, ShoppingCart, TicketCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { Grid, KpiCard, Link, Toggle, ToggleGroup } from '@dev-community/ui';

export function Basic() {
  return (
    <KpiCard
      label="Ricavi del mese"
      value={84250}
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      icon={<Euro />}
      trend={{ direction: 'up', value: '+8,2%', label: 'rispetto a febbraio' }}
    />
  );
}

export function WithSparkline() {
  return (
    <KpiCard
      label="Active users"
      value={12480}
      icon={<Users />}
      trend={{ direction: 'up', value: '+4.1%', label: 'vs last week' }}
      sparkline={[9800, 10120, 10050, 10900, 11320, 11800, 12480]}
    />
  );
}

export function Dashboard() {
  return (
    <Grid minItemWidth="15rem" gap={4}>
      <KpiCard label="Ricavi" value={84250} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} icon={<Euro />} trend={{ direction: 'up', value: '+8,2%' }} sparkline={[62, 64, 70, 68, 75, 79, 84]} footer={<Link href="#ricavi">Dettaglio ricavi</Link>} />
      <KpiCard label="Ordini" value={1312} icon={<ShoppingCart />} trend={{ direction: 'down', value: '−3%' }} sparkline={[1400, 1380, 1390, 1350, 1330, 1320, 1312]} footer={<Link href="#ordini">Vedi ordini</Link>} />
      <KpiCard label="Tasso di abbandono" value={0.041} formatOptions={{ style: 'percent', maximumFractionDigits: 1 }} trend={{ direction: 'down', value: '−0,4 pt', sentiment: 'positive' }} sparkline={[5.2, 4.9, 4.8, 4.6, 4.4, 4.3, 4.1]} />
      <KpiCard label="Ticket aperti" value={null} emptyValue="Dato non disponibile" icon={<TicketCheck />} description="Sincronizzazione in corso" />
    </Grid>
  );
}

const series: Record<'7' | '30', number[]> = {
  '7': [420, 460, 445, 470, 510, 498, 530],
  '30': [300, 320, 310, 340, 360, 355, 380, 400, 390, 420, 430, 445, 460, 470, 480, 475, 490, 500, 505, 498, 510, 515, 520, 518, 522, 525, 527, 528, 529, 530],
};

/** Period switch driven by local state. */
export function Periods() {
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const data = series[period];
  const first = data[0] ?? 0;
  const last = data[data.length - 1] ?? 0;
  const change = first === 0 ? 0 : (last - first) / first;
  return (
    <KpiCard
      label="Iscrizioni newsletter"
      value={last}
      trend={{ direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral', value: new Intl.NumberFormat('it-IT', { style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 1 }).format(change), label: period === '7' ? 'ultimi 7 giorni' : 'ultimi 30 giorni' }}
      sparkline={data}
      footer={
        <ToggleGroup
          aria-label="Periodo"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[period]}
          onSelectionChange={(keys) => {
            for (const key of keys) if (key === '7' || key === '30') setPeriod(key);
          }}
        >
          <Toggle id="7">7 giorni</Toggle>
          <Toggle id="30">30 giorni</Toggle>
        </ToggleGroup>
      }
    />
  );
}
