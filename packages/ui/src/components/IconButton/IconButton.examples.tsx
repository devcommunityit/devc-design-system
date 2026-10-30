import { Bell, Pencil, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { IconButton, Inline, Text } from '@dev-community/ui';

export function Basic() {
  const [count, setCount] = useState(0);
  return (
    <Inline gap={2} align="center" wrap>
      <IconButton label="Impostazioni" icon={<Settings />} onPress={() => setCount((c) => c + 1)} />
      <IconButton label="Modifica" icon={<Pencil />} variant="outline" onPress={() => setCount((c) => c + 1)} />
      <IconButton label="Elimina" icon={<Trash2 />} variant="danger" onPress={() => setCount((c) => c + 1)} />
      <Text tone="secondary" variant="body-sm" aria-live="polite">
        Pressioni: {count}
      </Text>
    </Inline>
  );
}

export function Sizes() {
  return (
    <Inline gap={2} align="center">
      <IconButton size="sm" label="Notifiche (piccolo)" icon={<Bell />} variant="outline" />
      <IconButton size="md" label="Notifiche (medio)" icon={<Bell />} variant="outline" />
      <IconButton size="lg" label="Notifiche (grande)" icon={<Bell />} variant="outline" />
    </Inline>
  );
}

export function States() {
  return (
    <Inline gap={2} align="center">
      <IconButton label="Disabilitato" icon={<Settings />} variant="outline" isDisabled />
      <IconButton label="Salvataggio in corso" icon={<Settings />} variant="primary" isPending />
    </Inline>
  );
}