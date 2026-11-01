import { LineChart, Text } from '@devcommunityit/ui';
import { useState } from 'react';

const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

const traffic = [
  { id: 'organic', label: 'Organico', data: [4200, 4500, 4800, 5100, 5600, 5400, 5900, 6100, 6600, 7000, 7300, 7800] },
  { id: 'paid', label: 'Campagne', data: [2100, 2600, 2400, 3000, 3200, 3900, 3600, 3300, 3800, 4100, 4500, 5200] },
  { id: 'referral', label: 'Referral', data: [900, 950, 1100, 1050, 1200, 1300, 1250, 1400, 1500, 1450, 1600, 1700] },
];

export function Basic() {
  return <LineChart title="Visite per canale" description="Sessioni mensili, 2026" categories={months} series={traffic} />;
}

export function Area() {
  return (
    <LineChart
      title="Monthly recurring revenue"
      variant="area"
      categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
      series={[{ id: 'mrr', label: 'MRR', data: [18400, 19100, 21000, 22800, 24100, 26500] }]}
      formatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 }}
      height={200}
    />
  );
}

export function WithGaps() {
  return (
    <LineChart
      title="Temperatura del sensore"
      description="I valori mancanti (manutenzione) lasciano un vuoto nella linea."
      categories={['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']}
      series={[
        { id: 'a', label: 'Sensore A', data: [18.2, 19.5, null, null, 23.1, 24.0, 23.6] },
        { id: 'b', label: 'Sensore B', data: [17.9, 18.8, 20.1, 21.4, 22.0, null, 22.9] },
      ]}
      formatOptions={{ style: 'unit', unit: 'celsius', maximumFractionDigits: 1 }}
      showGrid={false}
    />
  );
}

export function ControlledSeries() {
  const [hidden, setHidden] = useState<string[]>(['referral']);
  return (
    <div>
      <LineChart title="Visite per canale" categories={months} series={traffic} hiddenSeries={hidden} onHiddenSeriesChange={setHidden} />
      <Text variant="body-sm" tone="secondary">
        Serie nascoste: {hidden.length ? hidden.join(', ') : 'nessuna'}
      </Text>
    </div>
  );
}

export function Vivid() {
  return (
    <LineChart
      appearance="vivid"
      variant="area"
      title="Visite mensili"
      description="Sessioni per canale, 2026"
      categories={months}
      series={traffic}
      formatOptions={{ notation: 'compact' }}
    />
  );
}
