import { useState } from 'react';
import { Leaderboard, Link, Stack, Switch } from '@dev-community/ui';

const people = [
  { id: 'sara', name: 'Sara Leone', subtitle: '12 articoli · 3 talk', points: 2840, href: '#sara-leone' },
  { id: 'giulia', name: 'Giulia Conti', subtitle: '8 articoli · 2 talk', points: 2115, href: '#giulia-conti' },
  { id: 'marco', name: 'Marco Rossi', subtitle: '96 risposte utili', points: 1760, href: '#marco-rossi' },
  { id: 'luca', name: 'Luca Bianchi', subtitle: '5 articoli', points: 1320 },
  { id: 'anna', name: 'Anna Ferri', subtitle: '41 risposte utili', points: 980 },
];

export function Basic() {
  return <Leaderboard title="Top contributor del mese" items={people} />;
}

/** The current user is highlighted and marked with aria-current; the footer links to the full ranking. */
export function HighlightCurrentUser() {
  return (
    <Leaderboard
      title="Classifica della community"
      items={people}
      highlightId="luca"
      footer={<Link href="#classifica">Vedi la classifica completa</Link>}
    />
  );
}

/** Second page without frame: ranks continue from `start`. */
export function PlainWithStart() {
  return (
    <Leaderboard
      aria-label="Classifica, posizioni 11–13"
      variant="plain"
      start={11}
      highlightId="me"
      items={[
        { id: 'paolo', name: 'Paolo Greco', subtitle: '3 articoli', points: 640 },
        { id: 'me', name: 'Chiara Neri', subtitle: 'Tu · 22 risposte utili', points: 615 },
        { id: 'elena', name: 'Elena Riva', subtitle: '1 talk', points: 590 },
      ]}
    />
  );
}

/** The title stays visible; only the rows become skeletons. */
export function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <Leaderboard title="Top contributor del mese" items={people} isLoading={isLoading} />
    </Stack>
  );
}
