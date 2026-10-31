import { Accessibility, BarChart3, Boxes, Languages, LayoutTemplate, Moon, Package, Palette, Rocket, Ruler, ShieldCheck, SlidersHorizontal, SwatchBook } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardHeader, CardLink, Grid, Heading, Inline, LinkButton, List, ListItem, Stack, Text } from '@dev-community/ui';
import { components, componentsByCategory } from '../content/components';
import { SHOWCASE } from '../content/showcase';
import { Code, DocSection } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
import type { DocsLang, Localized } from '../i18n/lang';
import { useI18n } from '../settings';

const FEATURES: Array<{ icon: ReactNode; title: Localized; text: Localized; href: string }> = [
  {
    icon: <Boxes />,
    title: { it: 'Catalogo completo', en: 'Complete catalog' },
    text: {
      it: 'Layout, tipografia, azioni, navigazione, form, dati, feedback e overlay con API coerenti.',
      en: 'Layout, typography, actions, navigation, forms, data, feedback and overlays with consistent APIs.',
    },
    href: '/componenti',
  },
  {
    icon: <Ruler />,
    title: { it: 'Fondamenta', en: 'Foundations' },
    text: {
      it: 'Typography, spacing, rounded, colors e shadows con anteprime collegate ai token del tema.',
      en: 'Typography, spacing, rounded corners, colors and shadows with previews bound to the theme tokens.',
    },
    href: '/foundations/typography',
  },
  {
    icon: <Palette />,
    title: { it: 'Temi e token', en: 'Themes and tokens' },
    text: {
      it: 'Token DTCG come unica fonte, palette preimpostate e temi personalizzati validati.',
      en: 'DTCG tokens as the single source, preset palettes and validated custom themes.',
    },
    href: '/guide/temi',
  },
  {
    icon: <Moon />,
    title: { it: 'Chiaro, scuro, sistema', en: 'Light, dark, system' },
    text: {
      it: 'Modalità e densità indipendenti dalla palette; provider annidati anche nei portal.',
      en: 'Mode and density independent of the palette; nested providers work in portals too.',
    },
    href: '/guide/temi',
  },
  {
    icon: <Accessibility />,
    title: { it: 'Accessibilità', en: 'Accessibility' },
    text: {
      it: 'HTML semantico, pattern WAI-ARIA APG e controlli axe automatici nei test.',
      en: 'Semantic HTML, WAI-ARIA APG patterns and automated axe checks in the tests.',
    },
    href: '/guide/accessibilita',
  },
  {
    icon: <Languages />,
    title: { it: 'Localizzazione e RTL', en: 'Localization and RTL' },
    text: {
      it: 'Testi di sistema traducibili, Intl per date e numeri, proprietà CSS logiche.',
      en: 'Translatable system strings, Intl for dates and numbers, logical CSS properties.',
    },
    href: '/guide/localizzazione-rtl',
  },
  {
    icon: <ShieldCheck />,
    title: { it: 'SSR e CSP', en: 'SSR and CSP' },
    text: {
      it: 'Nessun accesso al DOM all’import, script del tema esterno compatibile con CSP.',
      en: 'No DOM access at import time, an external theme script compatible with CSP.',
    },
    href: '/guide/ssr-nextjs',
  },
  {
    icon: <BarChart3 />,
    title: { it: 'Grafici e dashboard', en: 'Charts and dashboards' },
    text: {
      it: 'Grafici SVG accessibili con tabella dati, KPI, hero card, banner e menu di navigazione.',
      en: 'Accessible SVG charts with a data table, KPIs, hero cards, banners and navigation menus.',
    },
    href: '/guide/grafici-dashboard',
  },
  {
    icon: <Boxes />,
    title: { it: 'AI e gestione siti', en: 'AI and website management' },
    text: {
      it: 'Prompt, conversazioni, fonti, feedback e strumenti per workflow editoriali e anteprime SEO.',
      en: 'Prompts, conversations, sources, feedback and tools for editorial workflows and SEO previews.',
    },
    href: '/guide/ai-content',
  },
  {
    icon: <SlidersHorizontal />,
    title: { it: 'Theme Designer', en: 'Theme Designer' },
    text: {
      it: 'Scegli accento, grigi, aspetto, raggio e stile e guarda tutte le varianti dei componenti cambiare in tempo reale.',
      en: 'Pick accent, grays, appearance, radius and style and watch every component variant change in real time.',
    },
    href: '/theme-designer',
  },
  {
    icon: <SwatchBook />,
    title: { it: 'Theme Builder', en: 'Theme Builder' },
    text: {
      it: 'Crea un tema con anteprima live, controllo del contrasto ed export JSON, CSS e TypeScript.',
      en: 'Build a theme with a live preview, contrast checks and JSON, CSS and TypeScript export.',
    },
    href: '/theme-builder',
  },
  {
    icon: <LayoutTemplate />,
    title: { it: 'Pattern e template', en: 'Patterns and templates' },
    text: {
      it: 'Pagine realistiche: landing, dashboard, elenchi, form, account e stati di errore.',
      en: 'Realistic pages: landing, dashboard, lists, forms, account and error states.',
    },
    href: '/pattern',
  },
];

