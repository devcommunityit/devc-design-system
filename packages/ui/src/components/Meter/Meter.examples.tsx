import { useState } from 'react';
import { Button, Inline, Meter, Stack } from '@devcommunityit/ui';

export function Basic() {
  return <Meter label="Spazio di archiviazione" value={42} description="5,8 GB liberi su 10 GB" />;
}

/** Thresholds change the tone; the value and description always state the meaning in text. */
export function Thresholds() {
  const [used, setUsed] = useState(7.2);
  const percent = Math.round((used / 10) * 100);
  return (
    <Stack gap={3}>
      <Meter
        label="Archiviazione usata"
        value={percent}
        thresholds={{ warning: 75, danger: 90 }}
        valueLabel={`${used.toLocaleString('it-IT', { maximumFractionDigits: 1 })} GB / 10 GB`}
        description={percent >= 90 ? 'Quasi pieno: libera spazio o aggiorna il piano.' : percent >= 75 ? 'Oltre il 75%: valuta una pulizia.' : 'Spazio sufficiente.'}
      />
      <Inline gap={2}>
        <Button size="sm" variant="outline" isDisabled={used <= 0} onPress={() => setUsed((u) => Math.max(0, +(u - 1).toFixed(1)))}>
          Libera 1 GB
        </Button>
        <Button size="sm" variant="outline" isDisabled={used >= 10} onPress={() => setUsed((u) => Math.min(10, +(u + 1).toFixed(1)))}>
          Carica 1 GB
        </Button>
      </Inline>
    </Stack>
  );
}

/** Custom range and formatting (English, API quota). */
export function CustomRange() {
  return (
    <Stack gap={4}>
      <Meter label="API calls this month" minValue={0} maxValue={5000} value={3120} valueLabel="3,120 of 5,000" size="sm" />
      <Meter label="Seats" minValue={0} maxValue={25} value={25} tone="danger" valueLabel="25 of 25 (full)" size="lg" />
      <Meter aria-label="Password strength" value={60} tone="warning" showValue={false} description="Medium strength: add symbols." />
    </Stack>
  );
}
