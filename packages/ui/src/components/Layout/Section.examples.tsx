import { Button, Section, Text } from '@devcommunityit/ui';

export function WithHeader() {
  return (
    <Section
      title="Membri del team"
      description="Persone con accesso a questo progetto."
      actions={<Button size="sm">Invita</Button>}
      surface="subtle"
    >
      <Text>12 membri attivi, 2 inviti in attesa.</Text>
    </Section>
  );
}

export function Plain() {
  return (
    <Section spacing="sm" aria-label="Note">
      <Text tone="secondary">Sezione senza intestazione visibile, con nome accessibile esplicito.</Text>
    </Section>
  );
}