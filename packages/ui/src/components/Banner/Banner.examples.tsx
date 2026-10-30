import { useState } from 'react';
import { Banner, Button, Link, Stack } from '@dev-community/ui';

export function Basic() {
  return (
    <Stack gap={2}>
      <Banner tone="neutral" action={<Link href="#novita">Scopri le novità</Link>}>
        Il nuovo pannello report è disponibile per tutti.
      </Banner>
      <Banner tone="warning">Manutenzione programmata sabato dalle 22:00 alle 23:00.</Banner>
      <Banner tone="danger">Alcuni servizi non rispondono. Stiamo indagando.</Banner>
    </Stack>
  );
}

export function Dismissible() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner tone="info" onDismiss={() => setOpen(false)}>
      Questo sito usa solo cookie tecnici.
    </Banner>
  ) : (
    <Button variant="secondary" onPress={() => setOpen(true)}>
      Mostra banner
    </Button>
  );
}