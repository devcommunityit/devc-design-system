import { useState } from 'react';
import { Button, ButtonGroup, Stack, Text } from '@dev-community/ui';

export function Basic() {
  const [last, setLast] = useState('nessuna');
  return (
    <Stack gap={3}>
      <ButtonGroup aria-label="Azioni documento">
        <Button variant="outline" onPress={() => setLast('Duplica')}>Duplica</Button>
        <Button variant="outline" onPress={() => setLast('Archivia')}>Archivia</Button>
        <Button variant="danger" onPress={() => setLast('Elimina')}>Elimina</Button>
      </ButtonGroup>
      <Text variant="body-sm" tone="secondary" aria-live="polite">Ultima azione: {last}</Text>
    </Stack>
  );
}

export function Attached() {
  const [format, setFormat] = useState('');
  return (
    <Stack gap={3}>
      <ButtonGroup aria-label="Esporta" attached>
        <Button variant="outline" onPress={() => setFormat('CSV')}>CSV</Button>
        <Button variant="outline" onPress={() => setFormat('XLSX')}>XLSX</Button>
        <Button variant="outline" onPress={() => setFormat('PDF')}>PDF</Button>
      </ButtonGroup>
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        {format ? `Formato scelto: ${format} (simulazione locale, nessun file generato)` : 'Scegli un formato'}
      </Text>
    </Stack>
  );
}

export function Vertical() {
  return (
    <ButtonGroup aria-label="Navigazione rapida" orientation="vertical" attached>
      <Button variant="outline">Primo</Button>
      <Button variant="outline">Secondo</Button>
      <Button variant="outline">Terzo</Button>
    </ButtonGroup>
  );
}