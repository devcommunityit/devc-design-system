import { useState } from 'react';
import { Badge, PostList, PostListItem, VoteButton, Stack, Switch } from '@devcommunityit/ui';

const posts = [
  {
    id: 'aks-keda',
    title: 'AKS + KEDA: autoscaling event-driven spiegato bene',
    href: '#aks-keda',
    thumbLabel: 'K8s',
    tone: 'data-4' as const,
    author: 'Marco Rossi',
    meta: '6 min',
    tags: <Badge tone="info" size="sm">Cloud Native</Badge>,
    votes: 186,
  },
  {
    id: 'copilot-agent-mode',
    title: 'GitHub Copilot agent mode: 10 prompt che uso ogni giorno',
    href: '#copilot-agent-mode',
    thumbLabel: 'GH',
    tone: 'data-2' as const,
    author: 'Sara Leone',
    meta: '4 min',
    tags: <Badge tone="brand" size="sm">Copilot</Badge>,
    votes: 241,
  },
  {
    id: 'bicep-moduli',
    title: 'Bicep in pratica: moduli riusabili per ambienti multipli',
    href: '#bicep-moduli',
    thumbLabel: 'IaC',
    tone: 'data-6' as const,
    author: 'Luca Bianchi',
    meta: '7 min',
    tags: <Badge tone="success" size="sm">Infrastructure</Badge>,
    votes: 97,
  },
  {
    id: 'secret-scanning',
    title: 'Secret scanning e push protection: la checklist del team',
    href: '#secret-scanning',
    thumbLabel: 'SEC',
    tone: 'accent' as const,
    author: 'Anna Ferri',
    meta: '5 min',
    tags: <Badge tone="danger" size="sm">Security</Badge>,
    votes: 133,
  },
];

/** Data-driven list: votes are kept in the parent and the counts follow the user's vote. */
export function Basic() {
  const [voted, setVoted] = useState<Record<string, boolean>>({ 'copilot-agent-mode': true });
  return (
    <PostList
      aria-label="Post in tendenza"
      headingLevel={3}
      items={posts.map((post) => ({ ...post, votes: post.votes + (voted[post.id] ? 1 : 0), isVoted: Boolean(voted[post.id]) }))}
      onVote={(id, isVoted) => setVoted((current) => ({ ...current, [id]: isVoted }))}
    />
  );
}

/** Composable rows, without frame, with a custom thumbnail. */
export function Composable() {
  return (
    <PostList variant="plain" aria-label="Ultimi post">
      <PostListItem
        title="Monorepo con npm workspaces: la nostra struttura"
        href="#monorepo"
        thumbLabel="NPM"
        tone="data-5"
        author="Giulia Conti"
        meta="ieri"
        votes={58}
      />
      <PostListItem title="Note dal meetup di Milano" href="#meetup" thumbLabel="MI" tone="brand" author="Community team" meta="3 giorni fa" />
    </PostList>
  );
}

/** VoteButton on its own, e.g. in a question header. */
export function StandaloneVote() {
  const [voted, setVoted] = useState(false);
  return <VoteButton count={1240 + (voted ? 1 : 0)} isSelected={voted} onChange={setVoted} />;
}

/** The list keeps its element and frame; `loadingRows` sets the skeleton rows. */
export function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <PostList aria-label="Post popolari" items={posts} isLoading={isLoading} loadingRows={3} />
    </Stack>
  );
}
