import { useMemo, useState } from 'react';
import { Badge, Card, CardHeader, CardLink, Grid, Heading, Inline, SearchInput, Stack, Text } from '@dev-community/ui';
import { components, componentsByCategory } from '../content/components';
import { DocSection, RefTable } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';

function matches(query: string, haystack: string[]): boolean {
  const q = query.trim().toLocaleLowerCase('it');
  return q === '' || haystack.some((h) => h.toLocaleLowerCase('it').includes(q));
}

export function ComponentsIndex() {
  const [query, setQuery] = useState('');
  const groups = useMemo(
    () =>
      componentsByCategory()
        .map((g) => ({ ...g, items: g.items.filter((c) => matches(query, [c.doc.name, c.doc.summary, ...c.doc.exports])) }))
        .filter((g) => g.items.length > 0),
    [query],
  );
  const exportsCount = components.reduce((n, c) => n + c.doc.exports.length, 0);
  const tested = components.filter((c) => c.doc.status.tests.length > 0).length;
  const examplesCount = components.reduce((n, c) => n + c.doc.examples.length, 0);

  return (
    <article className="docs-article docs-article--wide">
      <PageMeta title="Catalogo componenti" description="Tutti i componenti del design system, per categoria, con la matrice di stato." />
      <header className="docs-page-header">
        <Heading level={1}>Catalogo componenti</Heading>
        <Text variant="body-lg" tone="secondary">
          {components.length} pagine di documentazione che coprono {exportsCount} export pubblici, con {examplesCount} esempi interattivi; {tested}{' '}
          pagine con test automatici dedicati.
        </Text>
      </header>
      <nav aria-label="Categorie di componenti" className="docs-category-nav">
        <ul>
          {componentsByCategory().map((group) => (
            <li key={group.category}>
              <a href={`#cat-${group.category}`}>
                {group.label} <span className="docs-category-count">{group.items.length}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#matrice">Matrice</a>
          </li>
        </ul>
      </nav>
      <SearchInput label="Filtra il catalogo" value={query} onChange={setQuery} className="docs-filter" />
      {groups.length === 0 ? <Text role="status">Nessun componente corrisponde a “{query}”.</Text> : null}
      {groups.map((group) => (
        <DocSection key={group.category} title={group.label} id={`cat-${group.category}`}>
          <Grid minItemWidth="16rem" gap={4}>
            {group.items.map(({ doc }) => (
              <Card key={doc.slug} variant="outlined">
                <CardHeader headingLevel={3} title={<CardLink href={`/componenti/${doc.slug}`}>{doc.name}</CardLink>} subtitle={doc.summary} />
                {doc.status.limits.length > 0 ? (
                  <Inline gap={1}>
                    <Badge tone="warning" variant="soft" size="sm">
                      {doc.status.limits.length === 1 ? '1 limite noto' : `${doc.status.limits.length} limiti noti`}
                    </Badge>
                  </Inline>
                ) : null}
              </Card>
            ))}
          </Grid>
        </DocSection>
      ))}

      <DocSection title="Matrice del catalogo" id="matrice">
        <Stack gap={2}>
          <Text tone="secondary">
            Generata dai metadati di ogni componente (<code>*.meta.ts</code>), la stessa fonte usata da Storybook. «Testato» elenca i file di test che lo
            coprono.
          </Text>
          <RefTable
            label="Matrice di stato dei componenti"
            columns={['Componente', 'Export', 'Esempi', 'Implementato', 'Documentato', 'Test', 'Limiti']}
            rows={components.map(({ doc }) => [
              doc.name,
              doc.exports.join(', '),
              String(doc.examples.length),
              doc.status.implemented ? 'Sì' : 'No',
              doc.status.documented ? 'Sì' : 'No',
              doc.status.tests.length > 0 ? doc.status.tests.join(', ') : '—',
              doc.status.limits.length > 0 ? doc.status.limits.join(' · ') : '—',
            ])}
          />
        </Stack>
      </DocSection>
    </article>
  );
}