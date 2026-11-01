import { useState } from 'react';
import { FlaskConical, Sparkles } from 'lucide-react';
import { Button, Heading, Inline, Link, Stack, StageLabel, Text } from '@devcommunityit/ui';

export function Stages() {
  return (
    <Inline gap={2} wrap>
      <StageLabel stage="alpha" />
      <StageLabel stage="beta" />
      <StageLabel stage="preview" />
      <StageLabel stage="demo" />
      <StageLabel stage="new" />
      <StageLabel stage="experimental" />
      <StageLabel stage="deprecated" />
      <StageLabel stage="comingSoon" />
    </Inline>
  );
}

/** Chip next to a heading or a navigation entry, with custom text and icon. */
export function InContext() {
  return (
    <Stack gap={3}>
      <Inline gap={2} align="center">
        <Heading level={3}>Mentorship 1:1</Heading>
        <StageLabel stage="beta" />
      </Inline>
      <Inline gap={2} align="center">
        <Text>Ricerca semantica nei talk</Text>
        <StageLabel stage="experimental" size="sm" icon={<FlaskConical />} />
      </Inline>
      <Inline gap={2} align="center">
        <Text>Badge della community</Text>
        <StageLabel stage="new" size="sm" icon={<Sparkles />}>
          Novità
        </StageLabel>
      </Inline>
    </Stack>
  );
}

/** Full-width site strip, dismissible, with a feedback link. */
export function Banner() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Stack gap={3}>
      <StageLabel
        stage="demo"
        variant="banner"
        description="Ambiente demo: i dati vengono azzerati ogni notte."
        action={<Link href="#feedback">Invia feedback</Link>}
        onDismiss={() => setVisible(false)}
      />
      <StageLabel stage="beta" variant="banner" description="Il nuovo portale eventi è in beta: alcune funzioni potrebbero cambiare." />
    </Stack>
  ) : (
    <Button variant="secondary" onPress={() => setVisible(true)}>
      Mostra di nuovo il banner
    </Button>
  );
}
