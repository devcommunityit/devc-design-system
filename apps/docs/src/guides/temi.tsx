import { Alert, Link } from '@devcommunityit/ui';
import { PRESET_COLORS, PRESET_META, PRESET_NAMES, type PresetKind, type PresetName } from '@devcommunityit/ui/theme';
import { Code, DocSection, RefTable } from '../components/Doc';

function Swatch({ color }: { color: string }) {
  return (
    <span className="docs-preset-swatch">
      <span className="docs-preset-swatch-chip" style={{ backgroundColor: color }} aria-hidden="true" />
      <code>{color}</code>
    </span>
  );
}

const KIND_LABEL: Record<PresetKind, string> = {
  solid: 'Tinta unica',
  gradient: 'Gradiente',
  auto: 'Accento derivato',
};

function GradientPreview({ name }: { name: PresetName }) {
  const light = PRESET_COLORS[name].light;
  const dark = PRESET_COLORS[name].dark;
  return (
    <span className="docs-preset-gradient" aria-hidden="true">
      <span style={{ backgroundImage: `linear-gradient(115deg, ${light['action.primary']}, ${light['accent.default']})` }} />
      <span style={{ backgroundImage: `linear-gradient(115deg, ${dark['action.primary']}, ${dark['accent.default']})` }} />
    </span>
  );
}

