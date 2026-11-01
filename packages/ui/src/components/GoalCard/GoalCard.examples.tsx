import { Target, Trophy, UserPlus } from 'lucide-react';
import { GoalCard, Grid, Link } from '@devcommunityit/ui';

export function Basic() {
  return (
    <GoalCard
      label="Vendite di ottobre"
      value={42000}
      target={50000}
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      icon={<Target />}
      description="Aggiornato a ieri sera"
    />
  );
}

export function Tones() {
  return (
    <Grid minItemWidth="17rem" gap={4}>
      <GoalCard label="Nuovi iscritti" value={860} target={1000} icon={<UserPlus />} tone="brand" />
      <GoalCard label="Ticket chiusi" value={312} target={300} tone="success" icon={<Trophy />} />
      <GoalCard label="Budget marketing" value={0.78} target={1} formatOptions={{ style: 'percent' }} tone="warning" />
      <GoalCard label="Articoli pubblicati" value={6} target={12} tone="neutral" />
    </Grid>
  );
}

/** Rich goal with heading level and footer link, for a dashboard section. */
export function WithFooter() {
  return (
    <GoalCard
      headingLevel={3}
      label="Obiettivo trimestrale di fatturato"
      value={186400}
      target={240000}
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      icon={<Target />}
      description="Q4 · mancano 6 settimane alla chiusura"
      footer={<Link href="#fatturato">Vedi il dettaglio per canale</Link>}
    />
  );
}
