import { Card, CardBody, CardHeader, Grid, Ribbon, Text } from '@dev-community/ui';

export function Variants() {
  return (
    <Grid minItemWidth="15rem" gap={4}>
      <Ribbon label="Beta">
        <Card>
          <CardHeader title="Mentorship 1:1" subtitle="variant corner" headingLevel={3} />
          <CardBody>
            <Text tone="secondary">Abbina junior e senior della community per sessioni mensili.</Text>
          </CardBody>
        </Card>
      </Ribbon>
      <Ribbon label="Nuovo" variant="bookmark" tone="accent">
        <Card>
          <CardHeader title="Percorso React" subtitle="variant bookmark" headingLevel={3} />
          <CardBody>
            <Text tone="secondary">Otto moduli dai fondamenti ai Server Components.</Text>
          </CardBody>
        </Card>
      </Ribbon>
      <Ribbon label="Top contributor" variant="banner" tone="warning">
        <Card>
          <CardHeader title="Giulia Bianchi" subtitle="variant banner" headingLevel={3} />
          <CardBody>
            <Text tone="secondary">42 risposte accettate nel forum questo mese.</Text>
          </CardBody>
        </Card>
      </Ribbon>
    </Grid>
  );
}

/** Tones and logical positions: top-start mirrors automatically in RTL. */
export function TonesAndPositions() {
  return (
    <Grid minItemWidth="12rem" gap={4}>
      {(
        [
          ['brand', 'Beta', 'top-end'],
          ['accent', 'Nuovo', 'top-start'],
          ['success', 'Gratis', 'top-end'],
          ['warning', 'Ultimi posti', 'top-start'],
          ['danger', '-20%', 'top-end'],
          ['neutral', 'Sold out', 'top-start'],
        ] as const
      ).map(([tone, label, position]) => (
        <Ribbon key={tone} label={label} tone={tone} position={position}>
          <Card>
            <CardBody>
              <Text weight="semibold">Workshop di ottobre</Text>
              <Text tone="secondary">
                tone {tone} · {position}
              </Text>
            </CardBody>
          </Card>
        </Ribbon>
      ))}
    </Grid>
  );
}
