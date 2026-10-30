import { useId, useState } from 'react';
import { Button, Heading, Inline, Stack, Switch, Text, Timeline, TimelineItem } from '@dev-community/ui';
import { Package, Truck } from 'lucide-react';

export function Basic() {
  return (
    <Timeline aria-label="Storico dell’ordine 10458">
      <TimelineItem title="Ordine ricevuto" time="3 mar 2025, 09:14" dateTime="2025-03-03T09:14" tone="info" />
      <TimelineItem title="Pagamento confermato" time="3 mar 2025, 09:15" dateTime="2025-03-03T09:15" tone="success" />
      <TimelineItem title="Spedito" time="4 mar 2025, 16:02" dateTime="2025-03-04T16:02" icon={<Truck />}>
        <Text variant="body-sm" tone="secondary">Corriere: BRT · Tracking 0571 2234 9981</Text>
      </TimelineItem>
      <TimelineItem title="Tentativo di consegna fallito" time="6 mar 2025" dateTime="2025-03-06" tone="warning" />
    </Timeline>
  );
}

export function WithIcons() {
  return (
    <Timeline aria-label="Attività del magazzino">
      <TimelineItem title="Lotto 22 registrato" icon={<Package />} />
      <TimelineItem title="Errore di sincronizzazione inventario" tone="danger">
        <Text variant="body-sm">Il dettaglio dell’errore resta visibile finché non viene risolto.</Text>
      </TimelineItem>
    </Timeline>
  );
}
interface TicketEvent {
  id: number;
  title: string;
  time: string;
  dateTime: string;
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}

const nextSteps: Omit<TicketEvent, 'id'>[] = [
  { title: 'Ticket preso in carico da Marco', time: '10 mar, 09:40', dateTime: '2025-03-10T09:40', tone: 'info' },
  { title: 'In attesa di risposta del cliente', time: '10 mar, 11:05', dateTime: '2025-03-10T11:05', tone: 'warning' },
  { title: 'Il cliente ha inviato i log richiesti', time: '11 mar, 08:12', dateTime: '2025-03-11T08:12', tone: 'neutral' },
  { title: 'Problema risolto e ticket chiuso', time: '11 mar, 15:30', dateTime: '2025-03-11T15:30', tone: 'success' },
];

export function Controlled() {
  const [events, setEvents] = useState<TicketEvent[]>([
    { id: 0, title: 'Ticket aperto dal cliente', time: '10 mar, 09:12', dateTime: '2025-03-10T09:12', tone: 'neutral' },
  ]);
  const [newestFirst, setNewestFirst] = useState(false);
  const headingId = useId();
  const next = nextSteps[events.length - 1];
  const ordered = newestFirst ? [...events].reverse() : events;
  return (
    <Stack gap={3}>
      <Inline gap={2} wrap align="center">
        <Button
          size="sm"
          onPress={() => {
            if (next) setEvents((list) => [...list, { ...next, id: list.length }]);
          }}
          isDisabled={!next}
        >
          Aggiungi evento successivo
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setEvents((list) => list.slice(0, 1))} isDisabled={events.length === 1}>
          Azzera
        </Button>
        <Switch isSelected={newestFirst} onChange={setNewestFirst}>
          Più recenti in alto
        </Switch>
      </Inline>
      <Heading level={3} size="title-sm" id={headingId}>
        Ticket #4821 · {events.length} eventi ({newestFirst ? 'dal più recente' : 'dal più vecchio'})
      </Heading>
      <Timeline aria-labelledby={headingId}>
        {ordered.map((e) => (
          <TimelineItem key={e.id} title={e.title} time={e.time} dateTime={e.dateTime} tone={e.tone} />
        ))}
      </Timeline>
    </Stack>
  );
}

export function LongAndMissing() {
  return (
    <div style={{ maxInlineSize: '28rem' }}>
      <Timeline aria-label="Revisioni del documento">
        <TimelineItem
          title="Revisione approvata dal comitato tecnico-scientifico per la pubblicazione nel portale istituzionale della Regione"
          time="12 feb 2025"
          dateTime="2025-02-12"
          tone="success"
        >
          <Text variant="body-sm" tone="secondary">
            Le note della revisione sono molto lunghe e vanno a capo all’interno della colonna senza sovrapporsi all’orario o al marcatore.
          </Text>
        </TimelineItem>
        <TimelineItem title="Bozza importata da un sistema esterno (data non disponibile)" />
        <TimelineItem lang="en" title="Document created by the London office" time="Jan 28, 2025" dateTime="2025-01-28" />
      </Timeline>
    </div>
  );
}
