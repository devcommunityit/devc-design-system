import { FileQuestion, Inbox, Lock, RefreshCw, SearchX, ServerCrash } from 'lucide-react';
import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Grid,
  Heading,
  LinkButton,
  SearchInput,
  Skeleton,
  Stack,
  Text,
} from '@devcommunityit/ui';

export function NotFoundTemplate({ headingLevel = 1 }: { headingLevel?: 1 | 2 | 3 }) {
  return (
    <EmptyState
      headingLevel={headingLevel}
      size="lg"
      icon={<FileQuestion />}
      title="Pagina non trovata"
      description="L’indirizzo potrebbe essere errato o la pagina è stata spostata. Errore 404."
      actions={
        <>
          <LinkButton href="/showcase/dashboard">Vai alla dashboard</LinkButton>
          <LinkButton href="/" variant="outline">
            Documentazione
          </LinkButton>
        </>
      }
    />
  );
}

const savedViews = ['Ordini aperti', 'Fatture scadute', 'Clienti in prova', 'Rinnovi del mese', 'Ticket di assistenza'];

/** Simulated service: fails on the first two attempts, then answers. */
function ServerErrorDemo() {
  const [state, setState] = useState<'error' | 'loading' | 'ok'>('error');
  const [attempts, setAttempts] = useState(0);
  const retry = () => {
    setState('loading');
    const attempt = attempts + 1;
    setAttempts(attempt);
    setTimeout(() => setState(attempt >= 2 ? 'ok' : 'error'), 700);
  };
  if (state === 'loading') {
    return (
      <Stack gap={3} aria-busy="true">
        <Skeleton shape="text" width="60%" />
        <Skeleton shape="rect" height="5rem" />
      </Stack>
    );
  }
  if (state === 'ok') {
    return (
      <Alert tone="success" title="Servizio di nuovo disponibile">
        Dati caricati al tentativo {attempts}.{' '}
        <Button
          size="sm"
          variant="ghost"
          onPress={() => {
            setAttempts(0);
            setState('error');
          }}
        >
          Ripeti la demo
        </Button>
      </Alert>
    );
  }
  return (
    <EmptyState
      headingLevel={3}
      icon={<ServerCrash />}
      title="Qualcosa è andato storto"
      description={`Il servizio non risponde (errore 500 simulato${attempts ? `, tentativo ${attempts}` : ''}). Il riprova riesce al secondo tentativo.`}
      actions={
        <Button startIcon={<RefreshCw />} onPress={retry}>
          Riprova
        </Button>
      }
    />
  );
}

function NoResultsDemo() {
  const [query, setQuery] = useState('zzz');
  const results = savedViews.filter((f) => f.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Stack gap={3}>
      <SearchInput label="Cerca nelle viste salvate" value={query} onChange={setQuery} />
      {results.length ? (
        <Stack as="ul" gap={1} className="sc-plain-list">
          {results.map((r) => (
            <li key={r}>
              <Text>{r}</Text>
            </li>
          ))}
        </Stack>
      ) : (
        <EmptyState
          headingLevel={3}
          size="sm"
          icon={<SearchX />}
          title="Nessun risultato"
          description={`Nessuna vista corrisponde a “${query}”.`}
          actions={
            <Button variant="outline" onPress={() => setQuery('')}>
              Cancella ricerca
            </Button>
          }
        />
      )}
    </Stack>
  );
}

function NoDataDemo() {
  const [items, setItems] = useState<string[]>([]);
  return items.length ? (
    <Stack gap={2}>
      {items.map((i) => (
        <Text key={i}>{i}</Text>
      ))}
      <Button variant="ghost" size="sm" onPress={() => setItems([])}>
        Torna allo stato vuoto
      </Button>
    </Stack>
  ) : (
    <EmptyState
      headingLevel={3}
      size="sm"
      icon={<Inbox />}
      title="Ancora nessun progetto"
      description="I progetti che crei compariranno qui."
      actions={<Button onPress={() => setItems(['Progetto di esempio 1'])}>Crea un progetto di esempio</Button>}
    />
  );
}

export function ErrorStates() {
  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Heading level={1} size="headline-md">
          Errori e stati vuoti
        </Heading>
        <Text tone="secondary">Template per gli stati non felici. Le azioni funzionano davvero sui dati locali di ciascun esempio.</Text>
      </Stack>
      <Grid columns={{ base: 1, lg: 2 }} gap={4}>
        <Card variant="outlined">
          <CardHeader headingLevel={2} title="404 — Pagina non trovata" subtitle="Usato anche per gli indirizzi /showcase/* sconosciuti." />
          <CardBody>
            <NotFoundTemplate headingLevel={3} />
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardHeader headingLevel={2} title="500 — Errore del servizio" subtitle="Con nuovo tentativo." />
          <CardBody>
            <ServerErrorDemo />
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardHeader headingLevel={2} title="403 — Accesso negato" />
          <CardBody>
            <EmptyState
              headingLevel={3}
              icon={<Lock />}
              title="Non hai accesso a questa sezione"
              description="Chiedi a un amministratore di assegnarti il ruolo “Amministrazione”."
              actions={<LinkButton href="/showcase/account">Vai al tuo account</LinkButton>}
            />
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardHeader headingLevel={2} title="Nessun dato" />
          <CardBody>
            <NoDataDemo />
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardHeader headingLevel={2} title="Nessun risultato" />
          <CardBody>
            <NoResultsDemo />
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}
