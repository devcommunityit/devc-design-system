import { Suspense, use, useState } from 'react';
import { useParams } from 'react-router';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Code as InlineCode,
  Collapsible,
  Heading,
  Inline,
  Kbd,
  Link,
  List,
  ListItem,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from '@dev-community/ui';
import { CATEGORY_LABELS, findComponent, isComponent, loadExamples, type ComponentEntry } from '../content/components';
import { extractExample } from '../content/source';
import { Code, DocSection, ErrorBoundary, LoadError, RefTable } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
import { NotFound } from './NotFound';

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return <Text tone="secondary">Nessuna nota specifica.</Text>;
  return (
    <List>
      {items.map((item) => (
        <ListItem key={item}>{item}</ListItem>
      ))}
    </List>
  );
}

function ExampleView({ entry, name, title, description, minimal }: { entry: ComponentEntry; name: string; title: string; description?: string; minimal: boolean }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const key = entry.examplesKey;
  if (!key) return <Text tone="secondary">Nessun esempio disponibile.</Text>;
  const { module, source } = use(loadExamples(key));
  const Example = module[name];
  if (!isComponent(Example)) return <LoadError error={new Error(`Esempio "${name}" non trovato`)} />;
  const id = `esempio-${name.toLowerCase()}`;
  return (
    <DocSection title={minimal ? `Esempio minimo: ${title}` : title} id={id} level={3}>
      {description ? <Text tone="secondary">{description}</Text> : null}
      <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(k === 'code' ? 'code' : 'preview')} className="docs-example">
        <TabList aria-label={`${title}: anteprima o codice`}>
          <Tab id="preview">Anteprima</Tab>
          <Tab id="code">Codice</Tab>
        </TabList>
        <TabPanel id="preview" className="docs-example-preview">
          <ErrorBoundary fallback={(error) => <LoadError error={error} />}>
            <Example />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel id="code">
          <Code>{extractExample(source, name)}</Code>
          <Collapsible title="File completo degli esempi" className="docs-full-source">
            <Code>{source}</Code>
          </Collapsible>
        </TabPanel>
      </Tabs>
    </DocSection>
  );
}

export function ComponentPage() {
  const { slug } = useParams();
  const entry = findComponent(slug);
  if (!entry) return <NotFound />;
  const { doc } = entry;
  const importLine = `import { ${doc.exports.join(', ')} } from '@dev-community/ui';`;

  return (
    <article className="docs-article">
      <PageMeta title={doc.name} description={doc.summary} />
      <Breadcrumb>
        <BreadcrumbItem href="/">Documentazione</BreadcrumbItem>
        <BreadcrumbItem href="/componenti">Componenti</BreadcrumbItem>
        <BreadcrumbItem>{doc.name}</BreadcrumbItem>
      </Breadcrumb>
      <header className="docs-page-header">
        <Inline gap={2} align="center" wrap>
          <Badge tone="brand" variant="soft">{CATEGORY_LABELS[doc.category]}</Badge>
          {doc.status.tests.length > 0 ? (
            <Badge tone="success" variant="soft" icon={<CheckCircle2 />}>
              Testato
            </Badge>
          ) : null}
        </Inline>
        <Heading level={1}>{doc.name}</Heading>
        <Text variant="body-lg" tone="secondary">
          {doc.summary}
        </Text>
      </header>

      <DocSection title="Quando usarlo">
        <div className="docs-two-col">
          <div>
            <Heading level={3} size="title-sm">Usalo per</Heading>
            <Bullets items={doc.whenToUse} />
          </div>
          <div>
            <Heading level={3} size="title-sm">Evitalo per</Heading>
            <Bullets items={doc.whenNotToUse} />
          </div>
        </div>
      </DocSection>

      <DocSection title="Import">
        <Code language="ts">{importLine}</Code>
        <Text variant="body-sm" tone="secondary">
          Gli stili sono inclusi in <InlineCode>@dev-community/ui/styles.css</InlineCode>, da importare una sola volta nell’applicazione.
        </Text>
      </DocSection>

      <DocSection title="Esempi">
        <Suspense fallback={<Skeleton height="240px" />}>
          <ErrorBoundary fallback={(error) => <LoadError error={error} />}>
            <Stack gap={8}>
              {doc.examples.map((ex, i) => (
                <ExampleView key={ex.name} entry={entry} name={ex.name} title={ex.title} description={ex.description} minimal={i === 0} />
              ))}
            </Stack>
          </ErrorBoundary>
        </Suspense>
      </DocSection>

      <DocSection title="Props">
        {doc.props.length > 0 ? (
          <RefTable
            label={`Props di ${doc.name}`}
            columns={['Prop', 'Tipo', 'Default', 'Descrizione']}
            rows={doc.props.map((p) => [
              <InlineCode key="n">{p.required ? `${p.name}*` : p.name}</InlineCode>,
              <InlineCode key="t">{p.type}</InlineCode>,
              p.default ? <InlineCode key="d">{p.default}</InlineCode> : '—',
              p.description,
            ])}
          />
        ) : (
          <Text tone="secondary">Nessuna prop specifica oltre a quelle ereditate.</Text>
        )}
        {doc.props.some((p) => p.required) ? <Text variant="body-sm" tone="secondary">* obbligatoria</Text> : null}
        {doc.inherits ? <Text variant="body-sm" tone="secondary">Inoltre: {doc.inherits}</Text> : null}
      </DocSection>

      <DocSection title="Tastiera">
        {doc.keyboard.length > 0 ? (
          <RefTable
            label={`Interazioni da tastiera di ${doc.name}`}
            columns={['Tasti', 'Azione']}
            rows={doc.keyboard.map((k) => [<Kbd key="k">{k.keys}</Kbd>, k.action])}
          />
        ) : (
          <Text tone="secondary">Nessuna interazione da tastiera propria: il componente non è interattivo o usa elementi nativi.</Text>
        )}
      </DocSection>

      <DocSection title="Accessibilità">
        <Bullets items={doc.accessibility} />
        {doc.apg ? (
          <Link href={doc.apg} external>
            Pattern WAI-ARIA APG di riferimento <ExternalLink aria-hidden="true" size={14} />
          </Link>
        ) : null}
      </DocSection>

      <DocSection title="Comportamento responsive">
        <Bullets items={doc.responsive} />
      </DocSection>

      <DocSection title="Personalizzazione">
        <Bullets items={doc.customization} />
      </DocSection>

      <DocSection title="Errori comuni">
        <Bullets items={doc.commonMistakes} />
      </DocSection>

      <DocSection title="Stato e limiti">
        <RefTable
          label={`Stato di ${doc.name}`}
          columns={['Aspetto', 'Stato']}
          rows={[
            ['Implementato', doc.status.implemented ? 'Sì' : 'No'],
            ['Documentato', doc.status.documented ? 'Sì' : 'No'],
            ['Test', doc.status.tests.length > 0 ? doc.status.tests.join(', ') : 'Nessun test dedicato'],
          ]}
        />
        <Heading level={3} size="title-sm">Limiti noti</Heading>
        <Bullets items={doc.status.limits} />
      </DocSection>
    </article>
  );
}