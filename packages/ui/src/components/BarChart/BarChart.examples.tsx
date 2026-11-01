import { BarChart } from '@devcommunityit/ui';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export function Grouped() {
  return (
    <BarChart
      title="Ricavi per area"
      description="Migliaia di euro"
      categories={quarters}
      series={[
        { id: 'north', label: 'Nord', data: [120, 135, 150, 170] },
        { id: 'center', label: 'Centro', data: [90, 95, 110, 105] },
        { id: 'south', label: 'Sud', data: [60, 72, 80, 96] },
      ]}
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
    />
  );
}

export function Stacked() {
  return (
    <BarChart
      title="Ticket by status"
      layout="stacked"
      categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
      series={[
        { id: 'resolved', label: 'Resolved', data: [32, 41, 38, 45, 29] },
        { id: 'pending', label: 'Pending', data: [12, 9, 14, 8, 11] },
        { id: 'escalated', label: 'Escalated', data: [3, 5, 2, 4, 6] },
      ]}
    />
  );
}

export function Horizontal() {
  return (
    <BarChart
      title="Pagine più visitate"
      orientation="horizontal"
      categories={['/prezzi', '/documentazione/installazione', '/blog/novita-2026', '/contatti', '/carriere']}
      series={[{ id: 'views', label: 'Visualizzazioni', data: [18200, 14650, 9800, 4300, 2100] }]}
      formatOptions={{ notation: 'compact' }}
      showLegend={false}
    />
  );
}

export function NegativeValues() {
  return (
    <BarChart
      title="Variazione margine"
      description="Punti percentuali rispetto all’anno precedente"
      categories={['Hardware', 'Software', 'Servizi', 'Formazione']}
      series={[{ id: 'delta', label: 'Variazione', data: [-0.042, 0.068, 0.031, -0.012] }]}
      formatOptions={{ style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }}
      showLegend={false}
      height={220}
    />
  );
}

export function Vivid() {
  return (
    <BarChart
      appearance="vivid"
      title="Ricavi per area"
      description="Migliaia di euro"
      categories={quarters}
      series={[
        { id: 'north', label: 'Nord', data: [120, 135, 150, 170] },
        { id: 'center', label: 'Centro', data: [90, 95, 110, 105] },
        { id: 'south', label: 'Sud', data: [60, 72, 80, 96] },
      ]}
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
    />
  );
}
