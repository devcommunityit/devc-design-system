import { useState } from 'react';
import { Badge, Stack, Text } from '@dev-community/ui';
import { KanbanBoard, type KanbanColumn } from '@dev-community/ui/widgets';

const initialColumns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', cards: [{ id: 'brief', title: 'Write project brief', labels: ['Planning'] }] },
  { id: 'active', title: 'In progress', cards: [{ id: 'layout', title: 'Review page layout', description: 'Check the mobile breakpoint.' }] },
  { id: 'done', title: 'Done', cards: [] },
];

export function Basic() {
  return <KanbanBoard aria-label="Website project" defaultColumns={initialColumns} />;
}

export function Controlled() {
  const [columns, setColumns] = useState(initialColumns);
  return (
    <Stack gap={3}>
      <KanbanBoard aria-label="Website project" columns={columns} onColumnsChange={setColumns} />
      <Text variant="body-sm" tone="secondary">
        {columns.reduce((count, column) => count + column.cards.length, 0)} cards · drag a card or use the move controls.
      </Text>
    </Stack>
  );
}

export function Workflow() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'todo', title: 'Da fare', cards: [{ id: 'a', title: 'Definire i requisiti' }, { id: 'b', title: 'Preparare i mockup' }] },
    { id: 'doing', title: 'In corso', cards: [{ id: 'c', title: 'Sviluppare i componenti' }] },
    { id: 'review', title: 'In revisione', cards: [] },
    { id: 'done', title: 'Completato', cards: [] },
  ]);
  return (
    <Stack gap={3}>
      <KanbanBoard aria-label="Workflow" columns={columns} onColumnsChange={setColumns} showStatusSelect />
      <Text>{columns.find((column) => column.id === 'done')?.cards.length ?? 0} attività completate</Text>
    </Stack>
  );
}

export function CustomCards() {
  return (
    <KanbanBoard
      aria-label="Release plan"
      defaultColumns={initialColumns}
      renderCard={(card) => (
        <Stack gap={1}>
          <Text weight="semibold">{card.title}</Text>
          {card.labels?.map((label) => <Badge key={label} tone="neutral">{label}</Badge>)}
        </Stack>
      )}
    />
  );
}
