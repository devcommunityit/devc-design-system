import { useState } from 'react';
import { Alert, Button, Link, Stack } from '@dev-community/ui';

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