import { useEffect, useState } from 'react';
import { Button, Inline, LocaleProvider, Spinner, Stack, Text } from '@dev-community/ui';

export function Sizes() {
  return (
    <Inline gap={4} align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  );
}

export function WithText() {
  return (
    <Inline gap={2} align="center">
      <Spinner size="sm" label={null} />
      <Text>Sincronizzazione in corso…</Text>
    </Inline>
  );
}

export function InButton() {
  return <Button isPending>Salvataggio</Button>;
}
export function SimulatedLoading() {
  const [loading, setLoading] = useState(false);
  const [loads, setLoads] = useState(0);
  useEffect(() => {
    if (!loading) return;
    // Simulazione locale: nessuna richiesta di rete.
    const id = window.setTimeout(() => {
      setLoading(false);
      setLoads((n) => n + 1);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [loading]);
  return (
    <Stack gap={3}>
      <Inline gap={2}>
        <Button size="sm" onPress={() => setLoading(true)} isDisabled={loading}>
          Aggiorna dati
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setLoading(false)} isDisabled={!loading}>
          Annulla
        </Button>
      </Inline>
      <div style={{ minBlockSize: '2rem' }}>
        {loading ? (
          <Spinner size="sm" label="Aggiornamento dei dati in corso…" />
        ) : (
          <Text role="status">{loads === 0 ? 'Dati non ancora aggiornati.' : `Dati aggiornati ${loads} ${loads === 1 ? 'volta' : 'volte'} (simulazione).`}</Text>
        )}
      </div>
    </Stack>
  );
}

export function LocalizedLabels() {
  return (
    <Inline gap={6} align="center" wrap>
      <LocaleProvider locale="it-IT">
        <Spinner size="md" />
      </LocaleProvider>
      <LocaleProvider locale="en-US">
        <span lang="en-US">
          <Spinner size="md" />
        </span>
      </LocaleProvider>
      <Spinner size="lg" label="Generazione del report annuale in PDF…" />
    </Inline>
  );
}
