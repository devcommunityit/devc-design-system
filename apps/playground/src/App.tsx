import { useState } from 'react';
import {
  Alert,
  BarChart,
  BulkActionBar,
  Button,
  Card,
  ChatMessage,
  Container,
  Dialog,
  DialogTrigger,
  Footer,
  Header,
  Heading,
  KpiCard,
  LocaleProvider,
  LoginForm,
  MenuItem,
  PromptComposer,
  PromptSuggestions,
  PublishStatus,
  Radio,
  RadioGroup,
  ResponseFeedback,
  SeoPreview,
  SourceList,
  Stack,
  Text,
  ThemeProvider,
  ToastProvider,
  UserMenu,
  useTheme,
  useToast,
  type Key,
  type LoginFormValues,
  type PublicationStatus,
  type ThemeMode,
} from '@devcommunityit/ui';
// Server-safe entry: no React, no DOM.
import { createTheme, contrastRatio } from '@devcommunityit/ui/theme';

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

function AiAndContent() {
  const [prompt, setPrompt] = useState('');
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState<PublicationStatus>('draft');
  return (
    <Card>
      <Stack gap={4}>
        <Heading level={2} id="consumer-ai">AI e contenuti dal pacchetto compilato</Heading>
        <Text>Demo locale: nessun modello AI o CMS collegato.</Text>
        <PromptSuggestions
          items={[{ id: 'summary', label: 'Riassumi la pagina', prompt: 'Riassumi questa pagina' }]}
          onAction={(item) => setPrompt(item.prompt)}
        />
        <PromptComposer
          label="Richiesta consumer"
          value={prompt}
          onChange={setPrompt}
          onSend={(text) => { setRequest(text); setPrompt(''); }}
        />
        <ChatMessage footer={
          <>
            <SourceList sources={[{ id: 'local', title: 'Esempio locale', href: '#consumer-ai' }]} />
            <ResponseFeedback />
          </>
        }>
          {request ? `Richiesta locale: ${request}` : 'Nessuna richiesta inviata.'}
        </ChatMessage>
        <PublishStatus status={status} />
        <BulkActionBar count={1}>
          <Button size="sm" isDisabled={status === 'published'} onPress={() => setStatus('published')}>Pubblica pagina locale</Button>
        </BulkActionBar>
        <SeoPreview title="Anteprima consumer" url="https://example.test/consumer" description="Metadati solo dimostrativi." />
      </Stack>
    </Card>
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

            <KpiCard label="Ordini" value={1312} trend={{ direction: 'up', value: '+4%' }} sparkline={[1180, 1220, 1250, 1290, 1312]} />
            <BarChart
              title="Ordini per trimestre"
              categories={['T1', 'T2', 'T3', 'T4']}
              series={[
                { id: 'nord', label: 'Nord', data: [120, 140, 135, 160] },
                { id: 'sud', label: 'Sud', data: [80, 95, 110, 105] },
              ]}
            />
            <AiAndContent />

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
