import { Alert } from '@dev-community/ui';
import { DocSection, RefTable } from '../components/Doc';

export default function Figma() {
  return (
    <>
      <Alert tone="warning" title="Il file Figma non è stato creato">
        Nell’ambiente in cui è stato sviluppato il design system non erano disponibili strumenti autorizzati con accesso in scrittura a Figma. Non
        esiste quindi una libreria Figma nativa: sono disponibili token in formato standard, specifiche dei componenti e la procedura per costruirla.
        I file JSON non sono una libreria Figma e non esiste sincronizzazione bidirezionale.
      </Alert>

      <DocSection title="Artefatti disponibili">
        <RefTable
          label="Artefatti design"
          columns={['Percorso nel repository', 'Contenuto']}
          rows={[
            [<code key="1">design/figma/tokens.dtcg.json</code>, 'Tutti i token in formato W3C Design Tokens (DTCG): base, densità, palette tonali e ruoli colore per preset e schema'],
            [<code key="2">design/figma/tokens-studio/</code>, 'Set per Tokens Studio: base, density/*, palette/*, scheme/light|dark, con $themes (8 preset × 2 schemi × 2 densità)'],
            [<code key="3">design/figma/README.md</code>, 'Procedura di importazione e mapping token ↔ variabili Figma ↔ CSS'],
            [<code key="4">design/figma/components.md</code>, 'Specifiche di componenti, varianti, proprietà e stati da costruire in Figma'],
            [<code key="5">@dev-community/ui/tokens.json</code>, 'Lo stesso file DTCG, distribuito con il pacchetto'],
          ]}
        />
        <p>
          Tutti i file sono generati dalla stessa sorgente dei token CSS (<code>npm run tokens</code>), quindi i nomi coincidono:{' '}
          <code>color.text.primary</code> in Figma corrisponde a <code>--dc-color-text-primary</code> nel codice.
        </p>
      </DocSection>

      <DocSection title="Importare i token">
        <ol>
          <li>Installa il plugin Tokens Studio for Figma in un file nuovo (non sovrascrivere librerie esistenti).</li>
          <li>
            Collega la cartella <code>design/figma/tokens-studio</code> come sorgente (sincronizzazione Git o importazione dei file); verifica che
            l’ordine dei set corrisponda a <code>$metadata.json</code>.
          </li>
          <li>
            Usa “Export to Figma → Variables” scegliendo i temi da <code>$themes.json</code>: palette come collezione con modalità aurora, lagoon,
                        ember, graphite, ocean, forest, berry, saffron; schema come modalità light/dark; densità come modalità comfortable/compact.
          </li>
          <li>Crea gli stili tipografici dai token <code>typography.*</code> e gli effetti dai token <code>shadow.*</code>.</li>
          <li>Ripeti l’importazione dopo ogni rilascio che modifica i token; il flusso è solo codice → Figma.</li>
        </ol>
        <p>
          In alternativa, gli strumenti che leggono DTCG (ad esempio l’importazione nativa delle variabili di Figma, se disponibile nel tuo piano)
          possono usare direttamente <code>tokens.dtcg.json</code>; i riferimenti tra token (alias) sono espressi con la sintassi{' '}
          <code>{'{palette.brand.40}'}</code>.
        </p>
      </DocSection>

      <DocSection title="Cosa va costruito manualmente">
        <ul>
          <li>Componenti e varianti (Button, Input, Select, Card, Dialog…) con Auto Layout, secondo <code>components.md</code>.</li>
          <li>Proprietà dei componenti (variant, size, tone, state, icone opzionali) e stati hover, focus, pressed, disabled, invalid, loading.</li>
          <li>Esempi di pagina desktop e mobile (dashboard, elenco, form, accesso) partendo dalla showcase del sito.</li>
          <li>Pattern di accesso, SiteHeader con menu mobile, UserMenu e Footer.</li>
        </ul>
        <p>
          Il codice resta la fonte di verità per comportamento, accessibilità e tastiera: Figma rappresenta l’aspetto e la composizione.
        </p>
      </DocSection>
    </>
  );
}
