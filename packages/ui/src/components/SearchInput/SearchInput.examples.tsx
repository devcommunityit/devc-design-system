import { useMemo, useState } from 'react';
import { List, SearchInput, Stack, Text } from '@dev-community/ui';

const cities = ['Bari', 'Bologna', 'Cagliari', 'Firenze', 'Genova', 'Milano', 'Napoli', 'Palermo', 'Roma', 'Torino', 'Venezia', 'Verona'];

export function Basic() {
  return <SearchInput aria-label="Cerca nel sito" placeholder="Cerca…" />;
}

export function LiveFilter() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => cities.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <Stack gap={3}>
      <SearchInput label="Filtra città" value={query} onChange={setQuery} placeholder="Es. Mi" />
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        {results.length} risultati
      </Text>
      <List>
        {results.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </List>
    </Stack>
  );
}

export function SubmitAndPending() {
  const [pending, setPending] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  return (
    <Stack gap={3}>
      <SearchInput
        label="Search orders"
        description="Press Enter to search. The delay simulates a request handled by the consumer."
        isPending={pending}
        onSubmit={(q) => {
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            setLast(q);
          }, 800);
        }}
      />
      {last !== null ? <p role="status">Simulated search for “{last}” complete.</p> : null}
    </Stack>
  );
}