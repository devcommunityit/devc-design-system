import { useState } from 'react';
import { Globe } from 'lucide-react';
import { ListBoxItem, ListBoxSection, Select, Stack, Text, type Key } from '@devcommunityit/ui';

const roles = [
  { id: 'viewer', name: 'Lettore', description: 'Può solo consultare' },
  { id: 'editor', name: 'Editor', description: 'Può modificare i contenuti' },
  { id: 'admin', name: 'Amministratore', description: 'Accesso completo' },
];

export function Basic() {
  return (
    <Select label="Ruolo" placeholder="Seleziona un ruolo" items={roles}>
      {(role) => (
        <ListBoxItem id={role.id} description={role.description} textValue={role.name}>
          {role.name}
        </ListBoxItem>
      )}
    </Select>
  );
}

export function Controlled() {
  const [value, setValue] = useState<Key | null>('it');
  return (
    <Stack gap={2}>
      <Select label="Lingua" value={value} onChange={setValue} startAdornment={<Globe aria-hidden="true" size={16} />}>
        <ListBoxItem id="it">Italiano</ListBoxItem>
        <ListBoxItem id="en">English</ListBoxItem>
        <ListBoxItem id="ar">العربية</ListBoxItem>
      </Select>
      <Text variant="body-sm" tone="secondary">
        Valore: {value ?? 'nessuno'}
      </Text>
    </Stack>
  );
}

export function Sections() {
  return (
    <Select label="Sede" placeholder="Scegli…">
      <ListBoxSection title="Italia">
        <ListBoxItem id="mi">Milano</ListBoxItem>
        <ListBoxItem id="rm">Roma</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Estero">
        <ListBoxItem id="ber">Berlino</ListBoxItem>
        <ListBoxItem id="lis">Lisbona</ListBoxItem>
      </ListBoxSection>
    </Select>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <Select label="Obbligatorio" placeholder="Seleziona…" isRequired isInvalid errorMessage="Seleziona un ruolo." items={roles}>
        {(role) => <ListBoxItem id={role.id}>{role.name}</ListBoxItem>}
      </Select>
      <Select label="Disabilitato" defaultValue="editor" isDisabled items={roles}>
        {(role) => <ListBoxItem id={role.id}>{role.name}</ListBoxItem>}
      </Select>
    </Stack>
  );
}