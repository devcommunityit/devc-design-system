import { Suspense, useRef } from 'react';
import { useParams } from 'react-router';
import { Heading, Skeleton, Stack, Text } from '@dev-community/ui';
import { ErrorBoundary, LoadError, PageToc, PrevNext, useSectionHeadings } from '../components/Doc';
import { findFoundation, FOUNDATION_COMPONENTS, FOUNDATIONS } from '../content/foundations';
import { NotFound } from './NotFound';
import { PageMeta } from '../components/PageMeta';

export function FoundationPage() {
  const { slug } = useParams();
  const foundation = findFoundation(slug);
  const Body = foundation ? FOUNDATION_COMPONENTS[foundation.slug] : undefined;
  const bodyRef = useRef<HTMLDivElement>(null);
  const headings = useSectionHeadings(bodyRef, slug ?? '');
  if (!foundation || !Body) return <NotFound />;

  const index = FOUNDATIONS.indexOf(foundation);
  const prev = index > 0 ? FOUNDATIONS[index - 1] : undefined;
  const next = FOUNDATIONS[index + 1];

  return (
    <article className="docs-article docs-article--toc docs-prose">
      <PageMeta title={foundation.title} description={foundation.description} />
      <div className="docs-article-head">
        <header className="docs-page-header">
          <Heading level={1}>{foundation.title}</Heading>
          <Text variant="body-lg" tone="secondary">{foundation.description}</Text>
        </header>
      </div>
      <PageToc items={headings} />
      <div className="docs-article-body">
        <div ref={bodyRef} className="docs-guide-body">
          <ErrorBoundary fallback={(error) => <LoadError error={error} />}>
            <Suspense fallback={<Stack gap={3}><Skeleton height="24px" /><Skeleton height="120px" /></Stack>}>
              <Body />
            </Suspense>
          </ErrorBoundary>
        </div>
        <PrevNext
          label="Fondamenta precedente e successiva"
          prev={prev ? { href: `/foundations/${prev.slug}`, label: prev.title } : undefined}
          next={next ? { href: `/foundations/${next.slug}`, label: next.title } : undefined}
        />
      </div>
    </article>
  );
}
