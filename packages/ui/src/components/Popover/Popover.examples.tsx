import { useState } from 'react';
import { Button, IconButton, Inline, Popover, PopoverTrigger, Stack, Switch, Text, TextField } from '@devcommunityit/ui';
import { HelpCircle, Info, Pencil } from 'lucide-react';

export function Basic() {
  return (
    <PopoverTrigger>
      <IconButton label="Informazioni sul piano" icon={<Info />} variant="ghost" />
      <Popover title="Piano Business" placement="bottom start">
        <Text>Include 25 utenti, 100 GB di spazio e supporto prioritario.</Text>
      </Popover>
    </PopoverTrigger>
  );
}

export function Interactive() {
  const [compact, setCompact] = useState(false);
  return (
    <PopoverTrigger>
      <Button variant="secondary">Opzioni vista</Button>
      <Popover title="Opzioni vista">
        {({ close }) => (
          <Stack gap={3}>
            <Switch isSelected={compact} onChange={setCompact}>
              Righe compatte
            </Switch>
            <Button size="sm" onPress={close}>
              Fatto
            </Button>
          </Stack>
        )}
      </Popover>
    </PopoverTrigger>
  );
}

export function Controlled() {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState('Report trimestrale');
  const [draft, setDraft] = useState(name);
  const trimmed = draft.trim();
  return (
    <Stack gap={2} align="start">
      <PopoverTrigger
        isOpen={isOpen}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) setDraft(name);
        }}
      >
        <Button variant="outline" startIcon={<Pencil />}>
          Rinomina
        </Button>
        <Popover title="Rinomina file" placement="bottom start">
          <Stack gap={3}>
            <TextField label="Nome del file" value={draft} onChange={setDraft} isRequired />
            <Inline gap={2} justify="end">
              <Button size="sm" variant="ghost" onPress={() => setOpen(false)}>
                Annulla
              </Button>
              <Button
                size="sm"
                isDisabled={trimmed === '' || trimmed === name}
                onPress={() => {
                  setName(trimmed);
                  setOpen(false);
                }}
              >
                Salva nome
              </Button>
            </Inline>
          </Stack>
        </Popover>
      </PopoverTrigger>
      <Text variant="body-sm" tone="secondary">
        Nome attuale: {name} · popover {isOpen ? 'aperto' : 'chiuso'}
      </Text>
    </Stack>
  );
}

export function WithoutTitle() {
  return (
    <PopoverTrigger>
      <Button variant="ghost" startIcon={<HelpCircle />}>
        Come calcoliamo il prezzo?
      </Button>
      <Popover aria-label="Calcolo del prezzo" showArrow={false} placement="bottom start">
        {({ close }) => (
          <Stack gap={2} style={{ maxInlineSize: '22rem' }}>
            <Text>
              Il canone mensile comprende 5 utenti e 50 GB di spazio. Ogni utente aggiuntivo costa 4 € al mese e ogni 10 GB in più
              costano 2 € al mese; i prezzi sono IVA esclusa e fatturati in anticipo.
            </Text>
            <Text tone="secondary">Con la fatturazione annuale ottieni due mesi gratuiti sul totale.</Text>
            <Button size="sm" variant="secondary" onPress={close}>
              Ho capito
            </Button>
          </Stack>
        )}
      </Popover>
    </PopoverTrigger>
  );
}