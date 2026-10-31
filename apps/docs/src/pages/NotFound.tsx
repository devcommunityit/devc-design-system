import { useLocation } from 'react-router';
import { FileQuestion } from 'lucide-react';
import { LinkButton, EmptyState, Inline } from '@dev-community/ui';
import { PageMeta } from '../components/PageMeta';
import { useI18n } from '../settings';

export function NotFound() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const m = t.notFound;
  return (
    <article className="docs-article">
      <PageMeta title={m.title} description={m.description} />
      <EmptyState
        icon={<FileQuestion />}
        title={m.title}
        headingLevel={1}
        description={m.body(pathname)}
        actions={
          <Inline gap={2} wrap>
            <LinkButton href="/">{m.home}</LinkButton>
            <LinkButton href="/componenti" variant="secondary">
              {m.catalog}
            </LinkButton>
          </Inline>
        }
      />
    </article>
  );
}