import { useState } from 'react';
import { Bell, Ticket } from 'lucide-react';
import { Badge, Button, EventCard, Grid, Stack, Switch } from '@devcommunityit/ui';

const attendees = [
  { name: 'Giulia Rossi' },
  { name: 'Marco Bianchi' },
  { name: 'Sara Conti' },
  { name: 'Luca Ferri' },
  { name: 'Elena Galli' },
  { name: 'Paolo Neri' },
];

export function Basic() {
  return (
    <div style={{ maxInlineSize: '24rem' }}>
      <EventCard
        title="AI Agents in Production: dal prototipo al deploy"
        href="#eventi/ai-agents"
        date="2026-11-12"
        tone="violet"
        mode="hybrid"
        watermark="AI"
        tags={
          <>
            <Badge tone="brand" variant="soft">AI &amp; Agents</Badge>
            <Badge tone="neutral" variant="soft">Meetup</Badge>
          </>
        }
        location="Roma · Talent Garden Ostiense"
        time="18:30 – 21:00"
        seatsTaken={86}
        capacity={120}
        attendees={attendees}
        attendeesLabel="Partecipanti"
        action={
          <Button size="sm" startIcon={<Ticket />}>
            Iscriviti
          </Button>
        }
      />
    </div>
  );
}

export function Online() {
  return (
    <div style={{ maxInlineSize: '24rem' }}>
      <EventCard
        title=".NET 10 + Aspire: microservizi cloud-native senza dolore"
        href="#eventi/dotnet-aspire"
        date="2026-11-27"
        tone="cyan"
        mode="online"
        watermark=".NET"
        tags={<Badge tone="info" variant="soft">Cloud</Badge>}
        location="Streaming"
        time="19:00 – 20:30"
        action={
          <Button size="sm" variant="outline" startIcon={<Bell />}>
            Ricordamelo
          </Button>
        }
      />
    </div>
  );
}

export function SeatsStatus() {
  return (
    <Grid minItemWidth="18rem" gap={4}>
      <EventCard
        title="Workshop Kubernetes: dal cluster al GitOps"
        date="2026-12-03"
        tone="pink"
        mode="inPerson"
        location="Milano · Base"
        time="09:30 – 17:00"
        seatsTaken={27}
        capacity={30}
        action={<Button size="sm">Iscriviti</Button>}
      />
      <EventCard
        title="Community Night: lightning talk e pizza"
        date="2026-12-10"
        tone="green"
        mode="inPerson"
        location="Cagliari · Open Campus"
        time="19:00 – 22:00"
        seatsTaken={80}
        capacity={80}
        action={
          <Button size="sm" variant="outline" isDisabled>
            Lista d’attesa
          </Button>
        }
      />
    </Grid>
  );
}

export function Gallery() {
  return (
    <Grid minItemWidth="18rem" gap={4}>
      <EventCard title="AI Agents in Production" href="#1" date="2026-11-12" tone="brand" mode="hybrid" location="Roma" time="18:30 – 21:00" seatsTaken={86} capacity={120} />
      <EventCard title=".NET 10 + Aspire" href="#2" date="2026-11-27" tone="cyan" mode="online" location="Streaming" time="19:00 – 20:30" />
      <EventCard title="Design system con React Aria" href="#3" date="2026-12-04" tone="pink" mode="inPerson" location="Torino" time="18:00 – 20:00" seatsTaken={38} capacity={40} />
    </Grid>
  );
}

/** Agenda in caricamento: SkeletonCard with cover, text lines and the action button. */
export function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <Grid minItemWidth="16rem" gap={4}>
        <EventCard isLoading={isLoading} title="Cloud Native Day" date="2026-10-03" tone="cyan" mode="inPerson" location="Milano" time="09:30 – 17:00" />
        <EventCard isLoading={isLoading} title="Copilot live coding" date="2026-10-21" tone="violet" mode="online" location="Streaming" time="18:00 – 19:30" />
      </Grid>
    </Stack>
  );
}
