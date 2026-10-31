import { Card, CardBody, RadialBarChart } from '@dev-community/ui';

const goals = [
  { id: 'sales', label: 'Vendite', value: 82 },
  { id: 'leads', label: 'Nuovi contatti', value: 64 },
  { id: 'nps', label: 'Soddisfazione', value: 91 },
  { id: 'churn', label: 'Fidelizzazione', value: 47 },
];

export function Basic() {
  return <RadialBarChart title="Obiettivi del trimestre" description="Percentuale raggiunta, Q4 2026" data={goals} />;
}

export function PerItemMax() {
  return (
    <RadialBarChart
      title="Budget per reparto"
      size={260}
      formatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact' }}
      data={[
        { id: 'eng', label: 'Sviluppo', value: 380000, max: 420000 },
        { id: 'mkt', label: 'Marketing', value: 150000, max: 210000 },
        { id: 'sup', label: 'Assistenza', value: 88000, max: 95000 },
      ]}
    />
  );
}

export function InCard() {
  return (
    <Card style={{ maxInlineSize: 360 }}>
      <CardBody>
        <RadialBarChart
          title="Corsi completati"
          size={160}
          max={12}
          data={[
            { id: 'a', label: 'Team Milano', value: 9 },
            { id: 'b', label: 'Team Roma', value: 6 },
          ]}
        />
      </CardBody>
    </Card>
  );
}

export function Vivid() {
  return <RadialBarChart appearance="vivid" title="Obiettivi del trimestre" description="Percentuale raggiunta, Q4 2026" data={goals} />;
}
