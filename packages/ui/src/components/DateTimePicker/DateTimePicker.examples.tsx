import { useState } from 'react';
import {
  type CalendarDateTime,
  DateTimePicker,
  Stack,
  Text,
  type ZonedDateTime,
  isWeekend,
  parseDateTime,
  parseZonedDateTime,
} from '@dev-community/ui';

export function Basic() {
  return <DateTimePicker label="Data e ora" />;
}

export function Appointments() {
  const [value, setValue] = useState<CalendarDateTime | null>(parseDateTime('2025-09-16T10:00'));
  return (
    <Stack gap={2}>
      <DateTimePicker
        label="Appuntamento"
        description="Feriali, slot da 15 minuti tra le 9:00 e le 18:00, pausa pranzo esclusa."
        value={value}
        onChange={setValue}
        timeStep={15}
        minValue={parseDateTime('2025-09-15T09:00')}
        maxValue={parseDateTime('2025-12-19T18:00')}
        isDateUnavailable={(d) => isWeekend(d, 'it-IT')}
        isTimeUnavailable={(t) => t.hour < 9 || t.hour >= 18 || t.hour === 13}
      />
      <Text variant="body-sm" tone="secondary">
        Valore: {value?.toString() ?? 'nessuno'}
      </Text>
    </Stack>
  );
}

export function Zoned() {
  const [value, setValue] = useState<ZonedDateTime | null>(parseZonedDateTime('2025-10-02T09:30[Europe/Rome]'));
  return (
    <Stack gap={2}>
      <DateTimePicker label="Inizio webinar" value={value} onChange={setValue} />
      <Text variant="body-sm" tone="secondary">
        ISO UTC: {value?.toAbsoluteString() ?? '—'}
      </Text>
    </Stack>
  );
}

export function PresetsClearable() {
  return (
    <DateTimePicker
      label="Pubblica il"
      presets="default"
      isClearable
      defaultValue={parseDateTime('2025-06-12T08:00')}
      timeStep={60}
    />
  );
}
