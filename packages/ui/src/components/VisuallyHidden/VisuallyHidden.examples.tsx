import { useState } from 'react';
import { Button, IconButton, Inline, List, Stack, Text, VisuallyHidden } from '@dev-community/ui';
import { Bell, Minus, Plus } from 'lucide-react';

export function Basic() {
  return (
    <Inline gap={2} align="center">
      <IconButton label="Notifiche" icon={<Bell />} variant="ghost" />
      <Text>
        3<VisuallyHidden> notifiche non lette</VisuallyHidden>
      </Text>
    </Inline>
  );
}

export function SkipLink() {
  return (
    <VisuallyHidden isFocusable>
      <a href="#contenuto">Vai al contenuto</a>
    </VisuallyHidden>
  );
}
const files = ['preventivo-acme.pdf', 'contratto-2025.docx', 'logo-definitivo.svg'];

export function RepeatedActions() {
  const [list, setList] = useState(files);
  return (
    <Stack gap={3}>
      <List variant="none">
        {list.map((f) => (
          <li key={f}>
            <Inline gap={3} align="center" justify="between">
              <Text>{f}</Text>
              <Button size="sm" variant="ghost" onPress={() => setList((l) => l.filter((x) => x !== f))}>
                Rimuovi<VisuallyHidden> {f}</VisuallyHidden>
              </Button>
            </Inline>
          </li>
        ))}
      </List>
      {list.length < files.length ? (
        <Button size="sm" variant="secondary" onPress={() => setList(files)}>
          Ripristina allegati
        </Button>
      ) : null}
    </Stack>
  );
}

export function LiveAnnouncement() {
  const [quantity, setQuantity] = useState(1);
  return (
    <Stack gap={3}>
      <Inline gap={2} align="center">
        <IconButton label="Diminuisci quantità" icon={<Minus />} variant="secondary" size="sm" onPress={() => setQuantity((q) => Math.max(1, q - 1))} isDisabled={quantity === 1} />
        <Text aria-hidden="true" weight="semibold">
          {quantity}
        </Text>
        <IconButton label="Aumenta quantità" icon={<Plus />} variant="secondary" size="sm" onPress={() => setQuantity((q) => Math.min(10, q + 1))} isDisabled={quantity === 10} />
      </Inline>
      <VisuallyHidden role="status">Quantità: {quantity}</VisuallyHidden>
      <Text variant="body-sm" tone="secondary">
        Il valore visibile è decorativo; lo screen reader riceve “Quantità: {quantity}” da una regione live nascosta.
      </Text>
    </Stack>
  );
}
