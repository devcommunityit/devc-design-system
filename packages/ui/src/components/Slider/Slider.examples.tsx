import { useState } from 'react';
import { RangeSlider, Slider, Stack, Text } from '@devcommunityit/ui';

export function Basic() {
  return <Slider label="Volume" defaultValue={40} />;
}

export function Controlled() {
  const [value, setValue] = useState(18);
  return (
    <Stack gap={2}>
      <Slider
        label="Temperatura"
        minValue={10}
        maxValue={30}
        step={0.5}
        value={value}
        onChange={setValue}
        formatOptions={{ style: 'unit', unit: 'celsius' }}
        showBounds
      />
      <Text variant="body-sm" tone="secondary">
        Valore salvato: {value}
      </Text>
    </Stack>
  );
}

export function Range() {
  const [range, setRange] = useState<[number, number]>([200, 800]);
  return (
    <Stack gap={2}>
      <RangeSlider
        label="Prezzo"
        minValue={0}
        maxValue={1000}
        step={10}
        value={range}
        onChange={setRange}
        formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
        showBounds
      />
      <Text variant="body-sm" tone="secondary">
        Filtro: {range[0]}–{range[1]} €
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <Slider label="Disabilitato" defaultValue={30} isDisabled />
      <Slider label="Senza valore visibile" description="Il valore resta annunciato agli screen reader." defaultValue={60} showValue={false} />
    </Stack>
  );
}