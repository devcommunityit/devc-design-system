import { Link, Stack, Text } from '@dev-community/ui';

export function Inline() {
  return (
    <Text>
      Consulta la <Link href="#installazione">guida all’installazione</Link> prima di iniziare.
    </Text>
  );
}

export function External() {
  return (
    <Text>
      Le linee guida seguono{' '}
      <Link href="https://www.w3.org/TR/WCAG22/" external>
        WCAG 2.2
      </Link>
      .
    </Text>
  );
}

export function Standalone() {
  return (
    <Stack gap={2} as="nav" aria-label="Risorse">
      <Link variant="standalone" href="#token">
        Token di design
      </Link>
      <Link variant="standalone" href="#temi">
        Temi
      </Link>
      <Link variant="standalone" href="#accessibilita">
        Accessibilità
      </Link>
    </Stack>
  );
}