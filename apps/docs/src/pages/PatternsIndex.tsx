import { Card, CardHeader, CardLink, Grid, Heading, List, ListItem, Text } from '@dev-community/ui';
import { components } from '../content/components';
import { SHOWCASE } from '../content/showcase';
import { DocSection } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
import { useEnglishSummaries } from '../i18n/componentDocs';
import { useI18n } from '../settings';

const PAGE_PATTERNS = components.filter((c) => c.doc.category === 'patterns');

export function PatternsIndex() {
  const { lang } = useI18n();
  const summaries = useEnglishSummaries(lang);
  const en = lang === 'en';
  return (
    <article className="docs-article docs-article--wide">
      <PageMeta
        title={en ? 'Patterns and templates' : 'Pattern e template'}
        description={en ? 'Realistic pages built only with the library components.' : 'Pagine realistiche costruite solo con i componenti della libreria.'}
      />
      <header className="docs-page-header">
        <Heading level={1}>{en ? 'Patterns and templates' : 'Pattern e template'}</Heading>
        <Text variant="body-lg" tone="secondary">
          {en ? (
            <>
              Complete pages built exclusively with the public components of <code>@dev-community/ui</code> and deterministic local data. They open
              full screen, outside the documentation; their sample content is in Italian.
            </>
          ) : (
            <>
              Pagine complete costruite esclusivamente con i componenti pubblici di <code>@dev-community/ui</code> e dati locali deterministici. Si
              aprono a tutta pagina, fuori dalla documentazione.
            </>
          )}
        </Text>
      </header>
      <DocSection title={en ? 'Available templates' : 'Template disponibili'} id="template-disponibili">
        <Grid minItemWidth="16rem" gap={4}>
          {SHOWCASE.map((s) => (
            <Card key={s.slug} variant="outlined">
              <CardHeader headingLevel={3} title={<CardLink href={`/showcase/${s.slug}`}>{s.title[lang]}</CardLink>} subtitle={s.description[lang]} />
            </Card>
          ))}
        </Grid>
      </DocSection>
      {PAGE_PATTERNS.length > 0 ? (
        <DocSection title={en ? 'Page pattern components' : 'Componenti pattern di pagina'} id="componenti-pattern-di-pagina">
          <Grid minItemWidth="16rem" gap={4}>
            {PAGE_PATTERNS.map(({ doc }) => (
              <Card key={doc.slug} variant="filled">
                <CardHeader
                  headingLevel={3}
                  title={<CardLink href={`/componenti/${doc.slug}`}>{doc.name}</CardLink>}
                  subtitle={summaries?.SUMMARIES[doc.slug] ?? doc.summary}
                />
              </Card>
            ))}
          </Grid>
        </DocSection>
      ) : null}
      <DocSection title={en ? 'What is real and what is simulated' : 'Cosa è reale e cosa è simulato'} id="cosa-e-reale-e-cosa-e-simulato">
        {en ? (
          <List>
            <ListItem>
              <strong>Real</strong>: all component interaction (filters, sorting, selection, form validation, theme and density preferences applied
              to the site, keyboard navigation).
            </ListItem>
            <ListItem>
              <strong>Local simulation</strong>: saves, submissions and loads only change the page’s in-memory state, with a declared artificial
              delay; no data leaves the browser.
            </ListItem>
            <ListItem>
              <strong>Left to the consumer</strong>: network calls, authentication, authorization, data persistence, server-side validation. The
              sign-in templates are not an authentication system.
            </ListItem>
          </List>
        ) : (
          <List>
            <ListItem>
              <strong>Reale</strong>: tutta l’interazione dei componenti (filtri, ordinamento, selezione, validazione dei form, preferenze di tema e
              densità applicate al sito, navigazione da tastiera).
            </ListItem>
            <ListItem>
              <strong>Simulazione locale</strong>: salvataggi, invii e caricamenti modificano solo lo stato in memoria della pagina, con un ritardo
              artificiale dichiarato; nessun dato lascia il browser.
            </ListItem>
            <ListItem>
              <strong>Lasciato al consumer</strong>: chiamate di rete, autenticazione, autorizzazione, persistenza dei dati, validazione lato server. I
              template di accesso non sono un sistema di autenticazione.
            </ListItem>
          </List>
        )}
      </DocSection>
      <DocSection title={en ? 'Recurring patterns' : 'Pattern ricorrenti'} id="pattern-ricorrenti">
        {en ? (
          <List>
            <ListItem>Page header: Breadcrumb + level 1 Heading + primary actions on the right (they stack on mobile).</ListItem>
            <ListItem>List: filter bar above the DataTable; active filters as removable Tags; bulk actions visible only with a selection.</ListItem>
            <ListItem>Form: Fieldset for groups, errors below the field and a summary linking to the fields on submit.</ListItem>
            <ListItem>Feedback: Toast for non-critical confirmations, a persistent Alert for errors that require action.</ListItem>
            <ListItem>States: Skeleton while loading, EmptyState for no data or no results, Alert for errors with “Retry”.</ListItem>
          </List>
        ) : (
          <List>
            <ListItem>Intestazione di pagina: Breadcrumb + Heading livello 1 + azioni primarie a destra (si impilano su mobile).</ListItem>
            <ListItem>Elenco: barra filtri sopra la DataTable; filtri attivi come Tag rimovibili; azioni di massa visibili solo con una selezione.</ListItem>
            <ListItem>Form: Fieldset per gruppi, errori sotto il campo e riepilogo con link ai campi al submit.</ListItem>
            <ListItem>Feedback: Toast per conferme non critiche, Alert persistente per errori che richiedono azione.</ListItem>
            <ListItem>Stati: Skeleton durante il caricamento, EmptyState per nessun dato o nessun risultato, Alert per errori con “Riprova”.</ListItem>
          </List>
        )}
      </DocSection>
    </article>
  );
}
