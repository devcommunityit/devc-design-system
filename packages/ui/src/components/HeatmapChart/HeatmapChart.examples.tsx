import { HeatmapChart } from '@dev-community/ui';

const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const slots = ['08–10', '10–12', '12–14', '14–16', '16–18', '18–20'];

const visits = [
  [120, 340, 280, 310, 260, 140],
  [110, 360, 300, 330, 290, 150],
  [130, 380, 310, 350, 300, 170],
  [125, 370, 290, 340, 310, 180],
  [100, 300, 260, 280, 240, 210],
  [60, 140, 190, 170, 150, 230],
  [40, 90, 150, 160, 130, 200],
];

export function Basic() {
  return <HeatmapChart title="Visite per fascia oraria" description="Media settimanale, ottobre 2026" rows={days} columns={slots} values={visits} />;
}

export function Percent() {
  return (
    <HeatmapChart
      title="Tasso di conversione"
      description="Per canale e dispositivo"
      rows={['Organico', 'Campagne', 'Referral', 'Email']}
      columns={['Desktop', 'Tablet', 'Mobile']}
      values={[
        [0.042, 0.031, 0.024],
        [0.051, 0.038, 0.029],
        [0.036, 0.027, 0.019],
        [0.068, 0.044, 0.035],
      ]}
      formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
      colorIndex={2}
      cellHeight={40}
    />
  );
}

export function WithMissingValues() {
  return (
    <HeatmapChart
      title="Build completate per team"
      description="Le celle senza dati (null) mostrano solo un trattino."
      rows={['Piattaforma', 'Mobile', 'Web']}
      columns={['Set', 'Ott', 'Nov', 'Dic']}
      values={[
        [42, 51, null, 47],
        [18, null, 22, 25],
        [63, 70, 66, null],
      ]}
      colorIndex={4}
    />
  );
}

export function Vivid() {
  return <HeatmapChart appearance="vivid" title="Visite per fascia oraria" description="Media settimanale" rows={days} columns={slots} values={visits} colorIndex={1} />;
}