export default function Temi() {
  return (
    <>
      <DocSection title="Cinque concetti indipendenti">
        <RefTable
          label="Concetti del tema"
          columns={['Concetto', 'Valori', 'Prop di ThemeProvider']}
          rows={[
            ['Modalità', <code key="m">light | dark | system</code>, <code key="mp">mode / defaultMode / onModeChange</code>],
            ['Palette (brand)', <code key="p">{PRESET_NAMES.join(' | ')} | Theme personalizzato</code>, <code key="pp">theme / defaultTheme / onThemeChange</code>],
            ['Schema risolto', <code key="r">light | dark</code>, <code key="rp">useTheme().resolvedScheme (sola lettura)</code>],
            ['Densità', <code key="d">comfortable | compact</code>, <code key="dp">density / defaultDensity / onDensityChange</code>],
            ['Stile (look)', <code key="lk">standard | expressive</code>, <code key="lkp">look / defaultLook / onLookChange</code>],
          ]}
        />
        <p>
          Cambiare palette, densità o stile non altera struttura, tipografia o comportamento: cambiano solo le variabili di colore o le dimensioni dei
          controlli (lo stile cambia solo raggi e riempimenti, mai le dimensioni). Con <code>system</code> lo schema segue <code>prefers-color-scheme</code>; durante il rendering server{' '}
          <code>resolvedScheme</code> vale <code>light</code> finché il client non conosce la preferenza.
        </p>
      </DocSection>

      <DocSection title="Preset inclusi">
        <p>
          {PRESET_NAMES.length} preset generati dallo stesso algoritmo (palette tonali HCT da un colore seme). Ogni preset supera le coppie di contrasto dichiarate
          in chiaro e in scuro; la colonna «Primario» mostra il ruolo <code>action.primary</code> effettivamente generato, la colonna «Gradiente» il riempimento
          expressive (<code>action.primary</code> → <code>accent.default</code>) in chiaro e in scuro.
        </p>
        <ul>
          <li>
            <strong>Tinta unica</strong> ({PRESET_NAMES.filter((n) => PRESET_META[n].kind === 'solid').length}): il seme terziario coincide con il
            brand, quindi anche i gradienti dello stile expressive restano monocromatici.
          </li>
          <li>
            <strong>Gradiente</strong> ({PRESET_NAMES.filter((n) => PRESET_META[n].kind === 'gradient').length}): due semi espliciti (
            <code>brand</code> + <code>tertiary</code>) per riempimenti bicolore.
          </li>
          <li>
            <strong>Accento derivato</strong> ({PRESET_NAMES.filter((n) => PRESET_META[n].kind === 'auto').length}): solo il brand; l&apos;accento
            è il brand ruotato di 60° in tonalità.
          </li>
        </ul>
        <p>
          Il tipo è esposto in <code>PRESET_META[name].kind</code>. Nei preset a tinta unica la serie 2 dei grafici usa comunque una tonalità
          ruotata, così le serie restano distinguibili.
        </p>
        <RefTable
          label="Preset cromatici"
          columns={['Nome', 'Etichetta', 'Tipo', 'Semi', 'Gradiente', 'Primario chiaro / scuro', 'Carattere']}
          rows={PRESET_NAMES.map((name) => [
            <code key="n" className="docs-preset-name">{name}</code>,
            <span key="l" className="docs-preset-name">{PRESET_META[name].label.it}</span>,
            KIND_LABEL[PRESET_META[name].kind],
            <span key="s" className="docs-preset-swatch-pair">
              <Swatch color={PRESET_META[name].brand} />
              {PRESET_META[name].kind === 'gradient' && PRESET_META[name].tertiary ? <Swatch color={PRESET_META[name].tertiary} /> : null}
            </span>,
            <GradientPreview key="g" name={name} />,
            <span key="p" className="docs-preset-swatch-pair">
              <Swatch color={PRESET_COLORS[name].light['action.primary']} />
              <Swatch color={PRESET_COLORS[name].dark['action.primary']} />
            </span>,
            PRESET_META[name].description,
          ])}
        />
      </DocSection>

      <DocSection title="Stile espressivo e accento terziario">
        <p>
          Ispirato a Material Design 3, ogni tema genera anche una palette <strong>terziaria</strong> (seme <code>seeds.tertiary</code>, oppure il
          brand ruotato di 60° in tonalità) che alimenta i ruoli <code>color.accent.*</code> e i gradienti bicolore{' '}
          <code>--dc-gradient-accent</code>, <code>--dc-gradient-accent-sheen</code>, <code>--dc-gradient-accent-subtle</code> e{' '}
          <code>--dc-gradient-text</code>. Il preset <code>nebula</code> usa un accoppiamento blu → magenta in stile Gemini; <code>sunset</code>, <code>borealis</code>,{' '}
          <code>candy</code>, <code>dusk</code>, <code>glacier</code> e gli altri preset «Gradiente» offrono altre coppie pronte.
        </p>
        <p>
          Lo <strong>stile</strong> (<code>look</code>) è una dimensione separata da palette e densità. <code>standard</code> (predefinito della
          libreria) mantiene riempimenti pieni e raggi misurati. <code>expressive</code> applica forme a pillola ai controlli, contenitori più
          arrotondati, riempimenti bicolore con un leggero riflesso al passaggio del puntatore sulle azioni primarie (Button, Switch, Checkbox,
          Slider, Progress, Tabs, Tag, Calendar, Stepper, Badge) e riempimenti tonali sugli elementi selezionati (Toggle, Pagination,
          BottomNavigation, TreeView). Questo sito usa <code>expressive</code> con <code>nebula</code>: puoi cambiarli dalle preferenze.
        </p>
        <Code>{`
<ThemeProvider defaultTheme="nebula" defaultLook="expressive">
  <App />
</ThemeProvider>;

// Accento esplicito in un tema personalizzato
const tema = createTheme({ name: 'brand-x', seeds: { brand: '#0b57d0', tertiary: '#b5367a' } });

// Elementi opt-in, indipendenti dallo stile
<Heading level={1} gradient>Titolo bicolore</Heading>;
<Card variant="accent">Cornice con gradiente</Card>;
`}</Code>
        <Alert tone="info" title="Assunzione architetturale: gradienti con uno scopo">
          La direzione iniziale evitava gradienti decorativi diffusi. Su richiesta esplicita lo stile <code>expressive</code> introduce gradienti
          bicolore, ma solo su elementi con significato (azione primaria, stato selezionato, progresso, enfasi del titolo) e mai come sfondo di
          pagina. Gli estremi del gradiente (<code>action.primary</code> e <code>accent.default</code>) hanno lo stesso tono HCT, quindi il
          testo sovrapposto mantiene il contrasto verificato dal gate dei preset. Il movimento è limitato a transizioni di{' '}
          <code>background-position</code> con i token di durata (azzerati da <code>prefers-reduced-motion</code>); non ci sono animazioni
          infinite. Con <code>forced-colors</code> tutti i gradienti diventano <code>none</code>; nei browser senza interpolazione{' '}
          <code>in oklch</code> resta il colore pieno.
        </Alert>
        <p>
          Lo stile non fa parte del JSON del tema né delle variabili Figma: è un insieme di espressioni CSS (<code>--dc-look-*</code>) emesse
          sotto <code>[data-dc-look=&quot;expressive&quot;]</code>. Per i temi personalizzati verifica comunque il contrasto dei ruoli{' '}
          <code>accent.*</code> nel <Link href="/theme-builder">Theme Builder</Link>.
        </p>
      </DocSection>

      <DocSection title="Uso controllato e non controllato">
        <Code>{`
import { ThemeProvider, useTheme } from '@devcommunityit/ui';

// Non controllato: il provider mantiene lo stato
<ThemeProvider defaultMode="system" defaultTheme="lagoon" defaultDensity="comfortable">
  <App />
</ThemeProvider>;

// Controllato: lo stato vive nella tua applicazione
function Root() {
  const [mode, setMode] = useState<ThemeMode>('system');
  return (
    <ThemeProvider mode={mode} onModeChange={setMode} theme="ember">
      <App />
    </ThemeProvider>
  );
}

function ModeToggle() {
  const { resolvedScheme, setMode } = useTheme();
  return (
    <Button onPress={() => setMode(resolvedScheme === 'dark' ? 'light' : 'dark')}>
      Tema {resolvedScheme === 'dark' ? 'chiaro' : 'scuro'}
    </Button>
  );
}
`}</Code>
        <p>
          <code>useTheme()</code> fuori da un provider genera un errore esplicito; <code>useTheme({'{ optional: true }'})</code> restituisce invece{' '}
          <code>null</code>.
        </p>
      </DocSection>

      <DocSection title="Creare un tema personalizzato">
        <p>
          <code>createTheme</code> parte da un preset (<code>extends</code>), genera palette tonali dai colori seed e applica gli override per ruolo.
          L’input è validato: in caso di errore lancia <code>ThemeValidationError</code> con l’elenco dei problemi.
        </p>
        <Code>{`
import { createTheme, ThemeProvider } from '@devcommunityit/ui';

export const acme = createTheme({
  name: 'acme',              // minuscole e trattini, diverso dai preset
  label: 'Acme Portal',
  extends: 'graphite',
  seeds: { brand: '#0f766e', danger: '#c62828' },
  colors: {
    light: { 'surface.canvas': '#f7f8f8' },
    dark: { 'surface.canvas': '#0e1111' },
  },
  tokens: { 'radius.md': '0.5rem', 'font.family.sans': 'Inter, system-ui, sans-serif' },
});

<ThemeProvider theme={acme} themes={[acme]} defaultMode="system">
  <App />
</ThemeProvider>;
`}</Code>
        <Alert tone="warning" title="Il contrasto non è garantito automaticamente">
          I preset inclusi superano le coppie di contrasto documentate in entrambi gli schemi (verificato in build). Per palette personalizzate la
          libreria non può garantire l’accessibilità: usa il <Link href="/theme-builder">Theme Builder</Link> o <code>contrastRatio()</code> per
          controllare le coppie testo/sfondo.
        </Alert>
      </DocSection>

      <DocSection title="Importazione ed esportazione JSON">
        <p>
          Lo schema è versionato (<code>schemaVersion: 1</code>). <code>parseThemeJson</code> non lancia eccezioni: restituisce un risultato
          discriminato con errori localizzabili (codice + percorso + parametri, tradotti con <code>formatThemeIssue</code>). Sono accettati solo
          colori esadecimali, lunghezze CSS semplici e famiglie di font senza caratteri pericolosi: nessun CSS arbitrario raggiunge la pagina.
        </p>
        <Code>{`
import { formatThemeIssue, useMessages } from '@devcommunityit/ui';
import { parseThemeJson, themeToJson } from '@devcommunityit/ui/theme';

const messages = useMessages();                    // dentro un componente
const result = parseThemeJson(fileText);           // limite 64 KB
if (result.success) {
  setTheme(result.theme);
  result.warnings.forEach((w) => console.warn(w.path, w.message)); // message: inglese, per sviluppatori
} else {
  setErrors(result.issues.map((i) => \`\${i.path || 'tema'}: \${formatThemeIssue(i, messages)}\`));
}

const json = themeToJson(acme);                    // per download o salvataggio
`}</Code>
        <RefTable
          label="Codici di errore"
          columns={['Codice', 'Significato']}
          rows={[
            [<code key="1">invalid_json / too_large</code>, 'Testo non JSON o oltre 64 KB'],
            [<code key="2">unsupported_version / invalid_version</code>, 'schemaVersion più recente del supportato o non numerica'],
            [<code key="3">unknown_key / unknown_token</code>, 'Chiave o ruolo non previsto (ignorabile con { unknown: "ignore" })'],
            [<code key="4">unknown_preset / invalid_name / reserved_name</code>, 'extends inesistente, nome non valido o uguale a un preset'],
            [<code key="5">invalid_color / invalid_length / invalid_font_family</code>, 'Valore CSS non ammesso'],
            [<code key="6">missing_field / invalid_type / invalid_label</code>, 'Struttura non conforme'],
          ]}
        />
      </DocSection>

      <DocSection title="Esportazione CSS">
        <p>
          <code>themeToCss(theme)</code> produce un foglio di stile statico selezionato da <code>data-dc-palette</code>, adatto a CSP restrittive
          (nessuno stile inline). Con <code>themeStrategy=&quot;stylesheet&quot;</code> il provider presuppone che il CSS sia già caricato.
        </p>
        <Code>{`
// build script (Node)
import { writeFileSync } from 'node:fs';
import { themeToCss } from '@devcommunityit/ui/theme';
import { acme } from './theme';

writeFileSync('public/acme-theme.css', themeToCss(acme));

// app
<ThemeProvider theme={acme} themeStrategy="stylesheet">…</ThemeProvider>
`}</Code>
      </DocSection>

      <DocSection title="Persistenza">
        <p>
          È disattivata per default: il provider non legge né scrive storage finché non lo richiedi. Si possono scegliere le preferenze da salvare,
          la chiave e l’adattatore (localStorage o cookie). Gli errori di lettura/scrittura (storage pieno, bloccato, dati corrotti) non interrompono
          il rendering: sono esposti in <code>useTheme().persistenceError</code> e tramite <code>onPersistenceError</code>.
        </p>
        <Code>{`
<ThemeProvider
  persistence={{ key: 'portale-tema', keys: ['mode', 'theme', 'density'] }}
  themes={[acme]}                    // necessari per ripristinare temi personalizzati
  onPersistenceError={(e) => report(e)}
>
  <App />
</ThemeProvider>
`}</Code>
      </DocSection>

      <DocSection title="Provider annidati e portal">
        <p>
          Un provider annidato eredita dal genitore modalità, palette e densità non specificate. Dialog, Popover, Menu, Tooltip, Drawer e Toast sono
          renderizzati in un contenitore portal che riceve gli stessi attributi del provider di origine, quindi mantengono il tema anche se il nodo
          DOM è fuori dall’albero.
        </p>
        <Code>{`
<ThemeProvider defaultMode="light" theme="aurora">
  <Page />
  <ThemeProvider mode="dark" theme="ember" surface>
    <PromoPanel />          {/* scuro, palette ember, anche per i suoi Dialog */}
  </ThemeProvider>
</ThemeProvider>
`}</Code>
        <p>
          Per default il provider non modifica <code>&lt;html&gt;</code> né <code>&lt;body&gt;</code>. Imposta <code>applyToDocument</code> sul
          provider radice se vuoi rispecchiare gli attributi sul documento (ad esempio per colorare le scrollbar), e <code>surface</code> per
          applicare sfondo e colore del testo al contenitore.
        </p>
      </DocSection>

      <DocSection title="Theme Builder">
        <p>
          Il <Link href="/theme-builder">Theme Builder</Link> permette di partire da un preset, modificare seed e ruoli, controllare il contrasto in
          chiaro e scuro, copiare la configurazione TypeScript, scaricare JSON o CSS e importare un JSON esistente. Per il rendering server senza flash consulta{' '}
          <Link href="/guide/ssr-nextjs">SSR e Next.js</Link>.
        </p>
      </DocSection>
    </>
  );
}
