import { Accessibility, BarChart3, Boxes, Languages, LayoutTemplate, Moon, Package, Palette, Rocket, ShieldCheck, SwatchBook } from 'lucide-react';
import { Card, CardHeader, CardLink, Grid, Heading, Inline, LinkButton, List, ListItem, Stack, Text } from '@dev-community/ui';
import { components, componentsByCategory } from '../content/components';
import { SHOWCASE } from '../content/showcase';
import { Code, DocSection } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';

const FEATURES = [
  { icon: <Boxes />, title: 'Catalogo completo', text: 'Layout, tipografia, azioni, navigazione, form, dati, feedback e overlay con API coerenti.', href: '/componenti' },
  { icon: <Palette />, title: 'Temi e token', text: 'Token DTCG come unica fonte, palette preimpostate e temi personalizzati validati.', href: '/guide/temi' },
  { icon: <Moon />, title: 'Chiaro, scuro, sistema', text: 'Modalità e densità indipendenti dalla palette; provider annidati anche nei portal.', href: '/guide/temi' },
  { icon: <Accessibility />, title: 'Accessibilità', text: 'HTML semantico, pattern WAI-ARIA APG e controlli axe automatici nei test.', href: '/guide/accessibilita' },
  { icon: <Languages />, title: 'Localizzazione e RTL', text: 'Testi di sistema traducibili, Intl per date e numeri, proprietà CSS logiche.', href: '/guide/localizzazione-rtl' },
  { icon: <ShieldCheck />, title: 'SSR e CSP', text: 'Nessun accesso al DOM all’import, script del tema esterno compatibile con CSP.', href: '/guide/ssr-nextjs' },
  { icon: <BarChart3 />, title: 'Grafici e dashboard', text: 'Grafici SVG accessibili con tabella dati, KPI, hero card, banner e menu di navigazione.', href: '/guide/grafici-dashboard' },
  { icon: <SwatchBook />, title: 'Theme Builder', text: 'Crea un tema con anteprima live, controllo del contrasto ed export JSON, CSS e TypeScript.', href: '/theme-builder' },
  { icon: <LayoutTemplate />, title: 'Pattern e template', text: 'Pagine realistiche: landing, dashboard, elenchi, form, account e stati di errore.', href: '/pattern' },
];

export function Home() {
  return (
    <article className="docs-article docs-article--wide">
      <PageMeta title="Introduzione" description="Design system React e TypeScript per portali, siti pubblici e dashboard." />
      <header className="docs-hero">
        <Text variant="label-lg" tone="link">
          Design system · v0.1.0
        </Text>
        <Heading level={1} size="display" gradient>
          Componenti accessibili e temi coerenti per i tuoi portali
        </Heading>
        <Text variant="body-lg" tone="secondary" className="docs-hero-lead">
          Una libreria React e TypeScript distribuibile, con token semantici, temi personalizzabili e {components.length} pagine di componenti
          documentate e testate. Nessun router, backend o framework CSS imposto.
        </Text>
        <Inline gap={3} wrap>
          <LinkButton href="/guide/quick-start" startIcon={<Rocket />}>
            Quick start
          </LinkButton>
          <LinkButton href="/componenti" variant="secondary" startIcon={<Package />}>
            Esplora i componenti
          </LinkButton>
          <LinkButton href="/theme-builder" variant="ghost" startIcon={<Palette />}>
            Apri il Theme Builder
          </LinkButton>
        </Inline>
      </header>

      <DocSection title="Cosa include">
        <Grid minItemWidth="15rem" gap={4}>
          {FEATURES.map((f) => (
            <Card key={f.title} variant="filled">
              <CardHeader media={<span className="docs-feature-icon">{f.icon}</span>} headingLevel={3} title={<CardLink href={f.href}>{f.title}</CardLink>} subtitle={f.text} />
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection title="Esplora per categoria">
        <Grid minItemWidth="13rem" gap={3}>
          {componentsByCategory().map((group) => (
            <Card key={group.category} variant="outlined">
              <CardHeader
                headingLevel={3}
                title={<CardLink href={`/componenti#cat-${group.category}`}>{group.label}</CardLink>}
                subtitle={`${group.items.length} ${group.items.length === 1 ? 'pagina' : 'pagine'}: ${group.items
                  .slice(0, 4)
                  .map((c) => c.doc.name)
                  .join(', ')}${group.items.length > 4 ? '…' : ''}`}
              />
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection title="Template pronti da esplorare">
        <Grid minItemWidth="15rem" gap={3}>
          {SHOWCASE.map((s) => (
            <Card key={s.slug} variant="filled">
              <CardHeader headingLevel={3} title={<CardLink href={`/showcase/${s.slug}`}>{s.title}</CardLink>} subtitle={s.description} />
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection title="In breve">
        <Code language="tsx">{`import '@dev-community/ui/styles.css';
import { Button, ThemeProvider } from '@dev-community/ui';

export function App() {
  return (
    <ThemeProvider defaultMode="system" defaultTheme="aurora">
      <Button onPress={() => alert('Ciao!')}>Inizia</Button>
    </ThemeProvider>
  );
}`}</Code>
      </DocSection>

      <DocSection title="Principi e assunzioni architetturali">
        <Stack gap={3}>
          <List>
            <ListItem>
              <strong>Una fonte per i token</strong>: <code>packages/ui/tokens/*.json</code> (formato DTCG) genera CSS, tipi TypeScript ed export per
              Figma/Tokens Studio. I componenti consumano solo token semantici (<code>--dc-color-text-primary</code>…).
            </ListItem>
            <ListItem>
              <strong>Primitive headless consolidate</strong>: le interazioni complesse (focus, selezione, overlay, calendari, combobox) si basano su
              React Aria Components; la libreria aggiunge stile, API coerenti, i18n e temi.
            </ListItem>
            <ListItem>
              <strong>CSS Modules con prefisso</strong> <code>dc-</code> e variabili <code>--dc-*</code>: nessun reset globale (il reset è opzionale
              in <code>@dev-community/ui/reset.css</code>), nessun Tailwind imposto.
            </ListItem>
            <ListItem>
              <strong>Separazione dei livelli</strong>: primitive e componenti in <code>packages/ui</code>; pattern, template e logica dimostrativa in
              <code>apps/docs</code>; consumer di verifica separato in <code>apps/playground</code>.
            </ListItem>
            <ListItem>
              <strong>Router e backend agnostici</strong>: i link usano il <code>RouterProvider</code> di React Aria; dati, rete e autenticazione
              restano al consumer.
            </ListItem>
            <ListItem>
              <strong>React 18.3 e 19</strong> come peer dependency; i ref sono inoltrati con <code>forwardRef</code>, compatibile con entrambe.
            </ListItem>
          </List>
        </Stack>
      </DocSection>
    </article>
  );
}