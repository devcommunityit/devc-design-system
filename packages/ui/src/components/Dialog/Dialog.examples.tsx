import { useState } from 'react';
import { Button, Dialog, DialogTrigger, Stack, Text, TextField } from '@devcommunityit/ui';

export function Basic() {
  return (
    <DialogTrigger>
      <Button>Apri dialogo</Button>
      <Dialog title="Informazioni" description="Dettagli sulla versione corrente.">
        <Text>Versione 0.1.0. Tutti i servizi sono operativi.</Text>
      </Dialog>
    </DialogTrigger>
  );
}

export function FormDialog() {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <Stack gap={2}>
      <DialogTrigger>
        <Button>Rinomina progetto</Button>
        <Dialog
          title="Rinomina progetto"
          footer={({ close }) => (
            <>
              <Button variant="secondary" onPress={close}>
                Annulla
              </Button>
              <Button
                isDisabled={name.trim() === ''}
                onPress={() => {
                  setSaved(name.trim());
                  close();
                }}
              >
                Salva
              </Button>
            </>
          )}
        >
          <TextField label="Nome" value={name} onChange={setName} isRequired />
        </Dialog>
      </DialogTrigger>
      {saved ? <Text role="status">Nuovo nome: {saved}</Text> : null}
    </Stack>
  );
}

export function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Apri (controllato)</Button>
      <Dialog title="Stato controllato" isOpen={open} onOpenChange={setOpen} footer={<Button onPress={() => setOpen(false)}>Chiudi</Button>}>
        <Text>Lo stato di apertura è gestito dal componente padre.</Text>
      </Dialog>
    </>
  );
}

export function LongContent() {
  return (
    <DialogTrigger>
      <Button variant="secondary">Termini di servizio</Button>
      <Dialog title="Termini di servizio" size="lg">
        <Stack gap={3}>
          {Array.from({ length: 12 }, (_, i) => (
            <Text key={i}>
              {i + 1}. Il contenuto lungo scorre all’interno del dialogo: intestazione e azioni restano visibili anche su viewport
              piccole.
            </Text>
          ))}
        </Stack>
      </Dialog>
    </DialogTrigger>
  );
}

export function Nested() {
  return (
    <DialogTrigger>
      <Button variant="secondary">Apri primo livello</Button>
      <Dialog title="Primo livello">
        <Stack gap={3}>
          <Text>Escape chiude solo il dialogo più in alto.</Text>
          <DialogTrigger>
            <Button>Apri secondo livello</Button>
            <Dialog title="Secondo livello" size="sm">
              <Text>Dialogo annidato.</Text>
            </Dialog>
          </DialogTrigger>
        </Stack>
      </Dialog>
    </DialogTrigger>
  );
}