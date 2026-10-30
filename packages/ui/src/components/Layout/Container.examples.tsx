import { Container, Text } from '@dev-community/ui';

const demo = { background: 'var(--dc-color-surface-subtle)', border: '1px dashed var(--dc-color-border-default)', paddingBlock: 'var(--dc-space-4)' };

export function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 'var(--dc-space-3)' }}>
      {(['sm', 'md', 'prose'] as const).map((size) => (
        <Container key={size} size={size} style={demo}>
          <Text as="span" variant="label-md">size=&quot;{size}&quot;</Text>
        </Container>
      ))}
    </div>
  );
}

export function WithoutGutters() {
  return (
    <Container size="md" disableGutters style={demo}>
      <Text as="span">Senza padding laterale (es. dentro una Card che ha già il suo padding).</Text>
    </Container>
  );
}