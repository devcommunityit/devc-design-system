import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge, Button, Inline, Stack, Text, VisuallyHidden } from '@dev-community/ui';

export function Tones() {
  return (
    <Inline gap={2} wrap>
      <Badge>Bozza</Badge>
      <Badge tone="brand">Nuovo</Badge>
      <Badge tone="info">In revisione</Badge>
      <Badge tone="success">Pagato</Badge>
      <Badge tone="warning">In scadenza</Badge>
      <Badge tone="danger">Scaduto</Badge>
    </Inline>
  );
}

export function Variants() {
  return (
    <Inline gap={2} wrap>
      <Badge tone="success" variant="soft">Soft</Badge>
      <Badge tone="success" variant="solid">Solid</Badge>
      <Badge tone="success" variant="outline">Outline</Badge>
      <Badge tone="success" dot>Online</Badge>
      <Badge tone="success" icon={<CheckCircle2 />}>Verified</Badge>
      <Badge tone="danger" variant="solid" size="sm">12</Badge>
    </Inline>
  );
}
export function SizesAndLongLabels() {
  return (
    <Stack gap={3}>
      <Inline gap={2} align="center" wrap>
        <Badge size="sm" tone="info">sm</Badge>
        <Badge size="md" tone="info">md</Badge>
        <Badge size="sm" tone="warning" variant="outline" dot>In revisione</Badge>
        <Badge size="md" tone="warning" variant="outline" dot>In revisione</Badge>
      </Inline>
      <div style={{ maxInlineSize: '16rem' }}>
        <Badge tone="brand">Accesso anticipato al nuovo modulo di fatturazione elettronica</Badge>
      </div>
      <Inline gap={2} wrap>
        <Badge tone="success" lang="en">Paid</Badge>
        <Badge tone="success">Pagato</Badge>
        <Badge tone="danger" lang="en">Overdue</Badge>
        <Badge tone="danger">Scaduto</Badge>
      </Inline>
    </Stack>
  );
}

export function LiveCount() {
  const [count, setCount] = useState(3);
  const display = count > 99 ? '99+' : String(count);
  return (
    <Stack gap={3}>
      <Inline gap={2} align="center">
        <Text>Messaggi</Text>
        {count > 0 ? (
          <Badge tone={count > 9 ? 'danger' : 'brand'} variant="solid" size="sm">
            {display}
            <VisuallyHidden> non letti</VisuallyHidden>
          </Badge>
        ) : (
          <Badge size="sm">Nessun messaggio non letto</Badge>
        )}
      </Inline>
      <Inline gap={2} wrap>
        <Button size="sm" variant="secondary" onPress={() => setCount((c) => c + 1)}>
          Nuovo messaggio
        </Button>
        <Button size="sm" variant="secondary" onPress={() => setCount((c) => c + 50)}>
          +50 messaggi
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setCount(0)} isDisabled={count === 0}>
          Segna tutti come letti
        </Button>
      </Inline>
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        Valore attuale: {count}. Oltre 9 il tono diventa “danger”, oltre 99 si mostra “99+”.
      </Text>
    </Stack>
  );
}
