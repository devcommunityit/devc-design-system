import { Fragment, useState } from 'react';
import { Button, Inline, ScrollArea, Stack, Text } from '@devcommunityit/ui';

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
const frame = { border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-md)' };

export function DynamicContent() {
  const [count, setCount] = useState(2);
  const items = Array.from({ length: count }, (_, i) => `Commento ${i + 1}: grazie per l’aggiornamento, verifico e ti rispondo entro oggi.`);
  return (
    <Stack gap={3}>
      <Inline gap={2} wrap>
        <Button size="sm" onPress={() => setCount((n) => n + 3)}>
          Aggiungi 3 commenti
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setCount(2)} isDisabled={count === 2}>
          Ripristina
        </Button>
      </Inline>
      <ScrollArea aria-label="Commenti del ticket" maxHeight="10rem" style={frame}>
        <Stack gap={2} style={{ padding: 'var(--dc-space-3)' }}>
          {items.map((c) => (
            <Text key={c} variant="body-sm">
              {c}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        {count} commenti. Quando il contenuto supera l’altezza massima l’area diventa una regione raggiungibile con Tab e scorribile con le frecce.
      </Text>
    </Stack>
  );
}

const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const teams = ['Vendite', 'Supporto', 'Marketing', 'Sviluppo', 'Amministrazione', 'Logistica', 'Acquisti', 'Risorse umane'];

export function BothDirections() {
  return (
    <ScrollArea orientation="both" maxHeight="12rem" aria-label="Ore lavorate per reparto e mese" style={frame}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `10rem repeat(${months.length}, 4.5rem)`,
          gap: 'var(--dc-space-2)',
          padding: 'var(--dc-space-3)',
          inlineSize: 'max-content',
        }}
      >
        <span />
        {months.map((m) => (
          <Text key={m} variant="label-md" weight="semibold">
            {m}
          </Text>
        ))}
        {teams.map((team, r) => (
          <Fragment key={team}>
            <Text variant="label-md" weight="semibold">
              {team}
            </Text>
            {months.map((m, c) => (
              <Text key={m} variant="body-sm">
                {120 + ((r * 37 + c * 13) % 60)} h
              </Text>
            ))}
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