const COPY = {
  it: {
    title: 'Introduzione',
    eyebrow: 'Design system · v0.1.0',
    heading: 'Componenti accessibili e temi coerenti per i tuoi portali',
    lead: (n: number) =>
      `Una libreria React e TypeScript distribuibile, con token semantici, temi personalizzabili e ${n} pagine di componenti documentate e testate. Nessun router, backend o framework CSS imposto.`,
    explore: 'Esplora i componenti',
    builder: 'Apri il Theme Builder',
    includes: 'Cosa include',
    byCategory: 'Esplora per categoria',
    pages: (n: number) => (n === 1 ? '1 pagina' : `${n} pagine`),
    templates: 'Template pronti da esplorare',
    brief: 'In breve',
    principles: 'Principi e assunzioni architetturali',
  },
  en: {
    title: 'Introduction',
    eyebrow: 'Design system · v0.1.0',
    heading: 'Accessible components and consistent themes for your portals',
    lead: (n: number) =>
      `A distributable React and TypeScript library with semantic tokens, customizable themes and ${n} documented and tested component pages. No router, backend or CSS framework imposed.`,
    explore: 'Explore the components',
    builder: 'Open the Theme Builder',
    includes: 'What’s included',
    byCategory: 'Browse by category',
    pages: (n: number) => (n === 1 ? '1 page' : `${n} pages`),
    templates: 'Ready-made templates',
    brief: 'At a glance',
    principles: 'Principles and architectural assumptions',
  },
} satisfies Record<DocsLang, unknown>;

