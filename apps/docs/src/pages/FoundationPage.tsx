import { Suspense, useRef } from 'react';
import { useParams } from 'react-router';
import { Alert, Heading, Skeleton, Stack, Text } from '@dev-community/ui';
import { ErrorBoundary, LoadError, PageToc, PrevNext, useSectionHeadings } from '../components/Doc';
import { findFoundation, FOUNDATION_COMPONENTS, FOUNDATIONS, hasFoundationTranslation } from '../content/foundations';
import { useI18n } from '../settings';
import { NotFound } from './NotFound';
import { PageMeta } from '../components/PageMeta';

export function FoundationPage() {
  const { slug } = useParams();
  const { lang, t } = useI18n();
  const foundation = findFoundation(slug);
  const Body = foundation ? FOUNDATION_COMPONENTS[lang][foundation.slug] : undefined;
  const bodyRef = useRef<HTMLDivElement>(null);
  const headings = useSectionHeadings(bodyRef, `${slug ?? ''}-${lang}`);
  if (!foundation || !Body) return <NotFound />;

  const index = FOUNDATIONS.indexOf(foundation);
  const prev = index > 0 ? FOUNDATIONS[index - 1] : undefined;
  const next = FOUNDATIONS[index + 1];

  return (
    <article className="docs-article docs-article--toc docs-prose">
      <PageMeta title={foundation.title[lang]} description={foundation.description[lang]} />
      <div className="docs-article-head">
        <header className="docs-page-header">
          <Heading level={1}>{foundation.title[lang]}</Heading>
          <Text variant="body-lg" tone="secondary">{foundation.description[lang]}</Text>
          {hasFoundationTranslation(foundation.slug, lang) ? null : <Alert tone="info">{t.language.notTranslated}</Alert>}
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
          label={t.doc.prevNextFoundation}
          prev={prev ? { href: `/foundations/${prev.slug}`, label: prev.title[lang] } : undefined}
          next={next ? { href: `/foundations/${next.slug}`, label: next.title[lang] } : undefined}
        />
      </div>
    </article>
  );
}
