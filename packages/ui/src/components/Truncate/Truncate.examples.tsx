import { useState } from 'react';
import { Button, Stack, Text, Truncate } from '@dev-community/ui';

const text =
  'Il servizio di assistenza è disponibile dal lunedì al venerdì, dalle 8:30 alle 18:00. Le richieste ricevute fuori orario vengono prese in carico il giorno lavorativo successivo, secondo l’ordine di arrivo e la priorità indicata. Per le segnalazioni urgenti relative a interruzioni di servizio è attivo un numero dedicato, riportato nel contratto di assistenza.';

export function MultiLine() {
  return (
    <div style={{ maxInlineSize: '32rem' }}>
      <Truncate lines={2}>{text}</Truncate>
    </div>
  );
}

export function SingleLine() {
  return (
    <div style={{ maxInlineSize: '18rem' }}>
      <Truncate lines={1}>{text}</Truncate>
    </div>
  );
}
const reviews = [
  { id: 'r1', author: 'Laura M.', body: text },
  {
    id: 'r2',
    author: 'James P. (EN)',
    body: 'Support replied within the hour and walked us through the migration step by step. The documentation is thorough, although a few screenshots are outdated and still show the previous navigation menu.',
  },
];

export function Controlled() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const allOpen = reviews.every((r) => expanded[r.id]);
  return (
    <Stack gap={3} style={{ maxInlineSize: '32rem' }}>
      <Button size="sm" variant="secondary" onPress={() => setExpanded(Object.fromEntries(reviews.map((r) => [r.id, !allOpen])))}>
        {allOpen ? 'Comprimi tutte le recensioni' : 'Espandi tutte le recensioni'}
      </Button>
      {reviews.map((r) => (
        <Stack key={r.id} gap={1}>
          <Text weight="semibold">{r.author}</Text>
          <Truncate
            lines={2}
            lang={r.id === 'r2' ? 'en' : undefined}
            isExpanded={expanded[r.id] ?? false}
            onExpandedChange={(open) => setExpanded((prev) => ({ ...prev, [r.id]: open }))}
          >
            {r.body}
          </Truncate>
        </Stack>
      ))}
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        Espanse: {reviews.filter((r) => expanded[r.id]).length} di {reviews.length}
      </Text>
    </Stack>
  );
}

export function ShortAndNoToggle() {
  return (
    <Stack gap={4} style={{ maxInlineSize: '24rem' }}>
      <Stack gap={1}>
        <Text weight="semibold">Testo breve: nessun pulsante</Text>
        <Truncate lines={2}>Orari: lun–ven, 8:30–18:00.</Truncate>
      </Stack>
      <Stack gap={1}>
        <Text weight="semibold">hideToggle: testo completo disponibile altrove</Text>
        <Truncate lines={1} hideToggle title={text}>
          {text}
        </Truncate>
      </Stack>
    </Stack>
  );
}
