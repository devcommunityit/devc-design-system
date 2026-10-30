import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
  Dialog,
  DialogTrigger,
  Footer,
  Header,
  Heading,
  LocaleProvider,
  LoginForm,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Text,
  ThemeProvider,
  ToastProvider,
  UserMenu,
  useTheme,
  useToast,
  type Key,
  type LoginFormValues,
  type ThemeMode,
} from '@dev-community/ui';
// Server-safe entry: no React, no DOM.
import { createTheme, contrastRatio } from '@dev-community/ui/theme';

const acme = createTheme({
  name: 'acme',
  label: 'Acme',
  extends: 'graphite',
  seeds: { brand: '#0f766e' },
  tokens: { 'radius.md': '0.25rem' },
});

const MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
const isMode = (value: string): value is ThemeMode => (MODES as readonly string[]).includes(value);

function ModeSwitch() {
  const { mode, setMode, resolvedScheme } = useTheme();
  return (
    <Stack gap={1}>
      <RadioGroup
        label="Modalità colore"
        orientation="horizontal"
        value={mode}
        onChange={(value) => {
          if (isMode(value)) setMode(value);
        }}
      >
        <Radio value="light">Chiaro</Radio>
        <Radio value="dark">Scuro</Radio>
        <Radio value="system">Sistema</Radio>
      </RadioGroup>
      <Text tone="secondary" data-testid="resolved-scheme">
        Schema risolto: {resolvedScheme}
      </Text>
    </Stack>
  );
}

function Account({ onSignOut }: { onSignOut: () => void }) {
  const [lastAction, setLastAction] = useState('nessuna');
  return (
    <>
      <UserMenu
        user={{ name: 'Giulia Bianchi', email: 'giulia@acme.example', role: 'Amministratrice' }}
        onAction={(key: Key) => setLastAction(String(key))}
        onSignOut={onSignOut}
      >
        <MenuItem id="profile">Profilo</MenuItem>
        <MenuItem id="settings">Impostazioni</MenuItem>
      </UserMenu>
      <Text tone="secondary" data-testid="last-action">
        Ultima azione: {lastAction}
      </Text>
    </>
  );
}

function ToastButton() {
  const toast = useToast();
  return (
    <Button variant="secondary" onPress={() => toast.show({ title: 'Preferenze salvate', tone: 'success' })}>
      Mostra notifica
    </Button>
  );
}

function Content() {
  const [user, setUser] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);
  const brandContrast = contrastRatio(acme.colors.light['action.primary'], acme.colors.light['action.primary-foreground']);

  return (
    <>
      <Header
        sticky={false}
        brand={<Text as="span" weight="bold">Playground</Text>}
        actions={user ? <Account onSignOut={() => setUser(null)} /> : <Text tone="secondary">Ospite</Text>}
      />
      <main>
        <Container size="lg">
          <Stack gap={6} style={{ paddingBlock: 'var(--dc-space-6)' }}>
            <Heading level={1}>Consumer del pacchetto compilato</Heading>
            <ModeSwitch />

            <Stack gap={2}>
              <Button onPress={() => setCounter((c) => c + 1)}>Incrementa</Button>
              <Text role="status" data-testid="counter">
                Conteggio: {counter}
              </Text>
              <ToastButton />
            </Stack>

            <Card data-testid="login-card">
              <Stack gap={3}>
                <Heading level={2}>Accesso dimostrativo</Heading>
                {user ? (
                  <Alert tone="success" title="Accesso simulato">
                    Utente: {user}. Nessuna verifica reale: l’autenticazione è responsabilità dell’applicazione.
                  </Alert>
                ) : (
                  <LoginForm onSubmit={(values: LoginFormValues) => setUser(values.identifier)} showRememberMe={false} />
                )}
              </Stack>
            </Card>

            <ThemeProvider theme={acme} themes={[acme]} defaultMode="dark" persistence={false} surface data-testid="nested-provider">
              <Card variant="filled">
                <Stack gap={2}>
                  <Heading level={2}>Tema annidato “{acme.label}”</Heading>
                  <Text>Contrasto action.primary / action.primary-foreground: {brandContrast === null ? 'n/d' : `${brandContrast.toFixed(2)}:1`}</Text>
                  <DialogTrigger>
                    <Button>Apri dialogo annidato</Button>
                    <Dialog title="Dialogo nel tema Acme" description="Il portal eredita palette e modalità del provider di origine.">
                      <Text>Contenuto del dialogo.</Text>
                    </Dialog>
                  </DialogTrigger>
                </Stack>
              </Card>
            </ThemeProvider>
          </Stack>
        </Container>
      </main>
      <Footer
        brand={<Text weight="bold">Playground</Text>}
        columns={[{ title: 'Risorse', links: [{ label: 'Documentazione', href: '#docs' }] }]}
        legal="© 2026 Esempio"
      />
    </>
  );
}

export function App() {
  return (
    <LocaleProvider locale="it-IT">
      <ThemeProvider defaultMode="light" persistence={{ key: 'dc-playground' }} applyToDocument>
        <ToastProvider>
          <Content />
        </ToastProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
