import { useEffect, useState } from 'react';
import { MultiSelect, Stack, Text, type Key, type MultiSelectOption } from '@devcommunityit/ui';

const skills: MultiSelectOption[] = [
  { id: 'react', label: 'React' },
  { id: 'ts', label: 'TypeScript' },
  { id: 'a11y', label: 'Accessibilità', description: 'WCAG, ARIA, test con screen reader' },
  { id: 'css', label: 'CSS' },
  { id: 'node', label: 'Node.js' },
  { id: 'figma', label: 'Figma' },
  { id: 'cobol', label: 'COBOL', isDisabled: true },
];

export function Basic() {
  return <MultiSelect label="Competenze" placeholder="Cerca competenze" options={skills} defaultValue={['react']} />;
}

export function Controlled() {
  const [value, setValue] = useState<Key[]>(['ts', 'a11y']);
  return (
    <Stack gap={2}>
      <MultiSelect label="Competenze richieste" options={skills} value={value} onChange={setValue} />
      <Text variant="body-sm" tone="secondary">
        Chiavi: {value.length > 0 ? value.join(', ') : 'nessuna'}
      </Text>
    </Stack>
  );
}

const people: MultiSelectOption[] = [
  { id: 'u1', label: 'Giulia Bianchi', description: 'Design' },
  { id: 'u2', label: 'Marco Rossi', description: 'Engineering' },
  { id: 'u3', label: 'Sara Esposito', description: 'Product' },
  { id: 'u4', label: 'Luca Ferrari', description: 'Engineering' },
  { id: 'u5', label: 'Amira Haddad', description: 'Support' },
];

/** Simulated local search: a 400 ms timer stands in for your API call; no network request is made. */
export function AsyncSimulated() {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<Key[]>([]);
  const [resolved, setResolved] = useState<{ query: string; results: MultiSelectOption[] }>({ query: '', results: [] });
  const q = query.trim().toLowerCase();
  useEffect(() => {
    if (!q) return;
    const timer = setTimeout(() => {
      setResolved({ query: q, results: people.filter((p) => p.label.toLowerCase().includes(q)) });
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);
  const isLoading = q !== '' && resolved.query !== q;
  const results = q !== '' && !isLoading ? resolved.results : [];
  return (
    <Stack gap={2}>
      <MultiSelect
        label="Destinatari (ricerca simulata)"
        placeholder="Digita un nome"
        options={results}
        filter="none"
        inputValue={query}
        onInputChange={setQuery}
        value={value}
        onChange={setValue}
        isLoading={isLoading}
        emptyState={query ? 'Nessuna persona trovata' : 'Digita per cercare'}
      />
      <Text variant="body-sm" tone="secondary">
        Simulazione locale con ritardo di 400 ms. Le etichette dei destinatari scelti restano visibili anche quando non sono nei risultati.
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <MultiSelect label="Obbligatorio" options={skills} isRequired isInvalid errorMessage="Seleziona almeno una competenza." />
      <MultiSelect label="Sola lettura" options={skills} defaultValue={['css', 'figma']} isReadOnly />
      <MultiSelect label="Disabilitato" options={skills} defaultValue={['node']} isDisabled />
    </Stack>
  );
}