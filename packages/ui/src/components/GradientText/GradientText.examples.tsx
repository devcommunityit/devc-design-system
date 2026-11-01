import { GradientText, Heading, Stack } from '@dev-community/ui';

export function Basic() {
  return (
    <Heading level={2}>
      La community dove gli sviluppatori <GradientText>imparano, condividono e crescono.</GradientText>
    </Heading>
  );
}

export function Tones() {
  return (
    <Stack gap={4}>
      <Heading level={3}>
        Tono <GradientText>brand</GradientText>
      </Heading>
      <Heading level={3}>
        Tono <GradientText tone="text">text</GradientText> per il testo corrente
      </Heading>
      <div
        style={{
          padding: 'var(--dc-space-6)',
          borderRadius: 'var(--dc-radius-xl)',
          backgroundColor: 'var(--dc-color-surface-inverse)',
          color: 'var(--dc-color-text-inverse)',
        }}
      >
        <Heading level={3} tone="inherit">
          Su hero scura: <GradientText tone="inverse" as="strong">impara e condividi</GradientText>
        </Heading>
      </div>
    </Stack>
  );
}
