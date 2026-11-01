import { Cloud, GitBranch, Sparkles } from 'lucide-react';
import { Button, Grid, LearningPathCard } from '@devcommunityit/ui';

export function Basic() {
  return (
    <LearningPathCard
      style={{ maxInlineSize: '22rem' }}
      icon={<Sparkles />}
      title="Generative AI per sviluppatori"
      href="#genai"
      description="LLM, RAG, agenti e valutazione. 8 moduli con lab pratici."
      completed={5}
      total={8}
    />
  );
}

/** The three paths from the community landing: two in progress and a new one. */
export function PathsGrid() {
  return (
    <Grid minItemWidth="16rem" gap={4}>
      <LearningPathCard
        icon={<Sparkles />}
        tone="brand"
        title="Generative AI per sviluppatori"
        href="#genai"
        description="LLM, RAG, agenti e valutazione con lab pratici."
        meta={
          <>
            <span>Intermedio</span>
            <span>· 12 ore</span>
          </>
        }
        completed={5}
        total={8}
      />
      <LearningPathCard
        icon={<Cloud />}
        tone="accent"
        title="Cloud Native Foundations"
        href="#cloud-native"
        description="Container, Kubernetes, osservabilità e sicurezza."
        meta={
          <>
            <span>Base</span>
            <span>· 15 ore</span>
          </>
        }
        completed={2}
        total={10}
      />
      <LearningPathCard
        icon={<GitBranch />}
        tone="subtle"
        title="DevOps & Platform Engineering"
        href="#devops"
        description="CI/CD, IaC, GitOps e developer experience. 7 moduli."
        isNew
        footer={<span>Inizia gratis</span>}
      />
    </Grid>
  );
}

/** Without a link on the title: the footer holds the action. */
export function WithAction() {
  return (
    <LearningPathCard
      style={{ maxInlineSize: '22rem' }}
      icon={<GitBranch />}
      tone="neutral"
      headingLevel={2}
      title="Git avanzato per team"
      description="Rebase interattivo, bisect, worktree e strategie di branching."
      meta={<span>Avanzato · 6 moduli · 4 ore</span>}
      isNew
      footer={<Button size="sm">Inizia il percorso</Button>}
    />
  );
}
