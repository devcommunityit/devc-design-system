import { useState } from 'react';
import { Badge, Button, Heading, Inline, Stack, Text } from '@devcommunityit/ui';
import { KanbanBoard, type KanbanColumn, type KanbanMove } from '@devcommunityit/ui/widgets';

const initialColumns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', description: 'Idee da pianificare', cards: [
    { id: 'research', title: 'Interviste agli utenti', description: 'Raccogliere feedback sul nuovo portale.', labels: ['Ricerca'] },
    { id: 'metrics', title: 'Definire le metriche', labels: ['Analytics'] },
  ] },
  { id: 'todo', title: 'Da fare', description: 'Pronte per lo sviluppo', cards: [
    { id: 'search', title: 'Ricerca nel catalogo', description: 'Filtri per categoria e ricerca testuale.', labels: ['Frontend'] },
  ] },
  { id: 'doing', title: 'In corso', description: 'Attività in lavorazione', cards: [
    { id: 'design', title: 'Revisione del design', description: 'Verificare accessibilità e layout mobile.', labels: ['Design'] },
  ] },
  { id: 'review', title: 'In revisione', cards: [] },
  { id: 'done', title: 'Completato', cards: [
    { id: 'setup', title: 'Configurazione progetto', labels: ['DevOps'] },
  ] },
];

/** Column membership is the single source of truth for each task's status. */
export function Kanban() {
  const [columns, setColumns] = useState(initialColumns);
  const [activity, setActivity] = useState('Nessuna modifica.');
  const total = columns.reduce((count, column) => count + column.cards.length, 0);
  const completed = columns.find((column) => column.id === 'done')?.cards.length ?? 0;
  const announceMove = ({ card, sourceColumnId, targetColumnId, targetIndex }: KanbanMove) => {
    const source = columns.find((column) => column.id === sourceColumnId);
    const target = columns.find((column) => column.id === targetColumnId);
    if (!source || !target) return;
    setActivity(sourceColumnId === targetColumnId
      ? `${card.title}: posizione ${targetIndex + 1} in ${target.title}`
      : `${card.title}: ${source.title} → ${target.title}`);
  };
  return (
    <Stack gap={5}>
      <Inline justify="between" align="center">
        <div>
          <Heading level={1}>Kanban di progetto</Heading>
          <Text tone="secondary">Trascina le card tra colonne per cambiare stato, oppure usa il selettore e i pulsanti.</Text>
        </div>
        <Button variant="outline" onPress={() => { setColumns(initialColumns); setActivity('Bacheca ripristinata.'); }}>Ripristina bacheca</Button>
      </Inline>
      <Inline gap={3}>
        <Badge tone="brand">{total} attività</Badge>
        <Badge tone="success">{completed} completate</Badge>
      </Inline>
      <KanbanBoard aria-label="Workflow di progetto" columns={columns} onColumnsChange={setColumns} onCardMove={announceMove} showStatusSelect emptyState="Trascina qui una card" />
      <Text role="status">{activity}</Text>
      <Text variant="body-sm" tone="secondary">Demo in memoria: ricaricando la pagina si ripristinano i dati. Tastiera: Invio sulla maniglia, Tab per scegliere una colonna, frecce per la posizione, Invio per rilasciare, Esc per annullare.</Text>
    </Stack>
  );
}
