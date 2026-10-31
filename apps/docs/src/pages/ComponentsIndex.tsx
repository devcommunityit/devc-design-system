import { useMemo, useState } from 'react';
import { Badge, Card, CardHeader, CardLink, Grid, Heading, Inline, SearchInput, Stack, Text } from '@dev-community/ui';
import { components, componentsByCategory } from '../content/components';
import { DocSection, RefTable } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
import type { DocsLang } from '../i18n/lang';
import { useEnglishSummaries } from '../i18n/componentDocs';
import { useI18n } from '../settings';

const COPY = {
  it: {
    title: 'Catalogo componenti',
    description: 'Tutti i componenti del design system, per categoria, con la matrice di stato.',
    lead: (pages: number, exports: number, examples: number, tested: number) =>
      `${pages} pagine di documentazione che coprono ${exports} export pubblici, con ${examples} esempi interattivi; ${tested} pagine con test automatici dedicati.`,
    categories: 'Categorie di componenti',
    matrix: 'Matrice',
    filter: 'Filtra il catalogo',
    limits: (n: number) => (n === 1 ? '1 limite noto' : `${n} limiti noti`),
    matrixTitle: 'Matrice del catalogo',
    matrixNote:
      'Generata dai metadati di ogni componente (*.meta.ts), la stessa fonte usata da Storybook. «Test» elenca i file di test che lo coprono.',
    matrixLabel: 'Matrice di stato dei componenti',
    columns: ['Componente', 'Export', 'Esempi', 'Implementato', 'Documentato', 'Test', 'Limiti'],
  },
  en: {
    title: 'Component catalog',
    description: 'Every design system component, by category, with the status matrix.',
    lead: (pages: number, exports: number, examples: number, tested: number) =>
      `${pages} documentation pages covering ${exports} public exports, with ${examples} interactive examples; ${tested} pages have dedicated automated tests.`,
    categories: 'Component categories',
    matrix: 'Matrix',
    filter: 'Filter the catalog',
    limits: (n: number) => (n === 1 ? '1 known limit' : `${n} known limits`),
    matrixTitle: 'Catalog matrix',
    matrixNote: 'Generated from each component’s metadata (*.meta.ts), the same source Storybook uses. “Tests” lists the test files covering it.',
    matrixLabel: 'Component status matrix',
    columns: ['Component', 'Exports', 'Examples', 'Implemented', 'Documented', 'Tests', 'Limits'],
  },
} satisfies Record<DocsLang, unknown>;

function matches(query: string, haystack: string[], locale: string): boolean {
  const q = query.trim().toLocaleLowerCase(locale);
  return q === '' || haystack.some((h) => h.toLocaleLowerCase(locale).includes(q));
}

export function ComponentsIndex() {
  const { lang, t } = useI18n();
  const copy = COPY[lang];
  const summaries = useEnglishSummaries(lang);
  const summaryOf = (slug: string, fallback: string) => summaries?.SUMMARIES[slug] ?? fallback;
  const [query, setQuery] = useState('');
  const allGroups = useMemo(() => componentsByCategory(lang), [lang]);
  const groups = useMemo(
    () =>
      allGroups
        .map((g) => ({
          ...g,
          items: g.items.filter((c) => matches(query, [c.doc.name, c.doc.summary, summaries?.SUMMARIES[c.doc.slug] ?? '', ...c.doc.exports], lang)),
        }))
        .filter((g) => g.items.length > 0),
    [allGroups, query, summaries, lang],
  );
  const exportsCount = components.reduce((n, c) => n + c.doc.exports.length, 0);
  const tested = components.filter((c) => c.doc.status.tests.length > 0).length;
  const examplesCount = components.reduce((n, c) => n + c.doc.examples.length, 0);
  const yes = t.component.yes;
  const no = t.component.no;

  return (
    <article className="docs-article docs-article--wide">
      <PageMeta title={copy.title} description={copy.description} />
      <header className="docs-page-header">
        <Heading level={1}>{copy.title}</Heading>
        <Text variant="body-lg" tone="secondary">
          {copy.lead(components.length, exportsCount, examplesCount, tested)}
        </Text>
      </header>
      <nav aria-label={copy.categories} className="docs-category-nav">
        <ul>
          {allGroups.map((group) => (
            <li key={group.category}>
              <a href={`#cat-${group.category}`}>
                {group.label} <span className="docs-category-count">{group.items.length}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#matrice">{copy.matrix}</a>
          </li>
        </ul>
      </nav>
      <SearchInput label={copy.filter} value={query} onChange={setQuery} className="docs-filter" />
      {groups.length === 0 ? <Text role="status">{t.nav.noMatches(query)}</Text> : null}
      {groups.map((group) => (
        <DocSection key={group.category} title={group.label} id={`cat-${group.category}`}>
          <Grid minItemWidth="16rem" gap={4}>
            {group.items.map(({ doc }) => (
              <Card key={doc.slug} variant="outlined">
                <CardHeader headingLevel={3} title={<CardLink href={`/componenti/${doc.slug}`}>{doc.name}</CardLink>} subtitle={summaryOf(doc.slug, doc.summary)} />
                {doc.status.limits.length > 0 ? (
                  <Inline gap={1}>
                    <Badge tone="warning" variant="soft" size="sm">
                      {copy.limits(doc.status.limits.length)}
                    </Badge>
                  </Inline>
                ) : null}
              </Card>
            ))}
          </Grid>
        </DocSection>
      ))}

      <DocSection title={copy.matrixTitle} id="matrice">
        <Stack gap={2}>
          <Text tone="secondary">{copy.matrixNote}</Text>
          <RefTable
            label={copy.matrixLabel}
            columns={copy.columns}
            rows={components.map(({ doc }) => [
              doc.name,
              doc.exports.join(', '),
              String(doc.examples.length),
              doc.status.implemented ? yes : no,
              doc.status.documented ? yes : no,
              doc.status.tests.length > 0 ? doc.status.tests.join(', ') : '—',
              doc.status.limits.length > 0 ? doc.status.limits.join(' · ') : '—',
            ])}
          />
        </Stack>
      </DocSection>
    </article>
  );
}
