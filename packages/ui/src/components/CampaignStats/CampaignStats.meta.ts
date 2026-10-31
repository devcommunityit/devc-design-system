import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CampaignStats', 'CampaignStatsProps', 'CampaignStat'],
  name: 'CampaignStats',
  slug: 'campaign-stats',
  category: 'community',
  summary: 'Griglia di KPI per le metriche di una campagna email, composta con KpiCard.',
  whenToUse: ['Riepilogare aperture, click e risultati di una campagna.'],
  whenNotToUse: ['Mostrare dettagli di funnel: usa FunnelChart.', 'Disegnare KPI da zero: usa KpiCard direttamente.'],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Nome della sezione.', required: true },
    { name: 'stats', type: 'CampaignStat[]', description: 'Metriche formattate e trend opzionali.', required: true },
  ],
  inherits: 'Attributi HTML di <section>.',
  keyboard: [],
  accessibility: ['Riutilizza KpiCard che esprime trend e valori come testo.'],
  responsive: ['La griglia si adatta al numero e alla larghezza dei KPI.'],
  customization: ['Composto con KpiCard e token --dc-*.'],
  commonMistakes: ['Usare una metrica come unica informazione visiva senza etichetta.'],
  examples: [{ name: 'Basic', title: 'Statistiche campagna' }],
  status: { implemented: true, documented: true, tests: ['components/CampaignStats/CampaignStats.test.tsx'], limits: ['Non raccoglie o aggiorna le metriche.'] },
};
