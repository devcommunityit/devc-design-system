import { useState } from 'react';
import { Badge, Button, Grid, ProfileCard, Stack, Switch } from '@dev-community/ui';

const compact = { notation: 'compact', maximumFractionDigits: 1 } as const;

export function Basic() {
  return (
    <ProfileCard
      style={{ maxInlineSize: '18rem' }}
      name="Giulia Conti"
      jobTitle="AI Engineer"
      href="#giulia-conti"
      tags={
        <>
          <Badge tone="brand">AI</Badge>
          <Badge tone="info">Python</Badge>
        </>
      }
      stats={[
        { label: 'talk', value: 14 },
        { label: 'follower', value: 2100, formatOptions: compact },
      ]}
    />
  );
}

/** Speaker grid with the four band tones and a Follow action. */
export function SpeakerGrid() {
  return (
    <Grid minItemWidth="14rem" gap={4}>
      <ProfileCard
        name="Giulia Conti"
        jobTitle="AI Engineer"
        tone="brand"
        href="#giulia-conti"
        tags={<Badge tone="brand">AI</Badge>}
        stats={[
          { label: 'talk', value: 14 },
          { label: 'follower', value: 2100, formatOptions: compact },
        ]}
        actions={<Button variant="secondary" size="sm">Segui</Button>}
      />
      <ProfileCard
        name="Marco Rossi"
        jobTitle="Cloud Architect"
        tone="accent"
        href="#marco-rossi"
        tags={
          <>
            <Badge tone="info">Kubernetes</Badge>
            <Badge tone="success">Azure</Badge>
          </>
        }
        stats={[
          { label: 'talk', value: 22 },
          { label: 'follower', value: 3400, formatOptions: compact },
        ]}
        actions={<Button variant="secondary" size="sm">Segui</Button>}
      />
      <ProfileCard
        name="Sara Leone"
        jobTitle="Developer Advocate"
        tone="subtle"
        href="#sara-leone"
        tags={
          <>
            <Badge tone="brand">Copilot</Badge>
            <Badge tone="danger">.NET</Badge>
          </>
        }
        stats={[
          { label: 'talk', value: 31 },
          { label: 'follower', value: 5800, formatOptions: compact },
        ]}
        actions={<Button variant="secondary" size="sm">Segui</Button>}
      />
      <ProfileCard
        name="Davide Bruno"
        jobTitle="Platform Engineer"
        tone="neutral"
        href="#davide-bruno"
        tags={
          <>
            <Badge tone="success">DevOps</Badge>
            <Badge>IaC</Badge>
          </>
        }
        stats={[
          { label: 'talk', value: 9 },
          { label: 'follower', value: 1200, formatOptions: compact },
        ]}
        actions={<Button variant="secondary" size="sm">Segui</Button>}
      />
    </Grid>
  );
}

/** Mentor profile without link, with a non-numeric stat and a primary action. */
export function Mentor() {
  return (
    <ProfileCard
      style={{ maxInlineSize: '18rem' }}
      name="Elena Piras"
      jobTitle="Security Engineer"
      company="Contoso"
      headingLevel={2}
      tags={<Badge tone="danger">Security</Badge>}
      stats={[
        { label: 'mentee', value: 18 },
        { label: 'disponibilità', value: 'Mar e gio' },
      ]}
      actions={<Button size="sm">Prenota una sessione</Button>}
    />
  );
}

/** Loading speakers: SkeletonProfile keeps band, avatar, tags, stats and action in place. */
export function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={isLoading} onChange={setIsLoading}>
        Simula caricamento
      </Switch>
      <Grid minItemWidth="14rem" gap={4}>
        {['Giulia Conti', 'Marco Rossi'].map((name) => (
          <ProfileCard
            key={name}
            isLoading={isLoading}
            name={name}
            jobTitle="Speaker"
            tags={<Badge tone="brand">AI</Badge>}
            stats={[
              { label: 'talk', value: 14 },
              { label: 'articoli', value: 9 },
              { label: 'follower', value: 2100, formatOptions: compact },
            ]}
            actions={<Button size="sm">Segui</Button>}
          />
        ))}
      </Grid>
    </Stack>
  );
}
