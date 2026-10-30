import { ScrollArea, Stack, Text } from '@dev-community/ui';

const events = Array.from({ length: 30 }, (_, i) => {
  const minutes = String(i * 2).padStart(2, '0');
  return `09:${minutes} · Sincronizzazione completata (lotto ${i + 1})`;
});

export function VerticalLog() {
  return (
    <ScrollArea aria-label="Registro attività" maxHeight="14rem" style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-md)' }}>
      <Stack gap={2} style={{ padding: 'var(--dc-space-3)' }}>
        {events.map((e) => (
          <Text key={e} variant="body-sm">
            {e}
          </Text>
        ))}
      </Stack>
    </ScrollArea>
  );
}

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" aria-label="Filtri rapidi">
      <div style={{ display: 'flex', gap: 'var(--dc-space-2)', inlineSize: 'max-content', paddingBlock: 'var(--dc-space-2)' }}>
        {['Tutti', 'Aperti', 'In lavorazione', 'In attesa del cliente', 'Risolti', 'Chiusi', 'Archiviati', 'Spam'].map((f) => (
          <span key={f} style={{ padding: 'var(--dc-space-1) var(--dc-space-3)', borderRadius: 'var(--dc-radius-full)', background: 'var(--dc-color-surface-muted)' }}>
            {f}
          </span>
        ))}
      </div>
    </ScrollArea>
  );
}