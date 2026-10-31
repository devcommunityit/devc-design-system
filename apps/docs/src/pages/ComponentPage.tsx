import { Suspense, use, useState } from "react";
import { useParams } from "react-router";
import { BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import {
  Alert,
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
} from "@dev-community/ui";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  categoryLabel,
  components,
  findComponent,
  isComponent,
  loadExamples,
  type ComponentEntry,
} from "../content/components";
import { extractExample, slugify } from "../content/source";
import {
  Code,
  DocSection,
  ErrorBoundary,
  LoadError,
  PageToc,
  PrevNext,
  RefTable,
  type TocItem,
} from "../components/Doc";
import { HAS_STORYBOOK, STORYBOOK_PATH } from "../base";
import { PageMeta } from "../components/PageMeta";
import { NotFound } from "./NotFound";
import { useI18n } from "../settings";
import { loadEnglishOverlays, localizeDoc } from "../i18n/componentDocs";
import type { Messages } from "../i18n/messages";

function Bullets({ items }: { items: string[] }) {
  const { t } = useI18n();
  if (items.length === 0)
    return <Text tone="secondary">{t.component.noNotes}</Text>;
  return (
    <List>
      {items.map((item) => (
        <ListItem key={item}>{item}</ListItem>
      ))}
    </List>
  );
}

/** Storybook story id (same sanitising rule as Storybook's `toId`). */
function storyId(category: string, name: string, exportName: string): string {
  const sanitize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return `${sanitize(`${category}/${name}`)}--${sanitize(exportName)}`;
}

/** Components in sidebar order (category, then name): used for previous/next links. */
const ORDERED = CATEGORY_ORDER.flatMap((category) =>
  components.filter((c) => c.doc.category === category),
);

/** Section anchors stay the Italian slugs in every language, so shared links keep working. */
const SECTIONS = [
  ["usage", "Quando usarlo"],
  ["import", "Import"],
  ["examples", "Esempi"],
  ["props", "Props"],
  ["keyboard", "Tastiera"],
  ["accessibility", "Accessibilità"],
  ["responsive", "Comportamento responsive"],
  ["customization", "Personalizzazione"],
  ["mistakes", "Errori comuni"],
  ["status", "Stato e limiti"],
] as const satisfies ReadonlyArray<readonly [keyof Messages["component"]["sections"], string]>;

const SECTION_ID = Object.fromEntries(
  SECTIONS.map(([key, title]) => [key, slugify(title)]),
) as Record<(typeof SECTIONS)[number][0], string>;

function ExampleView({
  entry,
  name,
  title,
  description,
  minimal,
}: {
  entry: ComponentEntry;
  name: string;
  title: string;
  description?: string;
  minimal: boolean;
}) {
  const { t } = useI18n();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const key = entry.examplesKey;
  if (!key) return <Text tone="secondary">{t.component.noExamples}</Text>;
  const { module, source } = use(loadExamples(key));
  const Example = module[name];
  if (!isComponent(Example))
    return <LoadError error={new Error(t.component.exampleNotFound(name))} />;
  const id = `esempio-${name.toLowerCase()}`;
  return (
    <DocSection
      title={minimal ? t.component.minimalExample(title) : title}
      id={id}
      level={3}
    >
      {description ? <Text tone="secondary">{description}</Text> : null}
      <Tabs
        selectedKey={tab}
        onSelectionChange={(k) => setTab(k === "code" ? "code" : "preview")}
        className="docs-example"
      >
        <TabList aria-label={t.component.previewOrCode(title)}>
          <Tab id="preview">{t.component.preview}</Tab>
          <Tab id="code">{t.component.code}</Tab>
        </TabList>
        <TabPanel id="preview" className="docs-example-preview">
          <ErrorBoundary fallback={(error) => <LoadError error={error} />}>
            <Example />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel id="code">
          <Code>{extractExample(source, name)}</Code>
          {HAS_STORYBOOK ? (
            <Link
              href={`${STORYBOOK_PATH}?path=/story/${storyId(CATEGORY_LABELS[entry.doc.category], entry.doc.name, name)}`}
              variant="standalone"
            >
              <BookOpen aria-hidden="true" size={14} />{" "}
              {t.component.openStorybook(title)}
            </Link>
          ) : null}
          <Collapsible
            title={t.component.fullSource}
            className="docs-full-source"
          >
            <Code>{source}</Code>
          </Collapsible>
        </TabPanel>
      </Tabs>
    </DocSection>
  );
}

