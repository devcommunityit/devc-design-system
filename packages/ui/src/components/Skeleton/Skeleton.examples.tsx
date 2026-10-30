import { useState } from 'react';
import { Button, Inline, Skeleton, Stack, Text, VisuallyHidden } from '@dev-community/ui';

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