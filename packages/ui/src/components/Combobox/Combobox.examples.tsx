import { useEffect, useState } from 'react';
import { Combobox, ListBoxItem, Stack, Text, type Key } from '@dev-community/ui';

const cities = [
  { id: 'bo', name: 'Bologna', region: 'Emilia-Romagna' },
  { id: 'fi', name: 'Firenze', region: 'Toscana' },
  { id: 'ge', name: 'Genova', region: 'Liguria' },
  { id: 'mi', name: 'Milano', region: 'Lombardia' },
  { id: 'na', name: 'Napoli', region: 'Campania' },
  { id: 'pa', name: 'Palermo', region: 'Sicilia' },
  { id: 'rm', name: 'Roma', region: 'Lazio' },
  { id: 'to', name: 'Torino', region: 'Piemonte' },
  { id: 've', name: 'Venezia', region: 'Veneto' },
];

export function Basic() {
  return (
    <Combobox label="Città" placeholder="Cerca una città" defaultItems={cities}>
      {(city) => (
        <ListBoxItem id={city.id} description={city.region} textValue={city.name}>
          {city.name}
        </ListBoxItem>
      )}
    </Combobox>
  );
}

export function Controlled() {
  const [selected, setSelected] = useState<Key | null>('rm');
  return (
    <Stack gap={2}>
      <Combobox label="Sede di lavoro" defaultItems={cities} value={selected} onChange={setSelected}>
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </Combobox>
      <Text variant="body-sm" tone="secondary">
        Chiave selezionata: {selected ?? 'nessuna'}
      </Text>
    </Stack>
  );
}

/** Simulated local search: a 400 ms timer replaces the network call your app would make. */
export function AsyncSimulated() {
  const [query, setQuery] = useState('');
  const [resolved, setResolved] = useState({ query: '', results: cities });
  useEffect(() => {
    const timer = setTimeout(() => {
      setResolved({ query, results: cities.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())) });
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);
  const isLoading = resolved.query !== query;
  const results = resolved.results;
  return (
    <Stack gap={2}>
      <Combobox
        label="Ricerca remota (simulata)"
        items={results}
        inputValue={query}
        onInputChange={setQuery}
        isLoading={isLoading}
        emptyState="Nessuna città trovata"
      >
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </Combobox>
      <Text variant="body-sm" tone="secondary">
        Simulazione locale con ritardo di 400 ms: nessuna richiesta di rete.
      </Text>
    </Stack>
  );
}

export function CustomValue() {
  const [value, setValue] = useState('');
  return (
    <Stack gap={2}>
      <Combobox label="Reparto" allowsCustomValue inputValue={value} onInputChange={setValue} defaultItems={[{ id: 'hr', name: 'Risorse umane' }, { id: 'it', name: 'IT' }, { id: 'sales', name: 'Vendite' }]}>
        {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
      </Combobox>
      <Text variant="body-sm" tone="secondary">
        Testo inserito: {value || '—'}
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <Combobox label="Non valido" defaultItems={cities} isInvalid errorMessage="Scegli una città dall’elenco.">
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </Combobox>
      <Combobox label="Disabilitato" defaultItems={cities} defaultSelectedKey="mi" isDisabled>
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </Combobox>
    </Stack>
  );
}