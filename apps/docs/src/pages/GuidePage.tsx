import { Suspense, useRef } from "react";
import { useParams } from "react-router";
import { Alert, Heading, Skeleton, Stack, Text } from "@dev-community/ui";
import {
  findGuide,
  GUIDE_COMPONENTS,
  GUIDES,
  hasGuideTranslation,
} from "../content/guides";
import { useI18n } from "../settings";
import {
  ErrorBoundary,
  LoadError,
  PageToc,
  PrevNext,
  useSectionHeadings,
} from "../components/Doc";
import { PageMeta } from "../components/PageMeta";
import { NotFound } from "./NotFound";

export function GuidePage() {
  const { slug } = useParams();
  const { lang, t } = useI18n();
  const guide = findGuide(slug);
  const Body = guide ? GUIDE_COMPONENTS[lang][guide.slug] : undefined;
  const bodyRef = useRef<HTMLDivElement>(null);
  const headings = useSectionHeadings(bodyRef, `${slug ?? ""}-${lang}`);
  if (!guide || !Body) return <NotFound />;
  const index = GUIDES.indexOf(guide);
  const prev = index > 0 ? GUIDES[index - 1] : undefined;
  const next = GUIDES[index + 1];
  return (
    <article className="docs-article docs-article--toc docs-prose">
      <PageMeta title={guide.title[lang]} description={guide.description[lang]} />
      <div className="docs-article-head">
        <header className="docs-page-header">
          <Heading level={1}>{guide.title[lang]}</Heading>
          <Text variant="body-lg" tone="secondary">
            {guide.description[lang]}
          </Text>
          {hasGuideTranslation(guide.slug, lang) ? null : (
            <Alert tone="info">{t.language.notTranslated}</Alert>
          )}
        </header>
      </div>
      <PageToc items={headings} />
      <div className="docs-article-body">
        <div ref={bodyRef} className="docs-guide-body">
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
        </div>
        <PrevNext
          label={t.doc.prevNextGuide}
          prev={
            prev ? { href: `/guide/${prev.slug}`, label: prev.title[lang] } : undefined
          }
          next={
            next ? { href: `/guide/${next.slug}`, label: next.title[lang] } : undefined
          }
        />
      </div>
    </article>
  );
}
