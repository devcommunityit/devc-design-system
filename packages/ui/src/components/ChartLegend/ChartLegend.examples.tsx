import { ChartLegend, Sparkline, Stack, Text } from '@dev-community/ui';
import { useState } from 'react';

const items = [
  { id: 'web', label: 'Web', colorIndex: 0 },
  { id: 'ios', label: 'iOS', colorIndex: 1 },
  { id: 'android', label: 'Android', colorIndex: 2 },
];

export function Static() {
  return <ChartLegend items={items} />;
}

export function WithValues() {
  return (
    <ChartLegend
      swatch="fill"
      items={[
        { id: 'new', label: 'Nuovi clienti', colorIndex: 0, value: '1.240 · 48%' },
        { id: 'returning', label: 'Clienti abituali', colorIndex: 1, value: '980 · 38%' },
        { id: 'reactivated', label: 'Riattivati', colorIndex: 2, value: '360 · 14%' },
      ]}
    />
  );
}

/** Toggleable legend driving a custom visualization (here, a set of sparklines). */
export function Toggleable() {
  const [hidden, setHidden] = useState<string[]>([]);
  const data: Record<string, number[]> = { web: [5, 7, 6, 9, 11], ios: [3, 4, 6, 5, 7], android: [4, 4, 5, 7, 8] };
  return (
    <Stack gap={3}>
      <ChartLegend items={items} isToggleable hiddenItems={hidden} onHiddenItemsChange={setHidden} />
      <Stack gap={2}>
        {items
          .filter((item) => !hidden.includes(item.id))
          .map((item) => (
            <Sparkline key={item.id} label={item.label} colorIndex={item.colorIndex} data={data[item.id] ?? []} />
          ))}
      </Stack>
      <Text variant="body-sm" tone="secondary">
        Visibili: {items.length - hidden.length} di {items.length}
      </Text>
    </Stack>
  );
}
