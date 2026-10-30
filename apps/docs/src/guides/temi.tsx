import { Alert, Link } from '@dev-community/ui';
import { PRESET_COLORS, PRESET_META, PRESET_NAMES } from '@dev-community/ui/theme';
import { Code, DocSection, RefTable } from '../components/Doc';

function Swatch({ color }: { color: string }) {
  return (
    <span className="docs-preset-swatch">
      <span className="docs-preset-swatch-chip" style={{ backgroundColor: color }} aria-hidden="true" />
      <code>{color}</code>
    </span>
  );
}

export default function Temi() {
  return (
    <>
      <DocSection title="Quattro concetti indipendenti">
        <RefTable
          label="Concetti del tema"
          columns={['Concetto', 'Valori', 'Prop di ThemeProvider']}
          rows={[
            ['Modalità', <code key="m">light | dark | system</code>, <code key="mp">mode / defaultMode / onModeChange</code>],
            ['Palette (brand)', <code key="p">{PRESET_NAMES.join(' | ')} | Theme personalizzato</code>, <code key="pp">theme / defaultTheme / onThemeChange</code>],
            ['Schema risolto', <code key="r">light | dark</code>, <code key="rp">useTheme().resolvedScheme (sola lettura)</code>],
            ['Densità', <code key="d">comfortable | compact</code>, <code key="dp">density / defaultDensity / onDensityChange</code>],
          ]}
        />
        <p>
          Cambiare palette o densità non altera struttura, tipografia o comportamento: cambiano solo le variabili di colore o le dimensioni dei
          controlli. Con <code>system</code> lo schema segue <code>prefers-color-scheme</code>; durante il rendering server{' '}
          <code>resolvedScheme</code> vale <code>light</code> finché il client non conosce la preferenza.
        </p>
      </DocSection>

      <DocSection title="Preset inclusi">
        <p>
          Otto preset generati dallo stesso algoritmo (palette tonali HCT da un colore seme). Ogni preset supera le coppie di contrasto dichiarate
          in chiaro e in scuro; la colonna «Primario» mostra il ruolo <code>action.primary</code> effettivamente generato.
        </p>
        <RefTable
          label="Preset cromatici"
          columns={['Nome', 'Etichetta', 'Seme', 'Primario chiaro / scuro', 'Carattere']}
          rows={PRESET_NAMES.map((name) => [
            <code key="n" className="docs-preset-name">{name}</code>,
            <span key="l" className="docs-preset-name">{PRESET_META[name].label.it}</span>,
            <Swatch key="s" color={PRESET_META[name].brand} />,
            <span key="p" className="docs-preset-swatch-pair">
              <Swatch color={PRESET_COLORS[name].light['action.primary']} />
              <Swatch color={PRESET_COLORS[name].dark['action.primary']} />
            </span>,
            PRESET_META[name].description,
          ])}
        />
      </DocSection>

      <DocSection title="Uso controllato e non controllato">
        <Code>{`
import { ThemeProvider, useTheme } from '@dev-community/ui';

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
import { createTheme, ThemeProvider } from '@dev-community/ui';

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
          discriminato con errori localizzabili (codice + percorso). Sono accettati solo colori esadecimali, lunghezze CSS semplici e famiglie di font
          senza caratteri pericolosi: nessun CSS arbitrario raggiunge la pagina.
        </p>
        <Code>{`
import { parseThemeJson, themeToJson } from '@dev-community/ui/theme';

const result = parseThemeJson(fileText);           // limite 64 KB
if (result.success) {
  setTheme(result.theme);
  result.warnings.forEach((w) => console.warn(w.path, w.message));
} else {
  setErrors(result.issues.map((i) => \`\${i.path || 'tema'}: \${i.message}\`));
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
import { themeToCss } from '@dev-community/ui/theme';
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
