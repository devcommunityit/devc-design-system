import { Card, CardBody, Inline, Sparkline, Stack, Text } from '@devcommunityit/ui';

const signups = [12, 18, 15, 22, 19, 27, 31, 29, 35, 33, 41, 44];

export function Basic() {
  return <Sparkline label="Iscrizioni settimanali" data={signups} />;
}

export function Area() {
  return <Sparkline label="Weekly revenue" variant="area" colorIndex={3} width={160} height={40} data={[4200, 3900, 4800, 5100, 4700, 5600, 6100]} formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} />;
}

export function Colors() {
  return (
    <Inline gap={4} wrap align="center">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sparkline key={i} label={`Serie ${i + 1}`} colorIndex={i} data={signups.map((v, k) => v + ((k * (i + 2)) % 7))} />
      ))}
    </Inline>
  );
}

export function InCard() {
  return (
    <Card style={{ maxInlineSize: 320 }}>
      <CardBody>
        <Stack gap={2}>
          <Text variant="label-md" tone="secondary">
            Ordini (ultimi 12 giorni)
          </Text>
          <Inline gap={3} align="center" justify="between">
            <Text variant="headline-sm" weight="semibold">
              1.284
            </Text>
            <Sparkline label="Ordini giornalieri" variant="area" data={[88, 94, 101, 97, 110, 105, 118, 112, 125, 121, 130, 134]} />
          </Inline>
        </Stack>
      </CardBody>
    </Card>
  );
}
