import { useState } from 'react';
import { Badge, Inline, SortableList, Stack, Switch, Text } from '@devcommunityit/ui';

interface Task {
  id: string;
  name: string;
  owner: string;
}

const tasks: Task[] = [
  { id: 'brief', name: 'Raccolta requisiti', owner: 'Giulia' },
  { id: 'design', name: 'Bozza grafica', owner: 'Marco' },
  { id: 'build', name: 'Sviluppo', owner: 'Sara' },
  { id: 'review', name: 'Revisione finale', owner: 'Luca' },
];

export function Basic() {
  return <SortableList aria-label="Priorità" defaultItems={tasks} getLabel={(t) => t.name} />;
}

/** Controlled order with custom row content; the saved order is shown below. */
export function Controlled() {
  const [items, setItems] = useState(tasks);
  return (
    <Stack gap={3}>
      <SortableList aria-label="Fasi del progetto" items={items} onReorder={setItems} getLabel={(t) => t.name}>
        {(task) => (
          <Inline gap={2} align="center" justify="between" style={{ inlineSize: '100%' }}>
            <Text as="span">{task.name}</Text>
            <Badge tone="neutral">{task.owner}</Badge>
          </Inline>
        )}
      </SortableList>
      <Text variant="body-sm" tone="secondary">Ordine: {items.map((t) => t.name).join(' → ')}</Text>
    </Stack>
  );
}

/** English labels, no move buttons, disabled state and empty state. */
export function Variants() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Stack gap={4}>
      <SortableList
        aria-label="Columns"
        defaultItems={[
          { id: 'name', label: 'Name' },
          { id: 'email', label: 'Email' },
          { id: 'role', label: 'Role' },
        ]}
        getLabel={(c) => c.label}
        showMoveButtons={false}
        isDisabled={!enabled}
      />
      <Switch isSelected={enabled} onChange={setEnabled}>
        Reordering enabled
      </Switch>
      <SortableList aria-label="Empty list" items={[]} getLabel={(c: { id: string }) => c.id} emptyState="No columns to sort." />
    </Stack>
  );
}
