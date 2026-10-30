import { useState } from 'react';
import { Pagination, Stack, Text } from '@dev-community/ui';

export function Uncontrolled() {
  return <Pagination totalPages={12} defaultPage={4} />;
}

export function Controlled() {
  const [page, setPage] = useState(1);
  return (
    <Stack gap={3}>
      <Pagination totalPages={48} page={page} onPageChange={setPage} showFirstLast />
      <Text variant="body-sm" tone="secondary">
        Pagina selezionata: {page}. Il consumer carica i dati della pagina.
      </Text>
    </Stack>
  );
}

export function WithLinks() {
  return <Pagination totalPages={6} defaultPage={2} getPageHref={(p) => `#pagina-${p}`} size="sm" />;
}
