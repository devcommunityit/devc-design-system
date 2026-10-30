import { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Alert, Button, Form, Inline, Link, List, Stack, TextField } from '@dev-community/ui';

export function Tones() {
  return (
    <Stack gap={3}>
      <Alert tone="info" title="Nuova versione disponibile">
        Le note di rilascio descrivono le modifiche.
      </Alert>
      <Alert tone="success" title="Profilo aggiornato" />
      <Alert tone="warning" title="Spazio quasi esaurito">
        Hai usato il 92% dello spazio disponibile.
      </Alert>
      <Alert tone="danger" title="Impossibile salvare">
        Correggi i 2 campi evidenziati e riprova.
      </Alert>
    </Stack>
  );
}

export function WithActions() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert
      tone="info"
      variant="outline"
      title="Verifica il tuo indirizzo email"
      actions={
        <>
          <Button size="sm" onPress={() => setVisible(false)}>
            Ho verificato
          </Button>
          <Link href="#help">Non hai ricevuto l’email?</Link>
        </>
      }
      onDismiss={() => setVisible(false)}
    >
      Ti abbiamo inviato un link di conferma.
    </Alert>
  ) : (
    <Button variant="secondary" onPress={() => setVisible(true)}>
      Mostra di nuovo
    </Button>
  );
}

export function Live() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap={3}>
      <Button onPress={() => setSaved(true)} isDisabled={saved}>
        Salva bozza
      </Button>
      {saved ? (
        <Alert tone="success" live="polite" onDismiss={() => setSaved(false)}>
          Bozza salvata localmente (simulazione).
        </Alert>
      ) : null}
    </Stack>
  );
}
export function ContentVariants() {
  return (
    <Stack gap={3}>
      <Alert tone="info">Messaggio senza titolo: il tono è comunque annunciato da un prefisso nascosto.</Alert>
      <Alert tone="warning" variant="outline" icon={<CalendarClock />} title="Icona personalizzata">
        La sessione scade tra 5 minuti. Salva il lavoro per non perdere le modifiche.
      </Alert>
      <Alert tone="success" icon={null} title="Senza icona" />
      <Alert tone="danger" title="Import failed (EN)" lang="en">
        Row 1,204 of “clienti-2025-export-completo-definitivo-v3.csv” contains an invalid VAT number; the remaining rows were not imported.
      </Alert>
    </Stack>
  );
}

export function ErrorSummary() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const errors = [
    ...(name.trim() === '' ? [{ field: 'name', text: 'Inserisci il nome.' }] : []),
    ...(!email.includes('@') ? [{ field: 'email', text: 'Inserisci un’email valida.' }] : []),
  ];
  const showSummary = submitted && errors.length > 0;
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Stack gap={4}>
        {showSummary ? (
          <Alert tone="danger" live="assertive" title={`Il modulo contiene ${errors.length} ${errors.length === 1 ? 'errore' : 'errori'}`}>
            <List>
              {errors.map((err) => (
                <li key={err.field}>{err.text}</li>
              ))}
            </List>
          </Alert>
        ) : null}
        {submitted && errors.length === 0 ? (
          <Alert tone="success" live="polite" title="Dati validi">
            Invio simulato in locale: nessun dato lascia il browser.
          </Alert>
        ) : null}
        <TextField label="Nome" value={name} onChange={setName} isInvalid={submitted && name.trim() === ''} errorMessage="Inserisci il nome." />
        <TextField label="Email" value={email} onChange={setEmail} isInvalid={submitted && !email.includes('@')} errorMessage="Inserisci un’email valida." />
        <Inline gap={2}>
          <Button type="submit">Invia</Button>
          <Button
            variant="ghost"
            onPress={() => {
              setName('');
              setEmail('');
              setSubmitted(false);
            }}
          >
            Azzera
          </Button>
        </Inline>
      </Stack>
    </Form>
  );
}
