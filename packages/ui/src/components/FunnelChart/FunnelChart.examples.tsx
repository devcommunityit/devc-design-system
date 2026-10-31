import { Card, CardBody, FunnelChart } from '@dev-community/ui';

const checkout = [
  { id: 'visits', label: 'Visite', value: 24800 },
  { id: 'product', label: 'Pagina prodotto', value: 12600 },
  { id: 'cart', label: 'Carrello', value: 5400 },
  { id: 'checkout', label: 'Pagamento', value: 2900 },
  { id: 'orders', label: 'Ordini', value: 2150 },
];

export function Basic() {
  return <FunnelChart title="Funnel di acquisto" description="Ottobre 2026" data={checkout} />;
}

export function Currency() {
  return (
    <FunnelChart
      title="Pipeline commerciale"
      height={36}
      formatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact' }}
      data={[
        { id: 'lead', label: 'Opportunità', value: 1_800_000 },
        { id: 'qualified', label: 'Qualificate', value: 1_150_000 },
        { id: 'proposal', label: 'Proposta inviata', value: 640_000 },
        { id: 'won', label: 'Chiuse vinte', value: 310_000 },
      ]}
    />
  );
}

export function InCard() {
  return (
    <Card style={{ maxInlineSize: 420 }}>
      <CardBody>
        <FunnelChart
          title="Iscrizioni alla newsletter"
          height={32}
          data={[
            { id: 'seen', label: 'Popup visto', value: 9200 },
            { id: 'email', label: 'Email inserita', value: 1840 },
            { id: 'confirmed', label: 'Confermata', value: 1310 },
          ]}
        />
      </CardBody>
    </Card>
  );
}

export function Vivid() {
  return <FunnelChart appearance="vivid" title="Funnel di acquisto" description="Ottobre 2026" data={checkout} />;
}
