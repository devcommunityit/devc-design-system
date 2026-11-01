import { RadarChart, Text } from '@devcommunityit/ui';
import { useState } from 'react';

const skills = ['Frontend', 'Backend', 'DevOps', 'Design', 'Testing', 'Comunicazione'];

const team = [
  { id: 'alfa', label: 'Team Alfa', data: [86, 62, 48, 74, 70, 82] },
  { id: 'beta', label: 'Team Beta', data: [58, 88, 80, 40, 76, 64] },
];

export function Basic() {
  return <RadarChart title="Competenze dei team" description="Punteggio medio su 100, autovalutazione Q3" axes={skills} series={team} max={100} />;
}

export function SingleSeries() {
  return (
    <RadarChart
      title="Profilo prodotto"
      axes={['Prestazioni', 'Affidabilità', 'Usabilità', 'Sicurezza', 'Costo']}
      series={[{ id: 'v2', label: 'Versione 2.0', data: [4.2, 3.8, 4.6, 4.0, 3.1] }]}
      max={5}
      formatOptions={{ maximumFractionDigits: 1 }}
      size={220}
      showLegend={false}
    />
  );
}

export function WithMissingValues() {
  return (
    <RadarChart
      title="Soddisfazione per area"
      description="Il valore mancante (null) viene saltato: il poligono collega gli assi disponibili."
      axes={['Onboarding', 'Supporto', 'Documentazione', 'Prezzo', 'Funzionalità']}
      series={[
        { id: '2025', label: '2025', data: [0.72, 0.64, null, 0.58, 0.8] },
        { id: '2026', label: '2026', data: [0.81, 0.7, 0.66, 0.6, 0.84] },
      ]}
      max={1}
      formatOptions={{ style: 'percent' }}
    />
  );
}

export function ControlledSeries() {
  const [hidden, setHidden] = useState<string[]>(['beta']);
  return (
    <div>
      <RadarChart title="Competenze dei team" axes={skills} series={team} max={100} hiddenSeries={hidden} onHiddenSeriesChange={setHidden} />
      <Text variant="body-sm" tone="secondary">
        Serie nascoste: {hidden.length ? hidden.join(', ') : 'nessuna'}
      </Text>
    </div>
  );
}

export function Vivid() {
  return (
    <RadarChart
      appearance="vivid"
      title="Competenze dei team"
      description="Punteggio medio su 100"
      axes={skills}
      series={[...team, { id: 'gamma', label: 'Team Gamma', data: [70, 72, 66, 60, 88, 70] }]}
      max={100}
    />
  );
}
