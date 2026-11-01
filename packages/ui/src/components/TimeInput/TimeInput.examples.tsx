import { useState } from 'react';
import { Stack, Text, type Time, TimeInput, parseTime } from '@devcommunityit/ui';

export function Basic() {
  return <TimeInput label="Orario di arrivo" showIcon />;
}

export function Controlled() {
  const [time, setTime] = useState<Time | null>(parseTime('09:30'));
  return (
    <Stack gap={2}>
      <TimeInput
        label="Apertura"
        value={time}
        onChange={setTime}
        minValue={parseTime('08:00')}
        maxValue={parseTime('20:00')}
        description="Tra le 08:00 e le 20:00."
      />
      <Text variant="body-sm" tone="secondary">
        Valore: {time?.toString() ?? 'nessuno'}
      </Text>
    </Stack>
  );
}

export function HourCycle() {
  return (
    <Stack gap={3}>
      <TimeInput label="Formato 12 ore" hourCycle={12} defaultValue={parseTime('14:15')} />
      <TimeInput label="Con secondi" granularity="second" defaultValue={parseTime('14:15:30')} />
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={3}>
      <TimeInput label="Disabilitato" isDisabled defaultValue={parseTime('10:00')} />
      <TimeInput label="Sola lettura" isReadOnly defaultValue={parseTime('10:00')} />
      <TimeInput label="Non valido" isInvalid errorMessage="Orario non disponibile." defaultValue={parseTime('23:00')} />
    </Stack>
  );
}