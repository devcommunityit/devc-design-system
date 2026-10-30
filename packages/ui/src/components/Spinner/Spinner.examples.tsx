import { Button, Inline, Spinner, Text } from '@dev-community/ui';

export function Sizes() {
  return (
    <Inline gap={4} align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  );
}

export function WithText() {
  return (
    <Inline gap={2} align="center">
      <Spinner size="sm" label={null} />
      <Text>Sincronizzazione in corso…</Text>
    </Inline>
  );
}

export function InButton() {
  return <Button isPending>Salvataggio</Button>;
}