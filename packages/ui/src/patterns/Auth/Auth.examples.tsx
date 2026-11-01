import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import {
  Alert,
  AuthLayout,
  Button,
  Link,
  LoginForm,
  PasswordResetForm,
  RouterProvider,
  SignUpForm,
  Text,
  type LoginFormValues,
} from '@devcommunityit/ui';

/*
 * These examples simulate a server with a local delay. They contain no authentication logic:
 * credentials are never stored or sent anywhere. Wire `onSubmit` to your own auth service.
 */
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type View = 'login' | 'signup' | 'reset';
const routes: Record<string, View> = { '/accedi': 'login', '/registrazione': 'signup', '/password-dimenticata': 'reset' };

/**
 * Full flow: links are routed with RouterProvider to switch view, like a client router would.
 * Demo rule: the password "errata" simulates a rejection from the auth service.
 */
export function SignIn() {
  const [view, setView] = useState<View>('login');
  const [error, setError] = useState<string>();
  const [signedInAs, setSignedInAs] = useState<string>();
  const [providerNote, setProviderNote] = useState<string>();
  const onSubmit = async ({ identifier, password }: LoginFormValues) => {
    setError(undefined);
    await wait(700);
    if (password === 'errata') {
      setError('Email o password non corretti.');
      return;
    }
    setSignedInAs(identifier);
  };
  const navigate = (href: string) => {
    const next = routes[href];
    if (next) setView(next);
  };
  if (signedInAs) {
    return (
      <Alert tone="success" title="Accesso simulato riuscito" actions={<Button size="sm" variant="secondary" onPress={() => setSignedInAs(undefined)}>Ricomincia</Button>}>
        Nessuna sessione è stata creata: l’esempio mostra solo il flusso dell’interfaccia per {signedInAs}.
      </Alert>
    );
  }
  const back = <Link href="/accedi">Torna all’accesso</Link>;
  return (
    <RouterProvider navigate={navigate}>
      {view === 'signup' ? (
        <AuthLayout fullHeight={false} headingLevel={2} title="Crea il tuo account">
          <SignUpForm onSubmit={() => wait(600).then(() => setView('login'))} footer={back} />
        </AuthLayout>
      ) : view === 'reset' ? (
        <AuthLayout fullHeight={false} headingLevel={2} title="Recupera la password">
          <PasswordResetForm onSubmit={() => wait(600)} footer={back} />
        </AuthLayout>
      ) : (
        <AuthLayout
          fullHeight={false}
          headingLevel={2}
          brand={<Text as="span" weight="bold">Acme</Text>}
          title="Accedi"
          description="Usa qualsiasi email valida; la password “errata” simula un errore del server."
          footer={<Text variant="body-sm" tone="secondary">Esempio dimostrativo senza backend.</Text>}
        >
          <LoginForm
            onSubmit={onSubmit}
            error={error}
            forgotPasswordHref="/password-dimenticata"
            providers={
              <>
                <Button variant="secondary" startIcon={<KeyRound />} onPress={() => setProviderNote('Il consumer avvierebbe qui il flusso passkey/SSO del proprio identity provider.')}>
                  Accedi con passkey
                </Button>
                {providerNote ? (
                  <Text variant="body-sm" tone="secondary" role="status">
                    {providerNote}
                  </Text>
                ) : null}
              </>
            }
            footer={
              <Text variant="body-sm">
                Non hai un account? <Link href="/registrazione">Registrati</Link>
              </Text>
            }
          />
        </AuthLayout>
      )}
    </RouterProvider>
  );
}

/** Username-based login (e.g. intranet portals), without “remember me”. */
export function UsernameLogin() {
  const [result, setResult] = useState<string>();
  return (
    <AuthLayout fullHeight={false} headingLevel={2} title="Area riservata">
      <LoginForm
        identifierType="username"
        showRememberMe={false}
        onSubmit={async ({ identifier }) => {
          await wait(500);
          setResult(`Credenziali ricevute per “${identifier}” (nessuna verifica eseguita).`);
        }}
        footer={result ? <Text variant="body-sm" role="status">{result}</Text> : undefined}
      />
    </AuthLayout>
  );
}

/** Registration with name, confirm password and required terms acceptance. */
export function SignUp() {
  const [created, setCreated] = useState<string>();
  return (
    <AuthLayout fullHeight={false} headingLevel={2} title="Crea il tuo account" description="La password deve avere almeno 10 caratteri.">
      {created ? (
        <Alert tone="success" title="Registrazione simulata" actions={<Button size="sm" variant="secondary" onPress={() => setCreated(undefined)}>Ricomincia</Button>}>
          L’interfaccia ha raccolto i dati per {created}. Nessun account è stato creato.
        </Alert>
      ) : (
        <SignUpForm
          showName
          confirmPassword
          passwordMinLength={10}
          termsLabel="Accetto i termini di servizio e l’informativa privacy"
          onSubmit={async ({ email }) => {
            await wait(800);
            setCreated(email);
          }}
        />
      )}
    </AuthLayout>
  );
}

/** Password recovery: neutral confirmation, so the UI does not reveal whether an account exists. */
export function ForgotPassword() {
  return (
    <AuthLayout fullHeight={false} headingLevel={2} title="Recupera la password" description="Ti invieremo un link per impostarne una nuova.">
      <PasswordResetForm
        onSubmit={async () => {
          await wait(600);
        }}
      />
    </AuthLayout>
  );
}
