import { useState } from 'react';
import {
  Button,
  type CalendarDate,
  type DatePreset,
  DatePicker,
  DateRangePicker,
  Form,
  Stack,
  Text,
  type ZonedDateTime,
  isWeekend,
  parseDate,
  parseZonedDateTime,
} from '@devcommunityit/ui';

export function Basic() {
  return <DatePicker label="Data di nascita" />;
}

export function Controlled() {
  const [date, setDate] = useState<CalendarDate | null>(parseDate('2025-09-15'));
  return (
    <Stack gap={2}>
      <DatePicker
        label="Data di consegna"
        description="Solo giorni feriali entro fine anno."
        value={date}
        onChange={setDate}
        minValue={parseDate('2025-09-01')}
        maxValue={parseDate('2025-12-31')}
        isDateUnavailable={(d) => isWeekend(d, 'it-IT')}
        calendarErrorMessage="Il giorno selezionato non è disponibile."
      />
      <Text variant="body-sm" tone="secondary">
        Valore (data senza orario): {date?.toString() ?? 'nessuno'}
      </Text>
    </Stack>
  );
}

export function Range() {
  return (
    <DateRangePicker
      label="Periodo"
      visibleMonths={2}
      defaultValue={{ start: parseDate('2025-08-04'), end: parseDate('2025-08-15') }}
    />
  );
}

export function ZonedInstant() {
  const [value, setValue] = useState<ZonedDateTime | null>(parseZonedDateTime('2025-10-02T09:30[Europe/Rome]'));
  return (
    <Stack gap={2}>
      <DatePicker label="Inizio riunione" granularity="minute" value={value} onChange={setValue} />
      <Text variant="body-sm" tone="secondary">
        Istante con fuso: {value?.toString() ?? 'nessuno'} · ISO UTC: {value?.toAbsoluteString() ?? '—'}
      </Text>
    </Stack>
  );
}

export function Validation() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(String(new FormData(e.currentTarget).get('checkin')));
      }}
    >
      <Stack gap={3}>
        <DatePicker label="Check-in" name="checkin" isRequired minValue={parseDate('2025-01-01')} />
        <Button type="submit">Verifica</Button>
        {submitted ? <Text variant="body-sm">Inviato: {submitted}</Text> : null}
      </Stack>
    </Form>
  );
}

export function Presets() {
  return <DatePicker label="Scadenza" presets="default" isClearable />;
}

export function RangePresets() {
  return <DateRangePicker label="Periodo del report" presets="default" isClearable visibleMonths={2} />;
}

const quarterPresets: DatePreset[] = [
  { id: 'eom', label: 'Fine mese', value: ({ today }) => today.set({ day: today.calendar.getDaysInMonth(today) }) },
  { id: 'q', label: 'Tra 3 mesi', value: ({ today }) => today.add({ months: 3 }) },
  { id: 'y', label: 'Tra un anno', value: ({ today }) => today.add({ years: 1 }) },
];

export function CustomPresets() {
  return <DatePicker label="Rinnovo contratto" presets={quarterPresets} />;
}
