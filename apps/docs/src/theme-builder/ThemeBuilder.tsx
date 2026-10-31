import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, RotateCcw, Upload, Wand2 } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Button,
  CodeBlock,
  ColorPicker,
  FileUpload,
  Heading,
  Inline,
  List,
  ListBoxItem,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextField,
  Textarea,
  formatThemeIssue,
  useMessages,
  useTheme,
  useToast,
  type FileUploadItem,
  type Look,
} from '@dev-community/ui';
import { MAX_THEME_JSON_BYTES, PRESET_META, PRESET_NAMES, isPresetName, parseThemeJson, themeToCss, themeToJson, type ThemeIssue } from '@dev-community/ui/theme';
import { DocSection, RefTable } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
import type { DocsLang } from '../i18n/lang';
import { useI18n } from '../settings';
import {
  ROLE_GROUPS,
  SEED_KEYS,
  buildTheme,
  contrastReport,
  downloadText,
  fromTheme,
  initialState,
  seedValue,
  toInput,
  typeScriptSnippet,
  type BuilderState,
  type Scheme,
} from './model';
import { Preview } from './Preview';
import './theme-builder.css';

const COPY = {
  it: {
    root: '(radice)',
    contrastLabel: (scheme: Scheme) => `Contrasto nel tema ${scheme === 'light' ? 'chiaro' : 'scuro'}`,
    contrastColumns: ['Testo / elemento', 'Sfondo', 'Rapporto', 'Minimo', 'Esito'],
    notAvailable: 'n/d',
    pass: (level: string) => `Supera (${level})`,
    fail: 'Insufficiente',
    importedTitle: 'Tema importato',
    importedDescription: (label: string, source: string) => `${label} caricato da ${source}.`,
    readError: 'Impossibile leggere il file.',
    metaDescription: 'Crea, verifica ed esporta temi personalizzati con anteprima live e controlli di contrasto.',
    intro:
      'Parti da un preset, modifica i colori di partenza o i singoli ruoli semantici e controlla il contrasto in chiaro e in scuro. Le palette sono generate con l’algoritmo HCT di Material Color Utilities; i controlli di contrasto riguardano solo le coppie elencate e non garantiscono l’accessibilità di ogni combinazione.',
    invalidTitle: 'Configurazione non valida: l’anteprima mostra il preset di partenza',
    warningsTitle: 'Avvisi',
    baseSection: 'Base',
    basePreset: 'Preset di partenza',
    identifier: 'Identificativo',
    identifierHelp: 'Lettere minuscole, cifre e trattini; diverso dai nomi dei preset.',
    displayName: 'Nome visualizzato',
    resetPreset: 'Ripristina il preset',
    appliedTitle: 'Tema applicato alla documentazione',
    appliedDescription: 'Vale per questa sessione: i temi personalizzati non vengono salvati dal sito.',
    applyToDocs: 'Applica alla documentazione',
    seedsSection: 'Colori di partenza',
    seedsIntro: 'Ogni seme rigenera una palette tonale completa; i ruoli derivati mantengono le distanze di tono che garantiscono il contrasto nei preset.',
    currentlyAuto: 'Attualmente automatico.',
    resetSeed: (label: string) => `Ripristina ${label.toLowerCase()}`,
    rolesSection: 'Ruoli semantici',
    rolesIntro: 'Le modifiche ai ruoli hanno priorità sui colori generati e valgono solo per la modalità selezionata.',
    modeToEdit: 'Modalità da modificare',
    light: 'Chiaro',
    dark: 'Scuro',
    customized: 'Personalizzato',
    generated: 'Generato',
    useGenerated: 'Usa il valore generato',
    livePreview: 'Anteprima live',
    expressiveHelp: 'Lo stile è indipendente dal tema: stessa palette, forme e riempimenti diversi. Non viene esportato nel JSON.',
    expressivePreview: 'Anteprima con stile espressivo',
    contrastSection: 'Contrasto',
    failuresTitle: (count: number) => `${count} ${count === 1 ? 'coppia non raggiunge' : 'coppie non raggiungono'} il contrasto minimo`,
    failuresBody:
      'Correggi i ruoli segnalati prima di usare il tema: testi e controlli potrebbero risultare illeggibili per molte persone. Le soglie seguono WCAG 2.2 (4,5:1 testo normale, 3:1 componenti grafici e bordi significativi).',
    allPassTitle: 'Tutte le coppie verificate superano le soglie',
    allPassBody: 'Il controllo riguarda solo le coppie elencate: verifica comunque immagini, grafici e combinazioni personalizzate.',
    exportSection: 'Esporta',
    exportFormat: 'Formato di esportazione',
    downloadJson: 'Scarica JSON',
    cssIntroBefore: 'Foglio di stile statico per CSP restrittive: caricalo e usa ',
    cssSnippet: '<ThemeProvider theme={tema} themeStrategy="stylesheet">',
    downloadCss: 'Scarica CSS',
    cssBlocked: 'Correggi gli errori di validazione per generare il CSS.',
    importSection: 'Importa',
    importIntro: (kb: number) =>
      `Il JSON viene validato (schema versione 1, ruoli e token noti, colori esadecimali, dimensione massima ${kb} KB) prima di essere applicato; nessun CSS arbitrario viene accettato.`,
    themeFile: 'File del tema',
    themeFileHelp: 'Un file .json esportato da questo editor o creato a mano.',
    pasteJson: 'Oppure incolla il JSON',
    pastedText: 'testo incollato',
    importFromText: 'Importa dal testo',
    importFailed: 'Importazione non riuscita: il tema corrente non è stato modificato',
  },
  en: {
    root: '(root)',
    contrastLabel: (scheme: Scheme) => `Contrast in the ${scheme === 'light' ? 'light' : 'dark'} theme`,
    contrastColumns: ['Text / element', 'Background', 'Ratio', 'Minimum', 'Result'],
    notAvailable: 'n/a',
    pass: (level: string) => `Passes (${level})`,
    fail: 'Insufficient',
    importedTitle: 'Theme imported',
    importedDescription: (label: string, source: string) => `${label} loaded from ${source}.`,
    readError: 'Unable to read the file.',
    metaDescription: 'Create, check and export custom themes with a live preview and contrast checks.',
    intro:
      'Start from a preset, edit the seed colors or individual semantic roles and check contrast in light and dark mode. Palettes are generated with the HCT algorithm from Material Color Utilities; contrast checks only cover the listed pairs and do not guarantee the accessibility of every combination.',
    invalidTitle: 'Invalid configuration: the preview shows the base preset',
    warningsTitle: 'Warnings',
    baseSection: 'Base',
    basePreset: 'Base preset',
    identifier: 'Identifier',
    identifierHelp: 'Lowercase letters, digits and hyphens; must differ from preset names.',
    displayName: 'Display name',
    resetPreset: 'Reset to preset',
    appliedTitle: 'Theme applied to the documentation',
    appliedDescription: 'Applies to this session only: custom themes are not saved by the site.',
    applyToDocs: 'Apply to documentation',
    seedsSection: 'Seed colors',
    seedsIntro: 'Each seed regenerates a full tonal palette; derived roles keep the tone distances that guarantee contrast in the presets.',
    currentlyAuto: 'Currently automatic.',
    resetSeed: (label: string) => `Reset ${label.toLowerCase()}`,
    rolesSection: 'Semantic roles',
    rolesIntro: 'Role overrides take precedence over generated colors and apply only to the selected mode.',
    modeToEdit: 'Mode to edit',
    light: 'Light',
    dark: 'Dark',
    customized: 'Customized',
    generated: 'Generated',
    useGenerated: 'Use the generated value',
    livePreview: 'Live preview',
    expressiveHelp: 'The look is independent of the theme: same palette, different shapes and fills. It is not exported to JSON.',
    expressivePreview: 'Preview with expressive look',
    contrastSection: 'Contrast',
    failuresTitle: (count: number) => `${count} ${count === 1 ? 'pair does not reach' : 'pairs do not reach'} the minimum contrast`,
    failuresBody:
      'Fix the flagged roles before using the theme: text and controls could be unreadable for many people. Thresholds follow WCAG 2.2 (4.5:1 for normal text, 3:1 for graphical components and meaningful borders).',
    allPassTitle: 'All checked pairs meet the thresholds',
    allPassBody: 'The check only covers the listed pairs: still verify images, charts and custom combinations.',
    exportSection: 'Export',
    exportFormat: 'Export format',
    downloadJson: 'Download JSON',
    cssIntroBefore: 'Static stylesheet for strict CSPs: load it and use ',
    cssSnippet: '<ThemeProvider theme={theme} themeStrategy="stylesheet">',
    downloadCss: 'Download CSS',
    cssBlocked: 'Fix the validation errors to generate the CSS.',
    importSection: 'Import',
    importIntro: (kb: number) =>
      `The JSON is validated (schema version 1, known roles and tokens, hex colors, maximum size ${kb} KB) before it is applied; no arbitrary CSS is accepted.`,
    themeFile: 'Theme file',
    themeFileHelp: 'A .json file exported by this editor or written by hand.',
    pasteJson: 'Or paste the JSON',
    pastedText: 'pasted text',
    importFromText: 'Import from text',
    importFailed: 'Import failed: the current theme was not changed',
  },
} satisfies Record<DocsLang, unknown>;

