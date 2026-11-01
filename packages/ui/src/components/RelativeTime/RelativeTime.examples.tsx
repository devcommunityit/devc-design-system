import { useState } from 'react';
import { LocaleProvider, RelativeTime, Stack, Text } from '@devcommunityit/ui';

// Fixed reference instant so that the examples are deterministic.
const NOW = '2024-06-12T10:00:00+02:00';

export function Basic() {
  return (
    <Text>
      Aggiornato <RelativeTime date="2024-06-12T09:57:00+02:00" now={NOW} />
    </Text>
  );
}

/** Past and future values; with numeric="auto" Intl uses words such as "ieri" / "domani". */
export function PastAndFuture() {
  const dates = [
    '2024-06-12T09:59:30+02:00',
    '2024-06-12T08:30:00+02:00',
    '2024-06-11T10:00:00+02:00',
    '2024-05-20T10:00:00+02:00',
    '2024-06-13T10:00:00+02:00',
    '2025-01-10T10:00:00+01:00',
  ];
  return (
    <Stack gap={1}>
      {dates.map((date) => (
        <Text key={date} variant="body-sm">
          <RelativeTime date={date} now={NOW} /> <Text as="span" tone="muted" variant="body-sm">({date})</Text>
        </Text>
      ))}
    </Stack>
  );
}

/** English locale, short style and always-numeric output; the exact time is also shown as visible text. */
export function EnglishShort() {
  return (
    <LocaleProvider locale="en-GB">
      <Stack gap={1}>
        <Text variant="body-sm">
          Deployed <RelativeTime date="2024-06-11T10:00:00+02:00" now={NOW} numeric="always" formatStyle="short" /> (11 June 2024, 10:00 CEST)
        </Text>
        <Text variant="body-sm">
          Next backup <RelativeTime date="2024-06-12T13:00:00+02:00" now={NOW} />
        </Text>
      </Stack>
    </LocaleProvider>
  );
}

/** Without `now` the text refreshes every 60 s (updateInterval); hydration warnings are suppressed. */
export function Live() {
  const [openedAt] = useState(() => Date.now());
  return (
    <Text variant="body-sm">
      Pagina aperta <RelativeTime date={openedAt} updateInterval={10_000} />
    </Text>
  );
}
