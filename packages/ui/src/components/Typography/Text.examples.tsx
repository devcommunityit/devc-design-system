import { Heading, Stack, Text } from '@dev-community/ui';

export function Scale() {
  return (
    <Stack gap={2}>
      <Text variant="display" as="p">Display</Text>
      <Text variant="headline-lg" as="p">Headline large</Text>
      <Text variant="headline-md" as="p">Headline medium</Text>
      <Text variant="title-lg" as="p">Title large</Text>
      <Text variant="title-md" as="p">Title medium</Text>
      <Text variant="body-lg">Body large: testo introduttivo e paragrafi in evidenza.</Text>
      <Text variant="body-md">Body medium: testo corrente predefinito.</Text>
      <Text variant="body-sm">Body small: note e testo secondario.</Text>
      <Text variant="label-md" as="span">Label medium</Text>
    </Stack>
  );
}

export function Tones() {
  return (
    <Stack gap={1}>
      <Text tone="primary">Primario</Text>
      <Text tone="secondary">Secondario</Text>
      <Text tone="muted">Attenuato</Text>
      <Text tone="success">Operazione riuscita</Text>
      <Text tone="warning">Attenzione: quota quasi esaurita</Text>
      <Text tone="danger">Errore di sincronizzazione</Text>
    </Stack>
  );
}

export function HeadingLevels() {
  return (
    <Stack gap={2}>
      <Heading level={2}>Heading h2 (headline-md)</Heading>
      <Heading level={3}>Heading h3 (headline-sm)</Heading>
      <Heading level={2} size="title-md">
        Heading h2 con aspetto title-md
      </Heading>
    </Stack>
  );
}

export function GradientHeading() {
  return (
    <Heading level={2} size="display" gradient>
      Interfacce che si adattano al tuo brand
    </Heading>
  );
}

export function SingleLineTruncate() {
  return (
    <div style={{ maxInlineSize: '16rem' }}>
      <Text truncate title="Fattura n. 2025/000184 — Servizi di consulenza per la migrazione dell’infrastruttura">
        Fattura n. 2025/000184 — Servizi di consulenza per la migrazione dell’infrastruttura
      </Text>
    </div>
  );
}