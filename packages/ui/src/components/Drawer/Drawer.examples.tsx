import { useState } from 'react';
import { AlertDialog, Button, Checkbox, CheckboxGroup, DialogTrigger, Drawer, Inline, Stack, Text } from '@devcommunityit/ui';

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

const orderLines = [
  { id: 'l1', name: 'Monitor 27" QHD', qty: 2, price: '578,00 €' },
  { id: 'l2', name: 'Docking station USB-C con alimentazione da 100 W e tre uscite video', qty: 1, price: '189,90 €' },
  { id: 'l3', name: 'Tastiera wireless', qty: 3, price: '147,00 €' },
];

export function Controlled() {
  const [isOpen, setOpen] = useState(false);
  const [openings, setOpenings] = useState(0);
  return (
    <Stack gap={2} align="start">
      <Button
        variant="secondary"
        onPress={() => {
          setOpen(true);
          setOpenings((n) => n + 1);
        }}
      >
        Dettagli ordine
      </Button>
      <Text>
        Pannello {isOpen ? 'aperto' : 'chiuso'} · aperture: {openings}
      </Text>
      <Drawer
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Ordine n. 4821"
        description="Effettuato il 12 marzo 2025 · 3 articoli"
        footer={<Button onPress={() => setOpen(false)}>Chiudi dettagli</Button>}
      >
        <Stack gap={3}>
          {orderLines.map((line) => (
            <Inline key={line.id} gap={3} justify="between" align="start">
              <Text style={{ minInlineSize: 0, overflowWrap: 'anywhere' }}>
                {line.qty} × {line.name}
              </Text>
              <Text weight="bold">{line.price}</Text>
            </Inline>
          ))}
          <Text tone="secondary">Spedizione con corriere espresso, consegna prevista entro 48 ore lavorative.</Text>
        </Stack>
      </Drawer>
    </Stack>
  );
}

const initialMembers = ['Giulia Verdi', 'Luca Neri', 'Sara Gallo'];

export function NestedConfirm() {
  const [members, setMembers] = useState(initialMembers);
  const [lastRemoved, setLastRemoved] = useState<string | null>(null);
  return (
    <Stack gap={2} align="start">
      <DialogTrigger>
        <Button variant="secondary">Gestisci team ({members.length})</Button>
        <Drawer
          title="Membri del team"
          description="La rimozione chiede conferma con un AlertDialog sopra al pannello."
          footer={
            <Button variant="secondary" isDisabled={members.length === initialMembers.length} onPress={() => setMembers(initialMembers)}>
              Ripristina demo
            </Button>
          }
        >
          {members.length ? (
            <Stack gap={2}>
              {members.map((name) => (
                <Inline key={name} gap={2} justify="between" align="center">
                  <Text>{name}</Text>
                  <DialogTrigger>
                    <Button size="sm" variant="ghost" aria-label={`Rimuovi ${name}`}>
                      Rimuovi
                    </Button>
                    <AlertDialog
                      title={`Rimuovere ${name}?`}
                      tone="danger"
                      confirmLabel="Rimuovi"
                      onConfirm={() => {
                        setMembers((prev) => prev.filter((m) => m !== name));
                        setLastRemoved(name);
                      }}
                    >
                      {name} perderà l’accesso ai progetti del team. Potrai invitarlo di nuovo in seguito.
                    </AlertDialog>
                  </DialogTrigger>
                </Inline>
              ))}
            </Stack>
          ) : (
            <Text tone="secondary">Nessun membro nel team.</Text>
          )}
        </Drawer>
      </DialogTrigger>
      <Text>Ultima rimozione: {lastRemoved ?? 'nessuna'}</Text>
    </Stack>
  );
}