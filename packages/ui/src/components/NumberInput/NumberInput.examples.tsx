import { useState } from 'react';
import { Euro } from 'lucide-react';
import { NumberInput, Stack, Text } from '@devcommunityit/ui';

export function Basic() {
  return <NumberInput label="Ospiti" defaultValue={2} minValue={1} maxValue={10} />;
}

export function Formats() {
  return (
    <Stack gap={4}>
      <NumberInput label="Prezzo" defaultValue={1490} formatOptions={{ style: 'currency', currency: 'EUR' }} minValue={0} step={10} />
      <NumberInput label="Sconto" defaultValue={0.15} formatOptions={{ style: 'percent' }} minValue={0} maxValue={1} step={0.05} />
      <NumberInput label="Peso" defaultValue={2.5} formatOptions={{ style: 'unit', unit: 'kilogram', maximumFractionDigits: 1 }} step={0.5} minValue={0} />
      <NumberInput label="Amount (no steppers)" startAdornment={<Euro />} hideSteppers formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
    </Stack>
  );
}

export function Controlled() {
  const [qty, setQty] = useState(3);
  const unit = 24.9;
  const fmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
  return (
    <Stack gap={2}>
      <NumberInput label="Quantità" value={qty} onChange={setQty} minValue={1} maxValue={99} />
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        Totale: {Number.isNaN(qty) ? '—' : fmt.format(qty * unit)}
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <NumberInput label="Invalid" defaultValue={120} isInvalid errorMessage="Massimo 100." />
      <NumberInput label="Read-only" defaultValue={42} isReadOnly />
      <NumberInput label="Disabled" defaultValue={7} isDisabled />
    </Stack>
  );
}