export function ComponentPage() {
  const { slug } = useParams();
  const { lang, t } = useI18n();
  const entry = findComponent(slug);
  // Suspends once (DocsLayout's Suspense) while the English overlays load.
  const overlays = lang === "en" ? use(loadEnglishOverlays()) : undefined;
  if (!entry) return <NotFound />;
  const overlay = overlays?.[entry.doc.slug];
  const doc = localizeDoc(entry.doc, overlay);
  const c = t.component;
  const isPattern = doc.category === "patterns";
  const index = ORDERED.indexOf(entry);
  const prev = index > 0 ? ORDERED[index - 1] : undefined;
  const next = index >= 0 ? ORDERED[index + 1] : undefined;
  const toc: TocItem[] = SECTIONS.map(([key]) => ({
    id: SECTION_ID[key],
    label: c.sections[key],
    children:
      key === "examples"
        ? doc.examples.map((ex, i) => ({
            id: `esempio-${ex.name.toLowerCase()}`,
            label: i === 0 ? c.minimalExample(ex.title) : ex.title,
          }))
        : undefined,
  }));
  const importLine = `import { ${doc.exports.join(", ")} } from '@dev-community/ui${doc.entry ? `/${doc.entry}` : ""}';`;

  return (
    <article className="docs-article docs-article--toc">
      <PageMeta title={doc.name} description={doc.summary} />
      <div className="docs-article-head">
        <Breadcrumb>
          <BreadcrumbItem href="/">{t.site.docs}</BreadcrumbItem>
          {isPattern ? (
            <BreadcrumbItem href="/pattern">{t.areas.patterns}</BreadcrumbItem>
          ) : (
            <BreadcrumbItem href="/componenti">{t.areas.components}</BreadcrumbItem>
          )}
          <BreadcrumbItem>{doc.name}</BreadcrumbItem>
        </Breadcrumb>
        <header className="docs-page-header">
          <Inline gap={2} align="center" wrap>
            <Badge tone="brand" variant="soft">
              {categoryLabel(doc.category, lang)}
            </Badge>
            {doc.status.tests.length > 0 ? (
              <Badge tone="success" variant="soft" icon={<CheckCircle2 />}>
                {c.tested}
              </Badge>
            ) : null}
          </Inline>
          <Heading level={1}>{doc.name}</Heading>
          <Text variant="body-lg" tone="secondary">
            {doc.summary}
          </Text>
          {lang === "en" && !overlay ? (
            <Alert tone="info">{c.fallback}</Alert>
          ) : null}
        </header>
      </div>

      <PageToc items={toc} />

      <div className="docs-article-body">
        <DocSection title={c.sections.usage} id={SECTION_ID.usage}>
          <div className="docs-two-col">
            <div>
              <Heading level={3} size="title-sm">
                {c.useFor}
              </Heading>
              <Bullets items={doc.whenToUse} />
            </div>
            <div>
              <Heading level={3} size="title-sm">
                {c.avoidFor}
              </Heading>
              <Bullets items={doc.whenNotToUse} />
            </div>
          </div>
        </DocSection>

        <DocSection title={c.sections.import} id={SECTION_ID.import}>
          <Code language="ts">{importLine}</Code>
          <Text variant="body-sm" tone="secondary">
            {c.stylesNote[0]}
            <InlineCode>@dev-community/ui/styles.css</InlineCode>
            {c.stylesNote[1]}
          </Text>
        </DocSection>

        <DocSection title={c.sections.examples} id={SECTION_ID.examples}>
          {lang === "en" ? (
            <Text variant="body-sm" tone="secondary">
              {c.examplesLanguage}
            </Text>
          ) : null}
          <Suspense fallback={<Skeleton height="240px" />}>
            <ErrorBoundary fallback={(error) => <LoadError error={error} />}>
              <Stack gap={8}>
                {doc.examples.map((ex, i) => (
                  <ExampleView
                    key={ex.name}
                    entry={entry}
                    name={ex.name}
                    title={ex.title}
                    description={ex.description}
                    minimal={i === 0}
                  />
                ))}
              </Stack>
            </ErrorBoundary>
          </Suspense>
        </DocSection>

        <DocSection title={c.sections.props} id={SECTION_ID.props}>
          {doc.props.length > 0 ? (
            <RefTable
              label={c.propsOf(doc.name)}
              columns={c.propColumns}
              rows={doc.props.map((p) => [
                <InlineCode key="n">
                  {p.required ? `${p.name}*` : p.name}
                </InlineCode>,
                <InlineCode key="t">{p.type}</InlineCode>,
                p.default ? <InlineCode key="d">{p.default}</InlineCode> : "—",
                p.description,
              ])}
            />
          ) : (
            <Text tone="secondary">{c.noProps}</Text>
          )}
          {doc.props.some((p) => p.required) ? (
            <Text variant="body-sm" tone="secondary">
              {c.required}
            </Text>
          ) : null}
          {doc.inherits ? (
            <Text variant="body-sm" tone="secondary">
              {c.inherits} {doc.inherits}
            </Text>
          ) : null}
        </DocSection>

        <DocSection title={c.sections.keyboard} id={SECTION_ID.keyboard}>
          {doc.keyboard.length > 0 ? (
            <RefTable
              label={c.keyboardOf(doc.name)}
              columns={c.keyboardColumns}
              rows={doc.keyboard.map((k) => [
                <Kbd key="k">{k.keys}</Kbd>,
                k.action,
              ])}
            />
          ) : (
            <Text tone="secondary">{c.noKeyboard}</Text>
          )}
        </DocSection>

        <DocSection title={c.sections.accessibility} id={SECTION_ID.accessibility}>
          <Bullets items={doc.accessibility} />
          {doc.apg ? (
            <Link href={doc.apg} external>
              {c.apg}{" "}
              <ExternalLink aria-hidden="true" size={14} />
            </Link>
          ) : null}
        </DocSection>

        <DocSection title={c.sections.responsive} id={SECTION_ID.responsive}>
          <Bullets items={doc.responsive} />
        </DocSection>

        <DocSection title={c.sections.customization} id={SECTION_ID.customization}>
          <Bullets items={doc.customization} />
        </DocSection>

        <DocSection title={c.sections.mistakes} id={SECTION_ID.mistakes}>
          <Bullets items={doc.commonMistakes} />
        </DocSection>

        <DocSection title={c.sections.status} id={SECTION_ID.status}>
          <RefTable
            label={c.statusOf(doc.name)}
            columns={c.statusColumns}
            rows={[
              [c.implemented, doc.status.implemented ? c.yes : c.no],
              [c.documented, doc.status.documented ? c.yes : c.no],
              [
                c.tests,
                doc.status.tests.length > 0
                  ? doc.status.tests.join(", ")
                  : c.noTests,
              ],
            ]}
          />
          <Heading level={3} size="title-sm">
            {c.limits}
          </Heading>
          <Bullets items={doc.status.limits} />
        </DocSection>

        <PrevNext
          label={t.doc.prevNextComponent}
          prev={
            prev
              ? { href: `/componenti/${prev.doc.slug}`, label: prev.doc.name }
              : undefined
          }
          next={
            next
              ? { href: `/componenti/${next.doc.slug}`, label: next.doc.name }
              : undefined
          }
        />
      </div>
    </article>
  );
}
