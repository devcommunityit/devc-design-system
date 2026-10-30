import { useState } from 'react';
import { Button, Checkbox, CheckboxGroup, DialogTrigger, Drawer, Inline, Stack, Text } from '@dev-community/ui';

export function Filters() {
  const [applied, setApplied] = useState<string[]>([]);
  const [draft, setDraft] = useState<string[]>([]);
  return (
    <Stack gap={2}>
      <DialogTrigger onOpenChange={(open) => open && setDraft(applied)}>
        <Button variant="secondary">Filtri{applied.length ? ` (${applied.length})` : ''}</Button>
        <Drawer
          title="Filtri"
          footer={({ close }) => (
            <>
              <Button variant="secondary" onPress={() => setDraft([])}>
                Azzera
              </Button>
              <Button
                onPress={() => {
                  setApplied(draft);
                  close();
                }}
              >
                Applica
              </Button>
            </>
          )}
        >
          <CheckboxGroup label="Stato" value={draft} onChange={setDraft}>
            <Checkbox value="attivo">Attivo</Checkbox>
            <Checkbox value="sospeso">Sospeso</Checkbox>
            <Checkbox value="archiviato">Archiviato</Checkbox>
          </CheckboxGroup>
        </Drawer>
      </DialogTrigger>
      <Text>Filtri applicati: {applied.length ? applied.join(', ') : 'nessuno'}</Text>
    </Stack>
  );
}

export function Placements() {
  return (
    <Inline gap={2} wrap>
      <DialogTrigger>
        <Button variant="secondary">Inizio</Button>
        <Drawer title="Pannello iniziale" placement="start">
          <Text>Si apre dal lato iniziale (sinistra in LTR, destra in RTL).</Text>
        </Drawer>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary">Fine</Button>
        <Drawer title="Pannello finale" placement="end">
          <Text>Lato finale.</Text>
        </Drawer>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary">Basso (sheet)</Button>
        <Drawer title="Bottom sheet" placement="bottom">
          <Text>Adatto a mobile.</Text>
        </Drawer>
      </DialogTrigger>
    </Inline>
  );
}