import { useState } from 'react';
import { AlertDialog, Button, DialogTrigger, Stack, Switch, Text, TextField } from '@devcommunityit/ui';

export function Destructive() {
  const [deleted, setDeleted] = useState(false);
  return (
    <Stack gap={2}>
      <DialogTrigger>
        <Button variant="danger" isDisabled={deleted}>
          Elimina progetto
        </Button>
        <AlertDialog title="Eliminare il progetto?" tone="danger" confirmLabel="Elimina" onConfirm={() => setDeleted(true)}>
          Il progetto «Portale clienti» e i suoi 24 file verranno eliminati definitivamente.
        </AlertDialog>
      </DialogTrigger>
      {deleted ? (
        <Stack gap={1}>
          <Text role="status">Progetto eliminato (simulazione locale).</Text>
          <Button variant="secondary" onPress={() => setDeleted(false)}>
            Ripristina demo
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

export function AsyncConfirm() {
  const [result, setResult] = useState<string | null>(null);
  return (
    <Stack gap={2}>
      <DialogTrigger>
        <Button>Pubblica</Button>
        <AlertDialog
          title="Pubblicare le modifiche?"
          confirmLabel="Pubblica"
          onConfirm={() =>
            new Promise<void>((resolve) => {
              // Simulated async work; the dialog stays open and shows a pending state.
              setTimeout(() => {
                setResult('Pubblicazione completata (simulata).');
                resolve();
              }, 800);
            })
          }
          onCancel={() => setResult('Pubblicazione annullata.')}
        >
          Le modifiche saranno visibili a tutti gli utenti.
        </AlertDialog>
      </DialogTrigger>
      {result ? <Text role="status">{result}</Text> : null}
    </Stack>
  );
}

export function Controlled() {
  const [isOpen, setOpen] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [outcome, setOutcome] = useState('nessuna scelta');
  return (
    <Stack gap={3} align="start">
      <Switch isSelected={dirty} onChange={setDirty}>
        Modifiche non salvate
      </Switch>
      <Button
        variant="outline"
        onPress={() => {
          if (dirty) setOpen(true);
          else setOutcome('Editor chiuso subito: nessuna modifica da perdere.');
        }}
      >
        Chiudi editor
      </Button>
      <Text>
        Dialogo {isOpen ? 'aperto' : 'chiuso'} · Esito: {outcome}
      </Text>
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Uscire senza salvare?"
        confirmLabel="Esci senza salvare"
        cancelLabel="Continua a modificare"
        onConfirm={() => {
          setDirty(false);
          setOutcome('Modifiche scartate.');
        }}
        onCancel={() => setOutcome('Sei rimasto nell’editor.')}
      >
        Le modifiche al documento «Verbale riunione 4 marzo» andranno perse.
      </AlertDialog>
    </Stack>
  );
}

const REPOSITORY = 'acme/portale';

export function TypeToConfirm() {
  const [typed, setTyped] = useState('');
  const [deleted, setDeleted] = useState(false);
  return (
    <Stack gap={2} align="start">
      <DialogTrigger
        onOpenChange={(open) => {
          if (open) setTyped('');
        }}
      >
        <Button variant="danger" isDisabled={deleted}>
          Elimina repository
        </Button>
        <AlertDialog
          title={`Eliminare ${REPOSITORY}?`}
          tone="danger"
          confirmLabel="Elimina repository"
          isConfirmDisabled={typed !== REPOSITORY}
          onConfirm={() => setDeleted(true)}
        >
          <Stack gap={3}>
            <Text>Codice, issue e wiki verranno eliminati definitivamente. L’azione non si può annullare.</Text>
            <TextField label={`Digita ${REPOSITORY} per confermare`} value={typed} onChange={setTyped} autoComplete="off" />
          </Stack>
        </AlertDialog>
      </DialogTrigger>
      {deleted ? (
        <Stack gap={1} align="start">
          <Text role="status">Repository eliminato (simulazione locale).</Text>
          <Button variant="secondary" onPress={() => setDeleted(false)}>
            Ripristina demo
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

export function RetryAfterError() {
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  return (
    <Stack gap={2} align="start">
      <DialogTrigger
        onOpenChange={(open) => {
          if (open) setError(null);
        }}
      >
        <Button isDisabled={done}>Invia al cliente</Button>
        <AlertDialog
          title="Inviare il preventivo?"
          confirmLabel="Invia"
          onConfirm={() => {
            const attempt = attempts + 1;
            setAttempts(attempt);
            return new Promise<void>((resolve, reject) => {
              // Simulated request: the first attempt fails, the dialog stays open and shows the error.
              setTimeout(() => {
                if (attempt === 1) {
                  setError('Connessione al server non riuscita. Riprova.');
                  reject(new Error('Invio non riuscito'));
                } else {
                  setDone(true);
                  resolve();
                }
              }, 600);
            });
          }}
        >
          <Stack gap={2}>
            <Text>Il preventivo n. 118 verrà inviato a ufficio.acquisti@cliente.example.</Text>
            {error ? (
              <Text tone="danger" role="alert">
                {error}
              </Text>
            ) : null}
          </Stack>
        </AlertDialog>
      </DialogTrigger>
      <Text>
        Tentativi: {attempts} · {done ? 'preventivo inviato (simulato).' : 'non ancora inviato.'}
      </Text>
      {done ? (
        <Button
          variant="secondary"
          onPress={() => {
            setDone(false);
            setAttempts(0);
          }}
        >
          Ripristina demo
        </Button>
      ) : null}
    </Stack>
  );
}