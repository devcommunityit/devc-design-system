import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, CardImage, CardLink, Grid, Text } from '@devcommunityit/ui';

export function Basic() {
  return (
    <Card style={{ maxInlineSize: 420 }}>
      <CardHeader title="Rinnovo contratto" subtitle="Scade il 30 giugno 2025" />
      <CardBody>
        <Text>Il contratto di assistenza per la sede di Bologna va rinnovato entro fine mese.</Text>
      </CardBody>
      <CardFooter>
        <Button variant="secondary">Posticipa</Button>
        <Button>Rinnova</Button>
      </CardFooter>
    </Card>
  );
}

export function Variants() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap={4}>
      {(['outlined', 'elevated', 'filled', 'accent'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader title={`Variante ${variant}`} headingLevel={3} />
          <CardBody>
            <Text tone="secondary">Stessa struttura, diversa enfasi della superficie.</Text>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}

const articles = [
  { id: 'a1', title: 'Guida alla migrazione dei token', tag: 'Guida', minutes: 6 },
  { id: 'a2', title: 'Accessibilità dei componenti overlay', tag: 'Accessibilità', minutes: 9 },
  { id: 'a3', title: 'Temi personalizzati per i portali', tag: 'Temi', minutes: 4 },
];

export function LinkedCards() {
  return (
    <Grid as="ul" columns={{ base: 1, md: 3 }} gap={4} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {articles.map((article) => (
        <Card as="li" key={article.id}>
          <CardImage ratio={16 / 9}>
            <div aria-hidden="true" style={{ inlineSize: '100%', blockSize: '100%', background: 'var(--dc-color-surface-muted)' }} />
          </CardImage>
          <CardHeader title={<CardLink href={`#${article.id}`}>{article.title}</CardLink>} headingLevel={3} subtitle={`${article.minutes} min di lettura`} />
          <CardBody>
            <Badge tone="info">{article.tag}</Badge>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}

const plans = ['Starter', 'Business', 'Enterprise'] as const;

export function Selectable() {
  const [selected, setSelected] = useState<(typeof plans)[number]>('Business');
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={4} role="group" aria-label="Piano">
      {plans.map((plan) => (
        <Card key={plan} isSelected={selected === plan} padding="md">
          <CardHeader title={plan} headingLevel={3} />
          <CardFooter justify="start">
            <Button variant={selected === plan ? 'primary' : 'secondary'} aria-pressed={selected === plan} onPress={() => setSelected(plan)}>
              {selected === plan ? 'Selezionato' : 'Scegli'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );
}