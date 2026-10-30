import { Card, CardHeader, CardLink, Grid, Heading, List, ListItem, Text } from '@dev-community/ui';
import { SHOWCASE } from '../content/showcase';
import { DocSection } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';

export function PatternsIndex() {
  return (
    <article className="docs-article docs-article--wide">
      <PageMeta title="Pattern e template" description="Pagine realistiche costruite solo con i componenti della libreria." />
      <header className="docs-page-header">
        <Heading level={1}>Pattern e template</Heading>
        <Text variant="body-lg" tone="secondary">
          Pagine complete costruite esclusivamente con i componenti pubblici di <code>@dev-community/ui</code> e dati locali deterministici. Si
          aprono a tutta pagina, fuori dalla documentazione.
        </Text>
      </header>
      <DocSection title="Template disponibili">
        <Grid minItemWidth="16rem" gap={4}>
          {SHOWCASE.map((s) => (
            <Card key={s.slug} variant="outlined">
              <CardHeader
                headingLevel={3}
                title={
                  <CardLink href={`/showcase/${s.slug}`}>
                    {s.title}
                  </CardLink>
                }
                subtitle={s.description}
              />
            </Card>
          ))}
        </Grid>
      </DocSection>
      <DocSection title="Cosa è reale e cosa è simulato">
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
      </DocSection>
      <DocSection title="Pattern ricorrenti">
        <List>
          <ListItem>Intestazione di pagina: Breadcrumb + Heading livello 1 + azioni primarie a destra (si impilano su mobile).</ListItem>
          <ListItem>Elenco: barra filtri sopra la DataTable; filtri attivi come Tag rimovibili; azioni di massa visibili solo con una selezione.</ListItem>
          <ListItem>Form: Fieldset per gruppi, errori sotto il campo e riepilogo con link ai campi al submit.</ListItem>
          <ListItem>Feedback: Toast per conferme non critiche, Alert persistente per errori che richiedono azione.</ListItem>
          <ListItem>Stati: Skeleton durante il caricamento, EmptyState per nessun dato o nessun risultato, Alert per errori con “Riprova”.</ListItem>
        </List>
      </DocSection>
    </article>
  );
}