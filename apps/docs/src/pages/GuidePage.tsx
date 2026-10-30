import { Suspense } from 'react';
import { useParams } from 'react-router';
import { Heading, Skeleton, Stack, Text } from '@dev-community/ui';
import { findGuide, GUIDE_COMPONENTS } from '../content/guides';
import { ErrorBoundary, LoadError } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
import { NotFound } from './NotFound';

export function GuidePage() {
  const { slug } = useParams();
  const guide = findGuide(slug);
  const Body = guide ? GUIDE_COMPONENTS[guide.slug] : undefined;
  if (!guide || !Body) return <NotFound />;
  return (
    <article className="docs-article docs-prose">
      <PageMeta title={guide.title} description={guide.description} />
      <header className="docs-page-header">
        <Heading level={1}>{guide.title}</Heading>
        <Text variant="body-lg" tone="secondary">
          {guide.description}
        </Text>
      </header>
      <ErrorBoundary fallback={(error) => <LoadError error={error} />}>
        <Suspense
          fallback={
            <Stack gap={3}>
              <Skeleton height="24px" />
              <Skeleton height="120px" />
            </Stack>
          }
        >
          <Body />
        </Suspense>
      </ErrorBoundary>
    </article>
  );
}