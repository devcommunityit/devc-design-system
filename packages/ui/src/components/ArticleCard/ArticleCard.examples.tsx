import { useState } from 'react';
import { ArticleCard, Badge, Grid, ReactionBar, Stack, Switch } from '@dev-community/ui';

// Computed once at module load so renders stay pure.
const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);

const snippet = `await agent.run({
  tools: [search, deploy],
  guardrails: true
});`;

export function Featured() {
  return (
    <ArticleCard
      href="#multi-agent-in-produzione"
      cover={<pre>{snippet}</pre>}
      tags={
        <>
          <Badge tone="brand">AI &amp; Agents</Badge>
          <Badge tone="warning">In evidenza</Badge>
        </>
      }
      title="Come abbiamo portato un multi-agent system in produzione (e cosa abbiamo sbagliato)"
      excerpt="Orchestrazione, osservabilità e costi: le lezioni apprese in sei mesi di agenti AI su workload reali."
      author={{ name: 'Giulia Conti' }}
      date="3 giorni fa"
      readingMinutes={9}
      likes={412}
      comments={58}
      bookmarks={130}
    />
  );
}

export function ArticleImage() {
  return (
    <ArticleCard
      href="#design-system-accessibile"
      image={{ src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'%3E%3Crect width='1200' height='700' fill='%232d4268'/%3E%3Ctext x='60' y='360' fill='white' font-size='84'%3EDesign system%3C/text%3E%3C/svg%3E", alt: 'Illustrazione con la scritta Design system' }}
      tags={<Badge tone="brand">Design system</Badge>}
      title="Progettare componenti accessibili fin dall’inizio"
      excerpt="Un percorso pratico tra semantica, tastiera e test automatici."
      author={{ name: 'Giulia Conti' }}
      readingMinutes={6}
    />
  );
}

/** Likes and bookmarks become toggle buttons when handlers are provided; the counts stay in the parent state. */
export function InteractiveReactions() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(true);
  return (
    <ArticleCard
      href="#aks-keda"
      tone="data-6"
      cover={<pre>{'kubectl apply -f scaledobject.yaml'}</pre>}
      tags={<Badge tone="info">Cloud Native</Badge>}
      title="AKS + KEDA: autoscaling event-driven spiegato bene"
      excerpt="Dalla coda di Service Bus ai pod che scalano a zero: configurazione, metriche e trappole da evitare."
      author={{ name: 'Marco Rossi' }}
      date={twoHoursAgo}
      readingMinutes={6}
      likes={186 + (liked ? 1 : 0)}
      isLiked={liked}
      onLike={setLiked}
      comments={24}
      commentsHref="#aks-keda-commenti"
      bookmarks={41 + (saved ? 1 : 0)}
      isBookmarked={saved}
      onBookmark={setSaved}
    />
  );
}

export function Compact() {
  return (
    <Grid minItemWidth="17rem" gap={4}>
      <ArticleCard
        variant="compact"
        href="#copilot-agent-mode"
        tags={<Badge tone="brand">Copilot</Badge>}
        title="GitHub Copilot agent mode: 10 prompt che uso ogni giorno"
        author={{ name: 'Sara Leone' }}
        date="ieri"
        readingMinutes={4}
        likes={241}
        comments={33}
      />
      <ArticleCard
        variant="compact"
        href="#bicep-moduli"
        tags={<Badge tone="success">IaC</Badge>}
        title="Bicep in pratica: moduli riusabili per ambienti multipli"
        author={{ name: 'Luca Bianchi' }}
        date="2 giorni fa"
        readingMinutes={7}
        likes={97}
        comments={12}
      />
      <ArticleCard
        variant="compact"
        href="#secret-scanning"
        tags={<Badge tone="danger">Security</Badge>}
        title="Secret scanning e push protection: la checklist del team"
        author={{ name: 'Anna Ferri' }}
        date="5 giorni fa"
        readingMinutes={5}
        likes={133}
        comments={19}
      />
    </Grid>
  );
}

/** ReactionBar on its own, e.g. at the end of an article page. */
export function StandaloneReactionBar() {
  const [liked, setLiked] = useState(true);
  return <ReactionBar likes={1204 + (liked ? 1 : 0)} isLiked={liked} onLike={setLiked} comments={58} bookmarks={130} />;
}

/** Feed in caricamento: featured shows a cover placeholder, compact only the body. */
export function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <Grid minItemWidth="16rem" gap={4}>
        <ArticleCard
          isLoading={isLoading}
          href="#rag-in-produzione"
          title="RAG in produzione: le metriche che contano"
          excerpt="Recall, latenza e costi: come misurare un sistema RAG prima che lo facciano gli utenti."
          author={{ name: 'Sara Leone' }}
          readingMinutes={7}
          likes={128}
        />
        <ArticleCard
          isLoading={isLoading}
          variant="compact"
          href="#bicep"
          title="Bicep: moduli riusabili"
          author={{ name: 'Luca Bianchi' }}
          readingMinutes={4}
        />
      </Grid>
    </Stack>
  );
}