function Principles({ lang }: { lang: DocsLang }) {
  if (lang === 'en') {
    return (
      <List>
        <ListItem>
          <strong>A single source for tokens</strong>: <code>packages/ui/tokens/*.json</code> (DTCG format) generates CSS, TypeScript types and
          exports for Figma/Tokens Studio. Components only consume semantic tokens (<code>--dc-color-text-primary</code>…).
        </ListItem>
        <ListItem>
          <strong>Proven headless primitives</strong>: complex interactions (focus, selection, overlays, calendars, comboboxes) are built on React
          Aria Components; the library adds styling, consistent APIs, i18n and themes.
        </ListItem>
        <ListItem>
          <strong>Prefixed CSS Modules</strong> <code>dc-</code> and <code>--dc-*</code> variables: no global reset (the reset is optional in{' '}
          <code>@dev-community/ui/reset.css</code>), no Tailwind imposed.
        </ListItem>
        <ListItem>
          <strong>Separated layers</strong>: primitives and components in <code>packages/ui</code>; patterns, templates and demo logic in{' '}
          <code>apps/docs</code>; a separate verification consumer in <code>apps/playground</code>.
        </ListItem>
        <ListItem>
          <strong>Router and backend agnostic</strong>: links use React Aria’s <code>RouterProvider</code>; data, network and authentication stay
          with the consumer.
        </ListItem>
        <ListItem>
          <strong>React 18.3 and 19</strong> as peer dependencies; refs are forwarded with <code>forwardRef</code>, compatible with both.
        </ListItem>
      </List>
    );
  }
  return (
    <List>
      <ListItem>
        <strong>Una fonte per i token</strong>: <code>packages/ui/tokens/*.json</code> (formato DTCG) genera CSS, tipi TypeScript ed export per
        Figma/Tokens Studio. I componenti consumano solo token semantici (<code>--dc-color-text-primary</code>…).
      </ListItem>
      <ListItem>
        <strong>Primitive headless consolidate</strong>: le interazioni complesse (focus, selezione, overlay, calendari, combobox) si basano su React
        Aria Components; la libreria aggiunge stile, API coerenti, i18n e temi.
      </ListItem>
      <ListItem>
        <strong>CSS Modules con prefisso</strong> <code>dc-</code> e variabili <code>--dc-*</code>: nessun reset globale (il reset è opzionale in{' '}
        <code>@dev-community/ui/reset.css</code>), nessun Tailwind imposto.
      </ListItem>
      <ListItem>
        <strong>Separazione dei livelli</strong>: primitive e componenti in <code>packages/ui</code>; pattern, template e logica dimostrativa in{' '}
        <code>apps/docs</code>; consumer di verifica separato in <code>apps/playground</code>.
      </ListItem>
      <ListItem>
        <strong>Router e backend agnostici</strong>: i link usano il <code>RouterProvider</code> di React Aria; dati, rete e autenticazione restano
        al consumer.
      </ListItem>
      <ListItem>
        <strong>React 18.3 e 19</strong> come peer dependency; i ref sono inoltrati con <code>forwardRef</code>, compatibile con entrambe.
      </ListItem>
    </List>
  );
}

export function Home() {
  const { lang, t } = useI18n();
  const copy = COPY[lang];
  return (
    <article className="docs-article docs-article--wide">
      <PageMeta title={copy.title} description={t.site.tagline} />
      <header className="docs-hero">
        <Text variant="label-lg" tone="link">
          {copy.eyebrow}
        </Text>
        <Heading level={1} size="display" gradient>
          {copy.heading}
        </Heading>
        <Text variant="body-lg" tone="secondary" className="docs-hero-lead">
          {copy.lead(components.length)}
        </Text>
        <Inline gap={3} wrap>
          <LinkButton href="/guide/quick-start" startIcon={<Rocket />}>
            Quick start
          </LinkButton>
          <LinkButton href="/componenti" variant="secondary" startIcon={<Package />}>
            {copy.explore}
          </LinkButton>
          <LinkButton href="/theme-builder" variant="ghost" startIcon={<Palette />}>
            {copy.builder}
          </LinkButton>
        </Inline>
      </header>

      <DocSection title={copy.includes} id="cosa-include">
        <Grid minItemWidth="15rem" gap={4}>
          {FEATURES.map((f) => (
            <Card key={f.href + f.title.it} variant="filled">
              <CardHeader
                media={<span className="docs-feature-icon">{f.icon}</span>}
                headingLevel={3}
                title={<CardLink href={f.href}>{f.title[lang]}</CardLink>}
                subtitle={f.text[lang]}
              />
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection title={copy.byCategory} id="esplora-per-categoria">
        <Grid minItemWidth="13rem" gap={3}>
          {componentsByCategory(lang).map((group) => (
            <Card key={group.category} variant="outlined">
              <CardHeader
                headingLevel={3}
                title={<CardLink href={`/componenti#cat-${group.category}`}>{group.label}</CardLink>}
                subtitle={`${copy.pages(group.items.length)}: ${group.items
                  .slice(0, 4)
                  .map((c) => c.doc.name)
                  .join(', ')}${group.items.length > 4 ? '…' : ''}`}
              />
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection title={copy.templates} id="template-pronti-da-esplorare">
        <Grid minItemWidth="15rem" gap={3}>
          {SHOWCASE.map((s) => (
            <Card key={s.slug} variant="filled">
              <CardHeader headingLevel={3} title={<CardLink href={`/showcase/${s.slug}`}>{s.title[lang]}</CardLink>} subtitle={s.description[lang]} />
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection title={copy.brief} id="in-breve">
        <Code language="tsx">{`import '@dev-community/ui/styles.css';
import { Button, ThemeProvider } from '@dev-community/ui';

export function App() {
  return (
    <ThemeProvider defaultMode="system" defaultTheme="aurora">
      <Button onPress={() => alert('${lang === 'en' ? 'Hello!' : 'Ciao!'}')}>${lang === 'en' ? 'Get started' : 'Inizia'}</Button>
    </ThemeProvider>
  );
}`}</Code>
      </DocSection>

      <DocSection title={copy.principles} id="principi-e-assunzioni-architetturali">
        <Stack gap={3}>
          <Principles lang={lang} />
        </Stack>
      </DocSection>
    </article>
  );
}
