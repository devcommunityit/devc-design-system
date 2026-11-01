import { useState } from 'react';
import { Rating, Stack, Text } from '@devcommunityit/ui';

export function Basic() {
  return <Rating label="Valuta il servizio" defaultValue={3} />;
}

export function Controlled() {
  const [value, setValue] = useState<number | null>(null);
  const words = ['', 'Pessimo', 'Scarso', 'Nella media', 'Buono', 'Eccellente'];
  return (
    <Stack gap={2}>
      <Rating label="Come valuti la consegna?" value={value} onChange={setValue} showValue isRequired />
      <Text variant="body-sm" tone="secondary">{value === null ? 'Nessuna valutazione' : words[value]}</Text>
    </Stack>
  );
}

export function SizesAndStates() {
  return (
    <Stack gap={4}>
      <Rating label="Small, ten stars" size="sm" max={10} defaultValue={7} showValue />
      <Rating label="Read only" size="lg" value={4} isReadOnly />
      <Rating label="Disabled" defaultValue={2} isDisabled />
      <Rating label="Required" isRequired isInvalid errorMessage="Please choose a rating." />
    </Stack>
  );
}
