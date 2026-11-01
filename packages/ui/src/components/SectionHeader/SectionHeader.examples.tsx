import { ArrowRight } from 'lucide-react';
import { Link, LinkButton, SectionHeader, Toggle, ToggleGroup } from '@devcommunityit/ui';

export function Basic() {
  return (
    <SectionHeader
      eyebrow="Prossimi eventi"
      title="Ci vediamo dal vivo (o in streaming)"
      actions={
        <ToggleGroup aria-label="Filtra eventi" defaultSelectedKeys={['all']} disallowEmptySelection>
          <Toggle id="all">Tutti</Toggle>
          <Toggle id="in-person">In presenza</Toggle>
          <Toggle id="online">Online</Toggle>
          <Toggle id="workshop">Workshop</Toggle>
        </ToggleGroup>
      }
    />
  );
}

export function WithDescription() {
  return (
    <SectionHeader
      eyebrow="Dal blog"
      title="Articoli e discussioni"
      description="Guide, deep dive e retrospettive scritte dai membri della community su AI, Cloud, DevOps e .NET."
      actions={
        <Link href="#articoli">
          Vedi tutti gli articoli <ArrowRight aria-hidden="true" size={16} />
        </Link>
      }
    />
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 'var(--dc-space-8)' }}>
      <SectionHeader size="lg" headingLevel={1} eyebrow="Community" title="Speaker della community" />
      <SectionHeader
        size="sm"
        headingLevel={3}
        title="Percorsi di apprendimento"
        actions={
          <LinkButton href="#percorsi" variant="outline" size="sm">
            Esplora
          </LinkButton>
        }
      />
    </div>
  );
}
