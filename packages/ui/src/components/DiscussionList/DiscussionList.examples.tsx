import { useState } from 'react';
import { Badge, Card, DiscussionList, Stack, Switch } from '@dev-community/ui';

// Computed once at module load so renders stay pure.
const now = Date.now();

const threads = [
  { id: 'monorepo', title: 'Monorepo o polyrepo per team da 30 dev?', href: '#monorepo', replies: 84, time: '2 h fa' },
  {
    id: 'rag-chunking',
    title: 'RAG su documenti aziendali: chunking che funziona davvero',
    href: '#rag-chunking',
    replies: 61,
    time: '5 h fa',
    tag: <Badge tone="brand" size="sm">AI</Badge>,
  },
  { id: 'primo-talk', title: 'Primo talk a un meetup: consigli?', href: '#primo-talk', replies: 47, time: 'ieri', isNew: true },
];

export function Basic() {
  return <DiscussionList aria-label="Discussioni calde" items={threads} />;
}

/** Inside a sidebar card, with dates rendered by RelativeTime. */
export function InCard() {
  return (
    <Card>
      <h3 id="discussioni-calde" style={{ margin: 0 }}>
        Discussioni calde
      </h3>
      <DiscussionList
        aria-labelledby="discussioni-calde"
        items={[
          { id: 'ci', title: 'GitHub Actions: cache delle dipendenze tra job', href: '#ci', replies: 12, time: new Date(now - 40 * 60 * 1000) },
          { id: 'a11y', title: 'Accessibilità dei grafici: cosa fate in pratica?', href: '#a11y', replies: 1, time: new Date(now - 26 * 3600 * 1000) },
        ]}
      />
    </Card>
  );
}

/** Second page of a list: numbering continues from `start`. */
export function StartNumber() {
  return (
    <DiscussionList
      aria-label="Discussioni, pagina 2"
      start={11}
      items={[
        { id: 'k8s-costi', title: 'Ridurre i costi di un cluster AKS di sviluppo', href: '#k8s-costi', replies: 9, time: '3 giorni fa' },
        { id: 'ts-strict', title: 'Migrare a TypeScript strict senza bloccare il team', href: '#ts-strict', replies: 23, time: '4 giorni fa' },
      ]}
    />
  );
}

/** While loading, the `<ol>` stays in place with skeleton rows (`loadingRows`). */
export function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <DiscussionList aria-label="Discussioni calde" items={threads} isLoading={isLoading} loadingRows={3} />
    </Stack>
  );
}
