import { Button, Inline, Stack, Text } from '@dev-community/ui';

export function VerticalStack() {
  return (
    <Stack gap={3}>
      <Text variant="title-md" as="p">Riepilogo ordine</Text>
      <Text tone="secondary">3 articoli · consegna prevista giovedì</Text>
      <Inline gap={2}>
        <Button>Conferma</Button>
        <Button variant="ghost">Modifica</Button>
      </Inline>
    </Stack>
  );
}

export function InlineWrapping() {
  return (
    <Inline gap={2}>
      {['Design', 'Frontend', 'Accessibilità', 'Performance', 'Documentazione', 'Testing'].map((t) => (
        <span key={t} style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--dc-color-border-default)', borderRadius: 'var(--dc-radius-full)' }}>
          {t}
        </span>
      ))}
    </Inline>
  );
}

export function Justified() {
  return (
    <Inline justify="between" gap={4}>
      <Text weight="semibold" as="span">Fatture</Text>
      <Button size="sm" variant="outline">
        Esporta
      </Button>
    </Inline>
  );
}

export function SemanticElement() {
  return (
    <Stack as="ul" gap={2} style={{ paddingInlineStart: 0, listStyle: 'none' }}>
      <li>Elemento di lista 1</li>
      <li>Elemento di lista 2</li>
      <li>Elemento di lista 3</li>
    </Stack>
  );
}