function IssueList({ issues }: { issues: ThemeIssue[] }) {
  return (
    <List>
      {issues.map((issue) => (
        <ListItem key={`${issue.path}-${issue.code}`} issue={issue} />
      ))}
    </List>
  );
}

function ListItem({ issue }: { issue: ThemeIssue }) {
  const messages = useMessages();
  const { lang } = useI18n();
  return (
    <li>
      <code>{issue.path || COPY[lang].root}</code> — {formatThemeIssue(issue, messages)}{' '}
      <Text as="span" variant="body-sm" tone="secondary">({issue.code})</Text>
    </li>
  );
}

function ContrastTable({ scheme, rows }: { scheme: Scheme; rows: ReturnType<typeof contrastReport> }) {
  const { lang } = useI18n();
  const copy = COPY[lang];
  return (
    <RefTable
      label={copy.contrastLabel(scheme)}
      columns={copy.contrastColumns}
      rows={rows.map((r) => [
        <code key="fg">{r.fg}</code>,
        <code key="bg">{r.bg}</code>,
        r.ratio === null ? copy.notAvailable : `${r.ratio.toFixed(2)}:1`,
        `${r.min}:1`,
        r.pass ? (
          <Badge key="ok" tone="success" variant="soft" icon={<CheckCircle2 />}>
            {copy.pass(r.level)}
          </Badge>
        ) : (
          <Badge key="ko" tone="danger" variant="soft" icon={<AlertTriangle />}>
            {copy.fail}
          </Badge>
        ),
      ])}
    />
  );
}

