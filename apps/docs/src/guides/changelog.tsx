import { Alert } from '@dev-community/ui';
import { DocSection, RefTable } from '../components/Doc';

export default function Changelog() {
  return (
    <>
      <DocSection title="0.1.0 — prima versione (non pubblicata)">
        <ul>
          <li>Token DTCG come unica fonte; output CSS, TypeScript, DTCG e Tokens Studio generati.</li>
          <li>Temi: modalità light/dark/system, 26 preset (9 originali, 8 a tinta unica e 9 a gradiente bicolore), densità comoda/compatta, createTheme, schema JSON v1.</li>
          <li>
            Stile expressive ispirato a Material 3 (prop look di ThemeProvider), palette terziaria con ruoli accent.*, gradienti bicolore,
            Heading gradient e Card variant="accent".
          </li>
          <li>ThemeProvider con provider annidati, portal tematizzati, persistenza opzionale e strategia per CSP restrittive.</li>
          <li>Catalogo completo di layout, tipografia, azioni, navigazione, form, dati, feedback e overlay.</li>
          <li>Componenti AI: PromptComposer, ChatMessage, PromptSuggestions, SourceList e ResponseFeedback. Gestione siti: PublishStatus, BulkActionBar e SeoPreview. Etichette in sette lingue ed esempi locali dichiarati; nessun backend AI, pubblicazione o SEO automatici.</li>
          <li>
            Documentazione: pagina Theme Designer con matrice di varianti e stati e pannello tema (accento, grigi, aspetto, raggio, stile,
            densità). Scala dell’anteprima e pannelli traslucidi sono ricette CSS della pagina, non token della libreria.
          </li>
          <li>Tabs: l’indicatore della variante line resta dentro l’area di scorrimento ed evita una barra di scorrimento verticale spuria.</li>
          <li>
            Grafici SVG senza dipendenze (Sparkline, LineChart, BarChart, DonutChart, ChartLegend) con tabella dati, navigazione da tastiera e
            ruoli colore categoriali data.1–data.6; componenti per dashboard (HeroCard, PromoBanner, KpiCard, QuickAction) e NavList.
          </li>
          <li>Pattern: SiteHeader con menu mobile, Footer, UserMenu, AuthLayout, LoginForm, SignUpForm, PasswordResetForm.</li>
          <li>
            Componenti aggiuntivi: Toolbar, SplitButton, CopyButton (con useCopyToClipboard), Meter, PinInput, Rating, TreeView, SortableList,
            RelativeTime e il pattern NotificationCenter.
          </li>
          <li>
            LocaleProvider con messaggi in italiano, inglese, spagnolo, francese, tedesco, portoghese (Brasile) e arabo (le ultime cinque da far
            rivedere a madrelingua), plurali con Intl.PluralRules, errori dei temi traducibili con formatThemeIssue e supporto RTL anche negli
            overlay in portal.
          </li>
          <li>Etichette dei pulsanti e azioni dell’header che vanno a capo invece di uscire dal contenitore con testo ingrandito.</li>
          <li>
            Distribuzione: dichiarazioni .d.ts risolvibili anche con moduleResolution node16/nodenext, controlli publint e arethetypeswrong
            (npm run lint:package), script npm run release:pack (tarball + SHA-256) e blocco della pubblicazione pubblica finché manca la licenza.
          </li>
          <li>
            Documentazione live: build statica per GitHub Pages con base path configurabile, deep link, pagina 404, Storybook in /storybook/ e
            workflow GitHub Actions che pubblica solo dopo i test e2e.
          </li>
          <li>
            Sito di documentazione: indice «In questa pagina» e navigazione precedente/successivo in componenti e guide, navigazione per categorie nel
            catalogo, ricerca estesa ai singoli esempi con deep link, link a Storybook per ogni esempio, guida «Grafici e dashboard» ed esempi
            aggiuntivi (controllati, stati, contenuti lunghi) nelle pagine componente.
          </li>
        </ul>
        <p>
          Il dettaglio è nel file <code>packages/ui/CHANGELOG.md</code>, incluso nel pacchetto.
        </p>
      </DocSection>

      <DocSection title="Politica di versionamento">
        <p>
          Il pacchetto segue Semantic Versioning. Finché la versione è 0.x, le minor possono contenere modifiche incompatibili, sempre documentate
          con le istruzioni di migrazione.
        </p>
        <RefTable
          label="Tipi di modifica"
          columns={['Tipo', 'Esempi']}
          rows={[
            ['Major (incompatibile)', 'Rimozione o rinomina di componenti, props, token o variabili CSS; cambio di comportamento predefinito; nuova versione dello schema dei temi senza migrazione automatica; requisiti di React più alti'],
            ['Minor', 'Nuovi componenti, props opzionali, token o ruoli colore aggiuntivi, nuovi preset'],
            ['Patch', 'Correzioni di bug, accessibilità e stile che non cambiano l’API'],
          ]}
        />
        <p>
          Le classi CSS interne (<code>dc-componente-parte</code>) e la struttura DOM non fanno parte dell’API pubblica. I valori dei token possono
          cambiare in una minor (ad esempio un affinamento della palette); i loro nomi no.
        </p>
      </DocSection>

      <DocSection title="Schema dei temi">
        <p>
          Ogni tema esportato contiene <code>schemaVersion</code>. La versione corrente è 1. Le versioni future forniranno una migrazione automatica
          dalle precedenti dove possibile; un file con versione più recente di quella supportata viene rifiutato con il codice{' '}
          <code>unsupported_version</code> invece di essere interpretato parzialmente.
        </p>
      </DocSection>

      <DocSection title="Prima della pubblicazione">
        <Alert tone="info" title="Licenza: MIT">
          Il progetto è rilasciato con licenza MIT (© 2026 Dev Community). Il file <code>LICENSE</code> è incluso nei pacchetti{' '}
          <code>@dev-community/ui</code> e <code>@dev-community/ui-mcp</code>.
        </Alert>
      </DocSection>
    </>
  );
}
