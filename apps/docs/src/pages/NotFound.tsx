import { useLocation } from 'react-router';
import { FileQuestion } from 'lucide-react';
import { LinkButton, EmptyState, Inline } from '@dev-community/ui';
import { PageMeta } from '../components/PageMeta';

export function NotFound() {
  const { pathname } = useLocation();
  return (
    <article className="docs-article">
      <PageMeta title="Pagina non trovata" description="La pagina richiesta non esiste." />
      <EmptyState
        icon={<FileQuestion />}
        title="Pagina non trovata"
        headingLevel={1}
        description={`Non esiste alcuna pagina all’indirizzo ${pathname}. Controlla il link oppure usa la ricerca (Ctrl K).`}
        actions={
          <Inline gap={2} wrap>
            <LinkButton href="/">Torna all’introduzione</LinkButton>
            <LinkButton href="/componenti" variant="secondary">
              Catalogo componenti
            </LinkButton>
          </Inline>
        }
      />
    </article>
  );
}