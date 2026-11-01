import { useEffect, useMemo, useState } from 'react';
import { CloudOff, FolderPlus, Inbox, SearchX } from 'lucide-react';
import { Button, EmptyState, Inline, List, SearchInput, Spinner, Stack, Text } from '@devcommunityit/ui';

export function NoData() {
  const [projects, setProjects] = useState<string[]>([]);
  if (projects.length > 0) {
    return (
      <Stack gap={3}>
        <List>
          {projects.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </List>
        <Inline gap={2}>
          <Button size="sm" onPress={() => setProjects((list) => [...list, `Progetto ${list.length + 1}`])}>
            Aggiungi progetto
          </Button>
          <Button size="sm" variant="ghost" onPress={() => setProjects([])}>
            Torna allo stato vuoto
          </Button>
        </Inline>
      </Stack>
    );
  }
  return (
    <EmptyState
      icon={<FolderPlus />}
      title="Nessun progetto"
      description="I progetti raccolgono documenti e attività del team."
      actions={<Button onPress={() => setProjects(['Progetto 1'])}>Crea progetto</Button>}
    />
  );
}

const documents = ['Fattura 2025-041', 'Fattura 2025-042', 'Contratto di assistenza', 'Preventivo Acme', 'Verbale riunione di marzo'];

export function NoResults() {
  const [query, setQuery] = useState('fatture 2019');
  const results = useMemo(() => documents.filter((d) => d.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <Stack gap={3}>
      <SearchInput label="Cerca documenti" value={query} onChange={setQuery} />
      {results.length > 0 ? (
        <List>
          {results.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </List>
      ) : (
        <EmptyState
          size="sm"
          headingLevel={3}
          icon={<SearchX />}
          title={`Nessun risultato per “${query}”`}
          description="Prova con un termine diverso o rimuovi qualche filtro."
          actions={
            <Button variant="secondary" onPress={() => setQuery('')}>
              Azzera filtri
            </Button>
          }
        />
      )}
    </Stack>
  );
}

export function Sizes() {
  return (
    <Stack gap={6}>
      <EmptyState size="sm" headingLevel={3} icon={<Inbox />} title="Nessuna notifica" description="Variante sm: adatta a pannelli e colonne laterali." />
      <EmptyState size="md" headingLevel={3} icon={<Inbox />} title="Nessun messaggio in arrivo" description="Variante md (predefinita): sezioni di pagina." />
      <EmptyState
        size="lg"
        headingLevel={3}
        icon={<Inbox />}
        title="Welcome! Your workspace is empty"
        description="Variante lg con testo in inglese e una descrizione volutamente lunga, per verificare che il contenuto vada a capo correttamente senza uscire dal contenitore anche su schermi stretti."
      />
    </Stack>
  );
}

type Outcome = 'error' | 'empty';

export function ErrorWithRetry() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; outcome: Outcome } | null>(null);
  useEffect(() => {
    // Simulazione locale: il primo tentativo fallisce, i successivi restituiscono una lista vuota.
    const id = window.setTimeout(() => setResult({ attempt, outcome: attempt === 0 ? 'error' : 'empty' }), 800);
    return () => window.clearTimeout(id);
  }, [attempt]);
  if (result?.attempt !== attempt) {
    return (
      <Inline gap={2} align="center">
        <Spinner size="sm" label={null} />
        <Text role="status">Caricamento delle attività…</Text>
      </Inline>
    );
  }
  if (result.outcome === 'error') {
    return (
      <EmptyState
        headingLevel={3}
        icon={<CloudOff />}
        title="Impossibile caricare le attività"
        description="Il server non risponde (errore simulato in locale). Controlla la connessione e riprova."
        actions={<Button onPress={() => setAttempt((n) => n + 1)}>Riprova</Button>}
      />
    );
  }
  return (
    <EmptyState
      headingLevel={3}
      icon={<Inbox />}
      title="Nessuna attività in programma"
      description="Il caricamento è riuscito, ma non ci sono attività."
      actions={
        <Button variant="secondary" onPress={() => setAttempt(0)}>
          Ripeti la simulazione
        </Button>
      }
    />
  );
}
