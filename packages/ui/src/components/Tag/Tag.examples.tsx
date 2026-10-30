import { useState } from 'react';
import { Tag, TagGroup, Stack, Text, type Selection } from '@dev-community/ui';

export function Basic() {
  return (
    <TagGroup label="Tecnologie">
      <Tag id="react">React</Tag>
      <Tag id="ts">TypeScript</Tag>
      <Tag id="css">CSS</Tag>
    </TagGroup>
  );
}

export function Removable() {
  const [tags, setTags] = useState([
    { id: 'urgent', name: 'Urgente' },
    { id: 'billing', name: 'Fatturazione' },
    { id: 'vip', name: 'Cliente VIP' },
  ]);
  return (
    <TagGroup
      label="Etichette del ticket"
      items={tags}
      onRemove={(keys) => setTags((prev) => prev.filter((t) => !keys.has(t.id)))}
      renderEmptyState={() => 'Nessuna etichetta'}
    >
      {(tag) => <Tag id={tag.id}>{tag.name}</Tag>}
    </TagGroup>
  );
}

export function Selectable() {
  const [selected, setSelected] = useState<Selection>(new Set(['open']));
  return (
    <Stack gap={2}>
      <TagGroup label="Filtra per stato" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
        <Tag id="open">Aperti</Tag>
        <Tag id="pending">In attesa</Tag>
        <Tag id="closed">Chiusi</Tag>
      </TagGroup>
      <Text variant="body-sm" tone="secondary">
        Filtri: {selected === 'all' ? 'tutti' : [...selected].join(', ') || 'nessuno'}
      </Text>
    </Stack>
  );
}

export function Sizes() {
  return (
    <Stack gap={3}>
      <TagGroup label="Small" size="sm">
        <Tag id="a">Bozza</Tag>
        <Tag id="b">Pubblicato</Tag>
      </TagGroup>
      <TagGroup label="Medium" size="md">
        <Tag id="a">Bozza</Tag>
        <Tag id="b">Pubblicato</Tag>
      </TagGroup>
    </Stack>
  );
}