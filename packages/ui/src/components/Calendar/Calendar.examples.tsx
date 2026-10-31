import { useState } from 'react';
import {
  Calendar,
  type CalendarDate,
  LocaleProvider,
  RangeCalendar,
  Stack,
  Text,
  isWeekend,
  parseDate,
} from '@dev-community/ui';

export function Basic() {
  return <Calendar aria-label="Data appuntamento" defaultValue={parseDate('2025-06-12')} />;
}

export function Controlled() {
  const [date, setDate] = useState<CalendarDate | null>(parseDate('2025-06-12'));
  return (
    <Stack gap={2}>
      <Calendar
        aria-label="Giorno lavorativo"
        value={date}
        onChange={setDate}
        minValue={parseDate('2025-06-02')}
        maxValue={parseDate('2025-07-31')}
        isDateUnavailable={(d) => isWeekend(d, 'it-IT')}
      />
      <Text variant="body-sm" tone="secondary">
        Selezionato: {date?.toString() ?? 'nessuno'} (sabato e domenica non disponibili)
      </Text>
    </Stack>
  );
}

export function Range() {
  return (
    <RangeCalendar
      aria-label="Periodo di ferie"
      visibleMonths={2}
      defaultValue={{ start: parseDate('2025-08-04'), end: parseDate('2025-08-15') }}
    />
  );
}

export function Localized() {
  return (
    <Stack gap={4}>
      <LocaleProvider locale="en-US">
        <Calendar aria-label="Date (en-US, week starts Sunday)" defaultValue={parseDate('2025-06-12')} />
      </LocaleProvider>
      <LocaleProvider locale="it-IT">
        <Calendar aria-label="Data (it-IT, settimana da lunedì)" firstDayOfWeek="mon" defaultValue={parseDate('2025-06-12')} />
      </LocaleProvider>
    </Stack>
  );
}

export function MonthYear() {
  return <Calendar aria-label="Data di nascita" showMonthYearPicker defaultValue={parseDate('1988-03-21')} />;
}
