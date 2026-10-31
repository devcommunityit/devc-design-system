import { ActivityCard, Grid, Link } from '@dev-community/ui';

export function Basic() {
  return (
    <ActivityCard
      title="Attività recenti"
      items={[
        { id: '1', actor: 'Giulia Rossi', action: 'ha pubblicato l’articolo “Guida a React 19”', time: '10 minuti fa', dateTime: '2026-10-30T16:15', tone: 'success' },
        { id: '2', actor: 'Marco Bianchi', action: 'ha commentato “Design token e temi”', time: '1 ora fa', dateTime: '2026-10-30T15:20', tone: 'info' },
        { id: '3', actor: 'Sara Esposito', action: 'ha caricato 3 immagini nella libreria', time: 'ieri', dateTime: '2026-10-29' },
      ]}
    />
  );
}

/** Rich feed with links in the action, all tones and a footer link. */
export function WithTones() {
  return (
    <ActivityCard
      title="Registro del portale"
      items={[
        { id: '1', actor: 'Luca Romano', action: <>ha approvato la <Link href="#richiesta-42">richiesta n. 42</Link></>, time: '09:30', dateTime: '2026-10-30T09:30', tone: 'success' },
        { id: '2', actor: 'Elena Greco', action: 'ha modificato i permessi del gruppo Redazione', time: '09:12', dateTime: '2026-10-30T09:12', tone: 'warning' },
        { id: '3', actor: 'Sistema', action: 'backup notturno non riuscito', time: '03:00', dateTime: '2026-10-30T03:00', tone: 'danger' },
        { id: '4', actor: 'Paolo Conti', action: 'si è iscritto al meetup di novembre', time: 'ieri', dateTime: '2026-10-29', tone: 'info' },
        { id: '5', actor: 'Anna Ricci', action: 'ha aggiornato il profilo', time: '2 giorni fa', dateTime: '2026-10-28' },
      ]}
      footer={<Link href="#registro">Vedi tutto il registro</Link>}
    />
  );
}

/** Empty state when there is nothing to show yet. */
export function Empty() {
  return (
    <Grid minItemWidth="18rem" gap={4}>
      <ActivityCard title="Attività del team" items={[]} emptyState="Nessuna attività negli ultimi 7 giorni." />
    </Grid>
  );
}
