import { useState } from 'react';
import { Button, Card, CardBody, Grid, Inline, LocaleProvider, Stack, Statistic } from '@devcommunityit/ui';
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
export function SizesAndStates() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={4}>
      <Statistic size="sm" label="Errori 5xx (24 h)" value={18} trend={{ direction: 'down', value: '−42%', sentiment: 'positive', label: 'meno errori è positivo' }} />
      <Statistic size="md" label="Tempo medio di risposta del servizio di fatturazione elettronica verso SDI" value={238} formatOptions={{ style: 'unit', unit: 'millisecond' }} trend={{ direction: 'neutral', value: '±0%' }} />
      <Statistic size="lg" label="Ordini in coda" value={null} emptyValue="Nessun dato" description="Il connettore del magazzino non ha ancora inviato dati." />
    </Grid>
  );
}

export function LocaleComparison() {
  const revenue = 1234567.89;
  const currency: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR' };
  const compact: Intl.NumberFormatOptions = { notation: 'compact', maximumFractionDigits: 1 };
  return (
    <Grid columns={{ base: 1, sm: 2 }} gap={4}>
      <LocaleProvider locale="it-IT">
        <div lang="it-IT">
          <Stack gap={3}>
            <Statistic label="Fatturato (it-IT)" value={revenue} formatOptions={currency} trend={{ direction: 'up', value: '+5,1%' }} />
            <Statistic label="Visite (compatto)" value={2450000} formatOptions={compact} />
          </Stack>
        </div>
      </LocaleProvider>
      <LocaleProvider locale="en-US">
        <div lang="en-US">
          <Stack gap={3}>
            <Statistic label="Revenue (en-US)" value={revenue} formatOptions={currency} trend={{ direction: 'up', value: '+5.1%' }} />
            <Statistic label="Visits (compact)" value={2450000} formatOptions={compact} />
          </Stack>
        </div>
      </LocaleProvider>
    </Grid>
  );
}

export function LiveValue() {
  const [signups, setSignups] = useState(120);
  const baseline = 120;
  const delta = signups - baseline;
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';
  return (
    <Stack gap={3}>
      <Statistic
        label="Iscrizioni di oggi"
        value={signups}
        trend={{ direction, value: `${delta > 0 ? '+' : delta < 0 ? '−' : '±'}${Math.abs(delta)}`, label: 'rispetto a ieri (120)' }}
      />
      <Inline gap={2} wrap>
        <Button size="sm" variant="secondary" onPress={() => setSignups((n) => n + 10)}>
          +10 iscrizioni
        </Button>
        <Button size="sm" variant="secondary" onPress={() => setSignups((n) => Math.max(0, n - 10))} isDisabled={signups === 0}>
          −10 iscrizioni
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setSignups(baseline)} isDisabled={signups === baseline}>
          Ripristina
        </Button>
      </Inline>
    </Stack>
  );
}
