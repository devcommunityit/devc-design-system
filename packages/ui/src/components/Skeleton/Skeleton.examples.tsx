import { useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, CardHeader, Inline, Skeleton, Stack, Text, VisuallyHidden } from '@dev-community/ui';

export function Shapes() {
  return (
    <Stack gap={3} aria-busy="true">
      <VisuallyHidden>Caricamento…</VisuallyHidden>
      <Inline gap={3} align="center">
        <Skeleton shape="circle" width="3rem" />
        <Skeleton lines={2} width="60%" />
      </Inline>
      <Skeleton shape="rect" height="8rem" />
    </Stack>
  );
}

export function Toggle() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={3}>
      <Button size="sm" variant="secondary" onPress={() => setLoading((l) => !l)}>
        {loading ? 'Mostra contenuto' : 'Mostra skeleton'}
      </Button>
      <div aria-busy={loading}>{loading ? (<><VisuallyHidden>Caricamento…</VisuallyHidden><Skeleton lines={3} /></>) : <Text>Il contenuto reale occupa lo stesso spazio dello skeleton, evitando spostamenti del layout.</Text>}</div>
    </Stack>
  );
}
export function CardPlaceholder() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={3}>
      <Button size="sm" variant="secondary" onPress={() => setLoading((l) => !l)}>
        {loading ? 'Mostra la scheda caricata' : 'Simula di nuovo il caricamento'}
      </Button>
      <div style={{ maxInlineSize: '24rem' }} aria-busy={loading}>
        <Card>
          {loading ? (
            <CardBody>
              <VisuallyHidden role="status">Caricamento del profilo…</VisuallyHidden>
              <Stack gap={4}>
                <Inline gap={3} align="center">
                  <Skeleton shape="circle" width="3rem" height="3rem" />
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </Stack>
                </Inline>
                <Skeleton shape="rect" height="7rem" />
                <Skeleton lines={3} />
                <Inline gap={2}>
                  <Skeleton shape="rect" width="6rem" height="2.5rem" />
                  <Skeleton shape="rect" width="6rem" height="2.5rem" />
                </Inline>
              </Stack>
            </CardBody>
          ) : (
            <>
              <CardHeader
                headingLevel={3}
                media={<Avatar name="Giulia Bianchi" isDecorative />}
                title="Giulia Bianchi"
                subtitle="Product designer · Bologna"
              />
              <CardBody>
                <Stack gap={3}>
                  <Text>
                    Coordina il design system del portale clienti e cura le linee guida di accessibilità per i team di sviluppo.
                  </Text>
                  <Inline gap={2}>
                    <Badge tone="success" dot>
                      Disponibile
                    </Badge>
                    <Badge tone="info">12 progetti</Badge>
                  </Inline>
                </Stack>
              </CardBody>
            </>
          )}
        </Card>
      </div>
    </Stack>
  );
}

export function ListPlaceholder() {
  return (
    <Stack gap={3} aria-busy="true">
      <VisuallyHidden>Caricamento dei contatti…</VisuallyHidden>
      {['a', 'b', 'c', 'd'].map((key, i) => (
        <Inline key={key} gap={3} align="center">
          <Skeleton shape="circle" width="2.5rem" height="2.5rem" />
          <Stack gap={1} style={{ flex: 1 }}>
            <Skeleton width={`${70 - i * 10}%`} />
            <Skeleton width={`${45 - i * 5}%`} />
          </Stack>
          <Skeleton shape="rect" width="4rem" height="1.5rem" />
        </Inline>
      ))}
    </Stack>
  );
}
