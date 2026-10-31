import { ScatterChart, Text } from '@dev-community/ui';
import { useState } from 'react';

const stores = [
  {
    id: 'nord',
    label: 'Nord',
    points: [
      { x: 120, y: 48000, label: 'Milano' },
      { x: 85, y: 36500, label: 'Torino' },
      { x: 60, y: 24800, label: 'Bologna' },
      { x: 40, y: 19200, label: 'Verona' },
    ],
  },
  {
    id: 'centro',
    label: 'Centro',
    points: [
      { x: 110, y: 41000, label: 'Roma' },
      { x: 55, y: 22000, label: 'Firenze' },
      { x: 30, y: 12500, label: 'Perugia' },
    ],
  },
  {
    id: 'sud',
    label: 'Sud',
    points: [
      { x: 95, y: 31000, label: 'Napoli' },
      { x: 50, y: 17800, label: 'Bari' },
      { x: 45, y: 15200, label: 'Palermo' },
    ],
  },
];

export function Basic() {
  return (
    <ScatterChart
      title="Superficie e fatturato dei negozi"
      description="Fatturato mensile per metro quadro, ottobre 2026"
      series={stores}
      xLabel="Superficie (m²)"
      yLabel="Fatturato"
      yFormatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact' }}
    />
  );
}

export function Bubbles() {
  return (
    <ScatterChart
      title="Progetti: impegno e valore"
      description="La dimensione della bolla è il numero di persone coinvolte."
      series={[
        {
          id: 'progetti',
          label: 'Progetti',
          points: [
            { x: 2, y: 8, size: 3, label: 'Nuovo onboarding' },
            { x: 5, y: 9, size: 8, label: 'App mobile' },
            { x: 8, y: 4, size: 12, label: 'Migrazione dati' },
            { x: 3, y: 3, size: 2, label: 'Report interni' },
            { x: 6, y: 6, size: 5, label: 'Design system' },
          ],
        },
      ]}
      xLabel="Impegno (mesi)"
      yLabel="Valore atteso"
      showLegend={false}
      height={300}
    />
  );
}

export function ControlledSeries() {
  const [hidden, setHidden] = useState<string[]>(['centro']);
  return (
    <div>
      <ScatterChart title="Superficie e fatturato dei negozi" series={stores} xLabel="Superficie (m²)" yLabel="Fatturato" hiddenSeries={hidden} onHiddenSeriesChange={setHidden} />
      <Text variant="body-sm" tone="secondary">
        Serie nascoste: {hidden.length ? hidden.join(', ') : 'nessuna'}
      </Text>
    </div>
  );
}

export function Vivid() {
  return (
    <ScatterChart
      appearance="vivid"
      title="Superficie e fatturato dei negozi"
      description="Per area geografica"
      series={stores}
      xLabel="Superficie (m²)"
      yLabel="Fatturato"
      yFormatOptions={{ style: 'currency', currency: 'EUR', notation: 'compact' }}
    />
  );
}
