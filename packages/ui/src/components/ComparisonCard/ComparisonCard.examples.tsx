import { ComparisonCard, Grid } from '@devcommunityit/ui';

export function Basic() {
  return (
    <ComparisonCard
      label="Ricavi"
      current={{ label: 'Ottobre 2026', value: 84250 }}
      previous={{ label: 'Settembre 2026', value: 77900 }}
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      description="Fonte: gestionale vendite"
    />
  );
}

/** Lower is better: a decrease is shown as positive. */
export function LowerIsBetter() {
  return (
    <ComparisonCard
      label="Tempo medio di risposta"
      current={{ label: 'Questa settimana', value: 3.4 }}
      previous={{ label: 'Settimana scorsa', value: 4.1 }}
      formatOptions={{ style: 'unit', unit: 'hour', maximumFractionDigits: 1 }}
      higherIsBetter={false}
    />
  );
}

/** Several comparisons side by side, including a zero baseline (absolute delta). */
export function Dashboard() {
  return (
    <Grid minItemWidth="16rem" gap={4}>
      <ComparisonCard headingLevel={3} label="Iscritti newsletter" current={{ label: '2026', value: 5420 }} previous={{ label: '2025', value: 4310 }} />
      <ComparisonCard headingLevel={3} label="Resi" current={{ label: 'Ottobre', value: 48 }} previous={{ label: 'Settembre', value: 41 }} higherIsBetter={false} />
      <ComparisonCard headingLevel={3} label="Eventi organizzati" current={{ label: 'Questo trimestre', value: 3 }} previous={{ label: 'Trimestre scorso', value: 0 }} />
    </Grid>
  );
}
