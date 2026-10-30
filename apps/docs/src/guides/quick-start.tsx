import { Alert, Link } from '@dev-community/ui';
import { Code, DocSection } from '../components/Doc';

export default function QuickStart() {
  return (
    <>
      <DocSection title="1. Installa il pacchetto">
        <p>
          React e React DOM (18.3 o 19) sono peer dependency: usa quelli già presenti nell’applicazione. Il pacchetto non è pubblicato su un registry
          pubblico; vedi <Link href="/guide/installazione">Installazione</Link> per tarball e registry privati.
        </p>
        <Code language="bash">{`npm install @dev-community/ui`}</Code>
      </DocSection>

      <DocSection title="2. Importa gli stili una volta">
        <p>
          <code>styles.css</code> contiene token e stili dei componenti. Non contiene reset globali: se l’applicazione non ne ha uno, aggiungi anche{' '}
          <code>reset.css</code> (opzionale, in un cascade layer).
        </p>
        <Code>{`
// main.tsx
import '@dev-community/ui/styles.css';
// import '@dev-community/ui/reset.css'; // opzionale
`}</Code>
      </DocSection>

      <DocSection title="3. Avvolgi l’applicazione nel provider">
        <p>
          <code>ThemeProvider</code> applica token, modalità e densità al proprio sottoalbero. <code>surface</code> colora sfondo e testo del contenitore.
          La persistenza è disattivata per impostazione predefinita.
        </p>
        <Code>{`
import { createRoot } from 'react-dom/client';
import { LocaleProvider, ThemeProvider } from '@dev-community/ui';
import '@dev-community/ui/styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <LocaleProvider locale="it-IT">
    <ThemeProvider defaultMode="system" defaultTheme="aurora" persistence surface>
      <App />
    </ThemeProvider>
  </LocaleProvider>,
);
`}</Code>
      </DocSection>

      <DocSection title="4. Il primo componente">
        <Code>{`
import { Button, Form, Stack, TextField, useToast } from '@dev-community/ui';

export function Newsletter() {
  const toast = useToast();
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        const email = new FormData(event.currentTarget).get('email');
        toast.show({ title: 'Iscrizione registrata', description: String(email), tone: 'success' });
      }}
    >
      <Stack gap={3}>
        <TextField label="Email" description="Una sola email al mese." name="email" type="email" autoComplete="email" isRequired />
        <Button type="submit">Iscriviti</Button>
      </Stack>
    </Form>
  );
}
`}</Code>
        <Alert tone="info" title="Toast">
          <code>useToast</code> richiede un <code>ToastProvider</code> nell’albero: vedi la pagina <Link href="/componenti/toast">Toast</Link>.
        </Alert>
      </DocSection>

      <DocSection title="Passi successivi">
        <ul>
          <li>
            <Link href="/guide/temi">Temi</Link>: preset, modalità, densità e temi personalizzati con <code>createTheme</code>.
          </li>
          <li>
            <Link href="/guide/integrazione">Integrazione nei portali</Link>: router, provider annidati e coesistenza con CSS esistenti.
          </li>
          <li>
            <Link href="/componenti">Catalogo componenti</Link> e <Link href="/pattern">pattern</Link> (header, footer, accesso, menu utente).
          </li>
        </ul>
      </DocSection>
    </>
  );
}
