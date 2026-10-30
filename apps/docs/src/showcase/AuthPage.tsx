import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Alert,
  AuthLayout,
  Button,
  Inline,
  Link,
  LinkButton,
  List,
  ListItem,
  LoginForm,
  PasswordResetForm,
  SignUpForm,
  Stack,
  Text,
} from '@dev-community/ui';
import { Brand } from './chrome';
import { simulateLatency } from './data';

type View = 'accesso' | 'registrazione' | 'recupero';
const BASE = '/showcase/accesso';
const href = (view: View) => (view === 'accesso' ? BASE : `${BASE}?vista=${view}`);

function DemoResult({ children, onReset }: { children: string; onReset: () => void }) {
  return (
    <Stack gap={4}>
      <Alert tone="info" title="Template dimostrativo" live="polite">
        {children}
      </Alert>
      <Inline gap={2} wrap>
        <LinkButton href="/showcase/dashboard">Apri la dashboard dimostrativa</LinkButton>
        <Button variant="secondary" onPress={onReset}>
          Ricomincia
        </Button>
      </Inline>
    </Stack>
  );
}

function SignInView() {
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<string>();
  if (result) return <DemoResult onReset={() => setResult(undefined)}>{result}</DemoResult>;
  return (
    <LoginForm
      error={error}
      forgotPasswordHref={href('recupero')}
      onSubmit={async ({ identifier, password, remember }) => {
        setError(undefined);
        await simulateLatency(600);
        if (password === 'errata') {
          setError('Email o password non corretti. (Simulazione: la password “errata” produce questo errore.)');
          return;
        }
        setResult(
          `Le credenziali di ${identifier} non sono state inviate né verificate${remember ? ' e “Resta collegato” non crea alcuna sessione' : ''}: collega qui il tuo provider di autenticazione.`,
        );
      }}
      footer={
        <Text variant="body-sm">
          Non hai un account? <Link href={href('registrazione')}>Registrati</Link>
        </Text>
      }
    />
  );
}

function SignUpView() {
  const [result, setResult] = useState<string>();
  if (result) return <DemoResult onReset={() => setResult(undefined)}>{result}</DemoResult>;
  return (
    <SignUpForm
      showName
      confirmPassword
      passwordMinLength={12}
      termsLabel="Accetto le condizioni d’uso (testo dimostrativo)"
      onSubmit={async ({ email }) => {
        await simulateLatency(700);
        setResult(`Nessun account è stato creato per ${email}: la registrazione va gestita dal tuo backend.`);
      }}
      footer={
        <Text variant="body-sm">
          Hai già un account? <Link href={href('accesso')}>Accedi</Link>
        </Text>
      }
    />
  );
}

function ResetView() {
  return (
    <PasswordResetForm
      onSubmit={() => simulateLatency(600)}
      successMessage="Simulazione: nessuna email è stata inviata. Un sistema reale risponde sempre allo stesso modo, che l’account esista o no."
      footer={<Link href={href('accesso')}>Torna all’accesso</Link>}
    />
  );
}

const TITLES: Record<View, { title: string; description: string }> = {
  accesso: { title: 'Accedi al portale', description: 'Template dimostrativo: non è un sistema di autenticazione e non invia dati.' },
  registrazione: { title: 'Crea il tuo account', description: 'La password deve contenere almeno 12 caratteri.' },
  recupero: { title: 'Recupera la password', description: 'Inserisci l’email dell’account: riceverai un link per sceglierne una nuova.' },
};

export function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const raw = params.get('vista');
  const view: View = raw === 'registrazione' || raw === 'recupero' ? raw : 'accesso';
  const { title, description } = TITLES[view];
  return (
    <main>
      <AuthLayout
        key={view}
        brand={<Brand />}
        title={title}
        description={description}
        aside={
          <Stack gap={4}>
            <Text variant="headline-sm" as="p">
              Un unico portale per clienti, ordini e richieste.
            </Text>
            <List>
              <ListItem>Dati fittizi e deterministici.</ListItem>
              <ListItem>Nessuna richiesta di rete: i ritardi sono simulati.</ListItem>
              <ListItem>Componenti LoginForm, SignUpForm e PasswordResetForm della libreria.</ListItem>
            </List>
          </Stack>
        }
        footer={
          <Inline gap={3} justify="center" wrap>
            <Link href="/pattern">Documentazione</Link>
            <Button variant="ghost" size="sm" onPress={() => void navigate('/showcase/dashboard')}>
              Continua senza accedere (demo)
            </Button>
          </Inline>
        }
      >
        {view === 'registrazione' ? <SignUpView /> : view === 'recupero' ? <ResetView /> : <SignInView />}
      </AuthLayout>
    </main>
  );
}
