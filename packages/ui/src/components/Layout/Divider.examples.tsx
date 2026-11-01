import { Button, Divider, Inline, Spacer, Stack, Text } from '@devcommunityit/ui';

export function Horizontal() {
  return (
    <Stack gap={0}>
      <Text>Sopra</Text>
      <Divider spacing={4} />
      <Text>Sotto</Text>
    </Stack>
  );
}

export function WithLabel() {
  return (
    <Stack gap={3} style={{ maxInlineSize: '22rem' }}>
      <Button variant="outline" fullWidth>
        Accedi con SSO aziendale
      </Button>
      <Divider label="oppure" />
      <Button fullWidth>Accedi con email</Button>
    </Stack>
  );
}

export function Vertical() {
  return (
    <Inline gap={3} align="stretch" wrap={false}>
      <Text as="span">Bozze</Text>
      <Divider orientation="vertical" />
      <Text as="span">Pubblicati</Text>
    </Inline>
  );
}

export function PushApart() {
  return (
    <Inline wrap={false}>
      <Text as="span" weight="semibold">Logo</Text>
      <Spacer />
      <Button size="sm" variant="ghost">
        Accedi
      </Button>
    </Inline>
  );
}