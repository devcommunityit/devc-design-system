import { Card, CardBody, GaugeChart } from '@dev-community/ui';

export function Basic() {
  return <GaugeChart title="Soddisfazione clienti" description="Ottobre 2026" value={72} label="Punteggio CSAT" />;
}

export function WithTargetAndBands() {
  return (
    <GaugeChart
      title="Utilizzo CPU"
      description="Media dell’ultima ora"
      value={68}
      target={80}
      label="Cluster di produzione"
      formatOptions={{ style: 'unit', unit: 'percent', maximumFractionDigits: 0 }}
      bands={[
        { to: 60, tone: 'success' },
        { to: 85, tone: 'warning' },
        { to: 100, tone: 'danger' },
      ]}
    />
  );
}

export function Currency() {
  return (
    <GaugeChart
      title="Fatturato del trimestre"
      value={1_240_000}
      min={0}
      max={2_000_000}
      target={1_500_000}
      size={280}
      label="Q4 2026"
      formatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact' }}
    />
  );
}

export function InCard() {
  return (
    <Card style={{ maxInlineSize: 320 }}>
      <CardBody>
        <GaugeChart title="Spazio usato" size={200} value={42} max={64} label="su 64 GB" formatOptions={{ style: 'unit', unit: 'gigabyte' }} />
      </CardBody>
    </Card>
  );
}

export function Vivid() {
  return (
    <GaugeChart
      appearance="vivid"
      title="Soddisfazione clienti"
      description="Ottobre 2026"
      value={72}
      target={80}
      label="Punteggio CSAT"
      bands={[
        { to: 50, tone: 'danger' },
        { to: 75, tone: 'warning' },
        { to: 100, tone: 'success' },
      ]}
    />
  );
}
