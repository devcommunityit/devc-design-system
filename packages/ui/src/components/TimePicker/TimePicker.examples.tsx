import { useState } from 'react';
import { Stack, Text, type Time, TimePicker, parseTime } from '@devcommunityit/ui';

export function Basic() {
  return <TimePicker label="Orario promemoria" defaultValue={parseTime('09:30')} />;
}

export function OpeningHours() {
  const [value, setValue] = useState<Time | null>(parseTime('10:00'));
  return (
    <Stack gap={2}>
      <TimePicker
        label="Ritiro in negozio"
        description="Ogni 15 minuti, 9:00–19:00, chiuso 13:00–14:00."
        step={15}
        minValue={parseTime('09:00')}
        maxValue={parseTime('19:00')}
        isTimeUnavailable={(t) => t.hour === 13}
        value={value}
        onChange={setValue}
      />
      <Text variant="body-sm" tone="secondary">
        Valore: {value?.toString() ?? 'nessuno'}
      </Text>
    </Stack>
  );
}

export function Clearable() {
  return <TimePicker label="Sveglia" isClearable defaultValue={parseTime('07:00')} step={60} />;
}

export function TwelveHour() {
  return <TimePicker label="Meeting time" hourCycle={12} defaultValue={parseTime('14:30')} />;
}
