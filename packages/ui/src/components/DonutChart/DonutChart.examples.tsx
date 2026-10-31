import { Card, CardBody, DonutChart } from '@dev-community/ui';

const channels = [
  { id: 'web', label: 'Sito web', value: 5420 },
  { id: 'app', label: 'App mobile', value: 3180 },
  { id: 'store', label: 'Negozi', value: 1460 },
  { id: 'partner', label: 'Partner', value: 740 },
];

export function Basic() {
  return <DonutChart title="Ordini per canale" description="Ottobre 2026" data={channels} />;
}

export function Currency() {
  return (
    <DonutChart
      title="Budget by team"
      centerLabel="Total budget"
      size={240}
      thickness={28}
      formatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact' }}
      data={[
        { id: 'eng', label: 'Engineering', value: 420000 },
        { id: 'design', label: 'Design', value: 160000 },
        { id: 'marketing', label: 'Marketing', value: 210000 },
        { id: 'support', label: 'Support', value: 95000 },
        { id: 'ops', label: 'Operations', value: 70000 },
        { id: 'legal', label: 'Legal', value: 45000 },
      ]}
    />
  );
}

export function InCard() {
  return (
    <Card style={{ maxInlineSize: 360 }}>
      <CardBody>
        <DonutChart
          title="Spazio di archiviazione"
          size={160}
          formatOptions={{ style: 'unit', unit: 'gigabyte', maximumFractionDigits: 0 }}
          data={[
            { id: 'docs', label: 'Documenti', value: 42 },
            { id: 'media', label: 'Media', value: 118 },
            { id: 'backup', label: 'Backup', value: 64 },
          ]}
        />
      </CardBody>
    </Card>
  );
}

export function Vivid() {
  return <DonutChart appearance="vivid" title="Ordini per canale" description="Ottobre 2026" data={channels} />;
}
