import { useState } from 'react';
import { NativeSelect, Stack, Text } from '@dev-community/ui';

const provinces = [
  { value: 'BO', label: 'Bologna' },
  { value: 'MI', label: 'Milano' },
  { value: 'NA', label: 'Napoli' },
  { value: 'RM', label: 'Roma' },
  { value: 'TO', label: 'Torino' },
];

export function Basic() {
  return <NativeSelect label="Provincia" placeholder="Seleziona…" options={provinces} defaultValue="" isRequired />;
}

export function Controlled() {
  const [value, setValue] = useState('MI');
  return (
    <Stack gap={2}>
      <NativeSelect label="Sede" options={provinces} value={value} onChange={(e) => setValue(e.target.value)} />
      <Text variant="body-sm" tone="secondary">
        Codice selezionato: {value}
      </Text>
    </Stack>
  );
}

export function Groups() {
  return (
    <NativeSelect label="Fuso orario" defaultValue="Europe/Rome">
      <optgroup label="Europa">
        <option value="Europe/Rome">Roma (CET)</option>
        <option value="Europe/London">Londra (GMT)</option>
      </optgroup>
      <optgroup label="America">
        <option value="America/New_York">New York (EST)</option>
      </optgroup>
    </NativeSelect>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <NativeSelect label="Invalid" options={provinces} placeholder="Seleziona…" defaultValue="" isInvalid errorMessage="Seleziona una provincia." />
      <NativeSelect label="Disabled" options={provinces} defaultValue="RM" isDisabled />
    </Stack>
  );
}