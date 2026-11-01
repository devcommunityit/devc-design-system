import { useMemo, useState } from 'react';
import { Button, Inline, List, SearchInput, Stack, Text } from '@devcommunityit/ui';

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
export function Controlled() {
  const [query, setQuery] = useState('fatture 2025');
  const [clears, setClears] = useState(0);
  return (
    <Stack gap={3}>
      <SearchInput
        label="Cerca documenti"
        value={query}
        onChange={setQuery}
        onClear={() => setClears((n) => n + 1)}
        placeholder="Titolo, numero o cliente"
      />
      <Inline gap={2} wrap>
        <Button size="sm" variant="secondary" onPress={() => setQuery('preventivo Acme')}>
          Imposta “preventivo Acme”
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setQuery('')} isDisabled={query === ''}>
          Svuota dall’esterno
        </Button>
      </Inline>
      <Text variant="body-sm" tone="secondary">
        Valore corrente: {query === '' ? '(vuoto)' : `“${query}”`} · cancellazioni con pulsante o Escape: {clears}
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <SearchInput label="Disabilitato" defaultValue="ordini aperti" isDisabled />
      <SearchInput label="Sola lettura" defaultValue="filtro impostato dall’amministratore" isReadOnly />
      <SearchInput
        label="Codice pratica"
        defaultValue="AB"
        isRequired
        isInvalid
        description="Formato: due lettere seguite da 6 cifre, es. AB123456."
        errorMessage="Il codice deve contenere almeno 8 caratteri."
      />
      <SearchInput label="Search products (in English)" placeholder="e.g. wireless keyboard" />
    </Stack>
  );
}
