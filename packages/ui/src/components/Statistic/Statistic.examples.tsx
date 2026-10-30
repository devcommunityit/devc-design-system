import { Card, CardBody, Grid, Statistic } from '@dev-community/ui';
import { Euro, Users } from 'lucide-react';

export function Basic() {
  return <Statistic label="Utenti attivi" value={12480} />;
}

export function Dashboard() {
  return (
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      <Card><CardBody><Statistic label="Ricavi del mese" value={84250} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} icon={<Euro />} trend={{ direction: 'up', value: '+8,2%', sentiment: 'positive', label: 'rispetto a febbraio' }} /></CardBody></Card>
      <Card><CardBody><Statistic label="Nuovi clienti" value={312} icon={<Users />} trend={{ direction: 'down', value: '−3%', sentiment: 'negative' }} /></CardBody></Card>
      <Card><CardBody><Statistic label="Tasso di abbandono" value={0.041} formatOptions={{ style: 'percent', maximumFractionDigits: 1 }} trend={{ direction: 'down', value: '−0,4 pt', sentiment: 'positive' }} /></CardBody></Card>
      <Card><CardBody><Statistic label="Ticket aperti" value={null} emptyValue="Dato non disponibile" description="Sincronizzazione in corso" /></CardBody></Card>
    </Grid>
  );
}