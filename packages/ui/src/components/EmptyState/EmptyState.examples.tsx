import { FolderPlus, SearchX } from 'lucide-react';
import { Button, EmptyState, Stack } from '@dev-community/ui';

export function NoData() {
  return (
    <EmptyState
      icon={<FolderPlus />}
      title="Nessun progetto"
      description="I progetti raccolgono documenti e attività del team."
      actions={<Button>Crea progetto</Button>}
    />
  );
}

export function NoResults() {
  return (
    <Stack>
      <EmptyState
        size="sm"
        headingLevel={3}
        icon={<SearchX />}
        title="Nessun risultato per “fatture 2019”"
        description="Prova con un termine diverso o rimuovi qualche filtro."
        actions={<Button variant="secondary">Azzera filtri</Button>}
      />
    </Stack>
  );
}