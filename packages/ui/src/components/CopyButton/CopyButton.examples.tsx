import { useState } from 'react';
import { Button, Code, CopyButton, Inline, Stack, Text } from '@devcommunityit/ui';

export function Basic() {
  return (
    <Inline gap={3} align="center">
      <Code>npm install @devcommunityit/ui</Code>
      <CopyButton value="npm install @devcommunityit/ui" />
    </Inline>
  );
}

export function IconOnly() {
  return (
    <Inline gap={2} align="center">
      <Text variant="body-sm">ID ordine: ORD-2024-00187</Text>
      <CopyButton value="ORD-2024-00187" iconOnly size="sm" variant="ghost">
        Copia ID ordine
      </CopyButton>
    </Inline>
  );
}

/** The value is computed at press time; the callbacks report the outcome (also when the browser denies access). */
export function WithCallbacks() {
  const [log, setLog] = useState('Nessuna copia');
  const [count, setCount] = useState(3);
  return (
    <Stack gap={3}>
      <Inline gap={2} align="center">
        <Text variant="body-sm">Invito con {count} posti</Text>
        <CopyButton
          value={() => `https://portal.example/invite?seats=${count}`}
          onCopy={(text) => setLog(`Copiato: ${text}`)}
          onCopyError={() => setLog('Copia non riuscita: permesso negato o API non disponibile')}
        >
          Copy invite link
        </CopyButton>
        <Button variant="ghost" onPress={() => setCount((c) => c + 1)}>
          Aggiungi posto
        </Button>
      </Inline>
      <CopyButton value="non disponibile" isDisabled>
        Copia (disabilitato)
      </CopyButton>
      <Text variant="body-sm" tone="secondary" role="status">
        {log}
      </Text>
    </Stack>
  );
}
