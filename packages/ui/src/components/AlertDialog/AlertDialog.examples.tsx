import { useState } from 'react';
import { AlertDialog, Button, DialogTrigger, Stack, Text } from '@dev-community/ui';

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