export function ThemeBuilder() {
  const site = useTheme();
  const toast = useToast();
  const { lang } = useI18n();
  const copy = COPY[lang];
  const [state, setState] = useState<BuilderState>(() => initialState(isPresetName(site.theme.name) ? site.theme.name : 'aurora', lang));
  const [editScheme, setEditScheme] = useState<Scheme>('light');
  const [previewLook, setPreviewLook] = useState<Look>(site.look);
  const [importText, setImportText] = useState('');
  const [importIssues, setImportIssues] = useState<ThemeIssue[] | null>(null);
  const [files, setFiles] = useState<FileUploadItem[]>([]);

  const result = useMemo(() => buildTheme(state), [state]);
  const theme = result.ok ? result.theme : result.fallback;
  const contrast = useMemo(() => ({ light: contrastReport(theme, 'light'), dark: contrastReport(theme, 'dark') }), [theme]);
  const failures = contrast.light.filter((r) => !r.pass).length + contrast.dark.filter((r) => !r.pass).length;
  const input = toInput(state);

  const update = (patch: Partial<BuilderState>) => setState((s) => ({ ...s, ...patch }));
  const setSeed = (key: keyof BuilderState['seeds'], value: string | undefined) =>
    setState((s) => {
      const seeds = { ...s.seeds };
      if (value === undefined) delete seeds[key];
      else seeds[key] = value;
      return { ...s, seeds };
    });
  const setRole = (scheme: Scheme, role: string, value: string | undefined) =>
    setState((s) => {
      const next = { ...s.overrides[scheme] };
      const match = ROLE_GROUPS.flatMap((g) => g.roles).find((r) => r === role);
      if (!match) return s;
      if (value === undefined) delete next[match];
      else next[match] = value;
      return { ...s, overrides: { ...s.overrides, [scheme]: next } };
    });

  function applyJson(text: string, source: string) {
    const parsed = parseThemeJson(text);
    if (!parsed.success) {
      setImportIssues(parsed.issues);
      return;
    }
    setImportIssues(null);
    setState(fromTheme(parsed.theme));
    toast.show({ tone: 'success', title: copy.importedTitle, description: copy.importedDescription(parsed.theme.label, source) });
  }

  function onFilesAdded(items: FileUploadItem[]) {
    const item = items[0];
    if (!item) return;
    item.file
      .text()
      .then((text) => {
        applyJson(text, item.file.name);
        setFiles([]);
      })
      .catch(() => setImportIssues([{ code: 'invalid_json', severity: 'error', path: '', message: copy.readError }]));
  }

  const json = result.ok ? themeToJson(result.theme) : JSON.stringify(input, null, 2);
  const css = result.ok ? themeToCss(result.theme) : '';

  return (
    <article className="docs-article docs-article--wide tb">
      <PageMeta title="Theme Builder" description={copy.metaDescription} />
      <header className="docs-page-header">
        <Heading level={1}>Theme Builder</Heading>
        <Text variant="body-lg" tone="secondary">
          {copy.intro}
        </Text>
      </header>

      {!result.ok ? (
        <Alert tone="danger" title={copy.invalidTitle}>
          <IssueList issues={result.issues} />
        </Alert>
      ) : result.warnings.length > 0 ? (
        <Alert tone="warning" title={copy.warningsTitle}>
          <IssueList issues={result.warnings} />
        </Alert>
      ) : null}

      <div className="tb-layout">
        <div className="tb-editor">
          <DocSection id="base" title={copy.baseSection}>
            <Stack gap={3}>
              <Select
                label={copy.basePreset}
                value={state.base}
                onChange={(key) => {
                  if (typeof key === 'string' && isPresetName(key)) update({ base: key });
                }}
              >
                {PRESET_NAMES.map((name) => (
                  <ListBoxItem key={name} id={name} textValue={PRESET_META[name].label[lang]} description={PRESET_META[name].description}>
                    {PRESET_META[name].label[lang]}
                  </ListBoxItem>
                ))}
              </Select>
              <TextField
                label={copy.identifier}
                value={state.name}
                onChange={(name) => update({ name })}
                description={copy.identifierHelp}
              />
              <TextField label={copy.displayName} value={state.label} onChange={(label) => update({ label })} />
              <Inline gap={2} wrap>
                <Button variant="secondary" startIcon={<RotateCcw />} onPress={() => setState((s) => ({ ...initialState(s.base), name: s.name, label: s.label }))}>
                  {copy.resetPreset}
                </Button>
                <Button
                  startIcon={<Wand2 />}
                  isDisabled={!result.ok}
                  onPress={() => {
                    if (!result.ok) return;
                    site.setTheme(result.theme);
                    toast.show({ tone: 'success', title: copy.appliedTitle, description: copy.appliedDescription });
                  }}
                >
                  {copy.applyToDocs}
                </Button>
              </Inline>
            </Stack>
          </DocSection>

          <DocSection id="colori-di-partenza" title={copy.seedsSection}>
            <Text tone="secondary" variant="body-sm">
              {copy.seedsIntro}
            </Text>
            <div className="tb-seeds">
              {SEED_KEYS.map(({ key, label, help }) => {
                const value = seedValue(state, key);
                return (
                  <Stack key={key} gap={1}>
                    <ColorPicker
                      label={label[lang]}
                      description={value ? help[lang] : `${help[lang]} ${copy.currentlyAuto}`}
                      value={value ?? '#808080'}
                      onChange={(color) => setSeed(key, color.toString('hex'))}
                    />
                    {state.seeds[key] ? (
                      <Button size="sm" variant="ghost" startIcon={<RotateCcw />} onPress={() => setSeed(key, undefined)}>
                        {copy.resetSeed(label[lang])}
                      </Button>
                    ) : null}
                  </Stack>
                );
              })}
            </div>
          </DocSection>

          <DocSection id="ruoli-semantici" title={copy.rolesSection}>
            <Text tone="secondary" variant="body-sm">
              {copy.rolesIntro}
            </Text>
            <Tabs selectedKey={editScheme} onSelectionChange={(k) => setEditScheme(k === 'dark' ? 'dark' : 'light')}>
              <TabList aria-label={copy.modeToEdit}>
                <Tab id="light">
                  {copy.light} ({Object.keys(state.overrides.light).length})
                </Tab>
                <Tab id="dark">
                  {copy.dark} ({Object.keys(state.overrides.dark).length})
                </Tab>
              </TabList>
              {(['light', 'dark'] as const).map((scheme) => (
                <TabPanel key={scheme} id={scheme}>
                  <Accordion allowsMultipleExpanded>
                    {ROLE_GROUPS.map((group) => (
                      <AccordionItem key={group.id} id={group.id} title={group.label[lang]} meta={<Badge size="sm">{group.roles.length}</Badge>}>
                        <div className="tb-roles">
                          {group.roles.map((role) => {
                            const overridden = state.overrides[scheme][role];
                            return (
                              <Stack key={role} gap={1}>
                                <ColorPicker
                                  label={role}
                                  value={overridden ?? theme.colors[scheme][role]}
                                  onChange={(color) => setRole(scheme, role, color.toString('hex'))}
                                  description={overridden ? copy.customized : copy.generated}
                                />
                                {overridden ? (
                                  <Button size="sm" variant="ghost" startIcon={<RotateCcw />} onPress={() => setRole(scheme, role, undefined)}>
                                    {copy.useGenerated}
                                  </Button>
                                ) : null}
                              </Stack>
                            );
                          })}
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabPanel>
              ))}
            </Tabs>
          </DocSection>
        </div>

        <div className="tb-previews" id="anteprima">
          <Heading level={2} className="tb-visually-compact">
            {copy.livePreview}
          </Heading>
          <Switch
            isSelected={previewLook === 'expressive'}
            onChange={(on) => setPreviewLook(on ? 'expressive' : 'standard')}
            description={copy.expressiveHelp}
          >
            {copy.expressivePreview}
          </Switch>
          <Preview theme={theme} scheme="light" look={previewLook} />
          <Preview theme={theme} scheme="dark" look={previewLook} />
        </div>
      </div>

      <DocSection id="contrasto" title={copy.contrastSection}>
        {failures > 0 ? (
          <Alert tone="warning" title={copy.failuresTitle(failures)}>
            {copy.failuresBody}
          </Alert>
        ) : (
          <Alert tone="success" title={copy.allPassTitle}>
            {copy.allPassBody}
          </Alert>
        )}
        <div className="docs-two-col">
          <Stack gap={2}>
            <Heading level={3} size="title-sm">
              {copy.light}
            </Heading>
            <ContrastTable scheme="light" rows={contrast.light} />
          </Stack>
          <Stack gap={2}>
            <Heading level={3} size="title-sm">
              {copy.dark}
            </Heading>
            <ContrastTable scheme="dark" rows={contrast.dark} />
          </Stack>
        </div>
      </DocSection>

      <DocSection id="esporta" title={copy.exportSection}>
        <Tabs>
          <TabList aria-label={copy.exportFormat}>
            <Tab id="ts">TypeScript</Tab>
            <Tab id="json">JSON</Tab>
            <Tab id="css">CSS</Tab>
          </TabList>
          <TabPanel id="ts">
            <CodeBlock code={typeScriptSnippet(input)} language="ts" title="theme.ts" copyable />
          </TabPanel>
          <TabPanel id="json">
            <Stack gap={2}>
              <CodeBlock code={json} language="json" title={`${state.name}.theme.json`} copyable maxHeight="24rem" />
              <Inline>
                <Button startIcon={<Download />} isDisabled={!result.ok} onPress={() => downloadText(`${state.name}.theme.json`, json, 'application/json')}>
                  {copy.downloadJson}
                </Button>
              </Inline>
            </Stack>
          </TabPanel>
          <TabPanel id="css">
            <Stack gap={2}>
              <Text variant="body-sm" tone="secondary">
                {copy.cssIntroBefore}
                <code>{copy.cssSnippet}</code>.
              </Text>
              {result.ok ? (
                <>
                  <CodeBlock code={css} language="css" title={`${state.name}.theme.css`} copyable maxHeight="24rem" />
                  <Inline>
                    <Button startIcon={<Download />} onPress={() => downloadText(`${state.name}.theme.css`, css, 'text/css')}>
                      {copy.downloadCss}
                    </Button>
                  </Inline>
                </>
              ) : (
                <Text tone="danger">{copy.cssBlocked}</Text>
              )}
            </Stack>
          </TabPanel>
        </Tabs>
      </DocSection>

      <DocSection id="importa" title={copy.importSection}>
        <Text tone="secondary">
          {copy.importIntro(MAX_THEME_JSON_BYTES / 1024)}
        </Text>
        <div className="docs-two-col">
          <FileUpload
            label={copy.themeFile}
            description={copy.themeFileHelp}
            accept={['.json', 'application/json']}
            maxSize={MAX_THEME_JSON_BYTES}
            value={files}
            onChange={setFiles}
            onFilesAdded={onFilesAdded}
          />
          <Stack gap={2}>
            <Textarea label={copy.pasteJson} value={importText} onChange={setImportText} rows={6} />
            <Inline>
              <Button variant="secondary" startIcon={<Upload />} isDisabled={importText.trim() === ''} onPress={() => applyJson(importText, copy.pastedText)}>
                {copy.importFromText}
              </Button>
            </Inline>
          </Stack>
        </div>
        {importIssues ? (
          <Alert tone="danger" title={copy.importFailed} onDismiss={() => setImportIssues(null)}>
            <IssueList issues={importIssues} />
          </Alert>
        ) : null}
      </DocSection>
    </article>
  );
}