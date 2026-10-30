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
} from '@dev-community/ui';
import { MAX_THEME_JSON_BYTES, PRESET_META, PRESET_NAMES, isPresetName, parseThemeJson, themeToCss, themeToJson, type ThemeIssue } from '@dev-community/ui/theme';
import { DocSection, RefTable } from '../components/Doc';
import { PageMeta } from '../components/PageMeta';
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
  return (
    <li>
      <code>{issue.path || '(radice)'}</code> — {formatThemeIssue(issue, messages)}{' '}
      <Text as="span" variant="body-sm" tone="secondary">({issue.code})</Text>
    </li>
  );
}

function ContrastTable({ scheme, rows }: { scheme: Scheme; rows: ReturnType<typeof contrastReport> }) {
  return (
    <RefTable
      label={`Contrasto nel tema ${scheme === 'light' ? 'chiaro' : 'scuro'}`}
      columns={['Testo / elemento', 'Sfondo', 'Rapporto', 'Minimo', 'Esito']}
      rows={rows.map((r) => [
        <code key="fg">{r.fg}</code>,
        <code key="bg">{r.bg}</code>,
        r.ratio === null ? 'n/d' : `${r.ratio.toFixed(2)}:1`,
        `${r.min}:1`,
        r.pass ? (
          <Badge key="ok" tone="success" variant="soft" icon={<CheckCircle2 />}>
            Supera ({r.level})
          </Badge>
        ) : (
          <Badge key="ko" tone="danger" variant="soft" icon={<AlertTriangle />}>
            Insufficiente
          </Badge>
        ),
      ])}
    />
  );
}

export function ThemeBuilder() {
  const site = useTheme();
  const toast = useToast();
  const [state, setState] = useState<BuilderState>(() => initialState(isPresetName(site.theme.name) ? site.theme.name : 'aurora'));
  const [editScheme, setEditScheme] = useState<Scheme>('light');
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
    toast.show({ tone: 'success', title: 'Tema importato', description: `${parsed.theme.label} caricato da ${source}.` });
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
      .catch(() => setImportIssues([{ code: 'invalid_json', severity: 'error', path: '', message: 'Impossibile leggere il file.' }]));
  }

  const json = result.ok ? themeToJson(result.theme) : JSON.stringify(input, null, 2);
  const css = result.ok ? themeToCss(result.theme) : '';

  return (
    <article className="docs-article docs-article--wide tb">
      <PageMeta title="Theme Builder" description="Crea, verifica ed esporta temi personalizzati con anteprima live e controlli di contrasto." />
      <header className="docs-page-header">
        <Heading level={1}>Theme Builder</Heading>
        <Text variant="body-lg" tone="secondary">
          Parti da un preset, modifica i colori di partenza o i singoli ruoli semantici e controlla il contrasto in chiaro e in scuro. Le palette
          sono generate con l’algoritmo HCT di Material Color Utilities; i controlli di contrasto riguardano solo le coppie elencate e non
          garantiscono l’accessibilità di ogni combinazione.
        </Text>
      </header>

      {!result.ok ? (
        <Alert tone="danger" title="Configurazione non valida: l’anteprima mostra il preset di partenza">
          <IssueList issues={result.issues} />
        </Alert>
      ) : result.warnings.length > 0 ? (
        <Alert tone="warning" title="Avvisi">
          <IssueList issues={result.warnings} />
        </Alert>
      ) : null}

      <div className="tb-layout">
        <div className="tb-editor">
          <DocSection title="Base">
            <Stack gap={3}>
              <Select
                label="Preset di partenza"
                value={state.base}
                onChange={(key) => {
                  if (typeof key === 'string' && isPresetName(key)) update({ base: key });
                }}
              >
                {PRESET_NAMES.map((name) => (
                  <ListBoxItem key={name} id={name} textValue={PRESET_META[name].label.it} description={PRESET_META[name].description}>
                    {PRESET_META[name].label.it}
                  </ListBoxItem>
                ))}
              </Select>
              <TextField
                label="Identificativo"
                value={state.name}
                onChange={(name) => update({ name })}
                description="Lettere minuscole, cifre e trattini; diverso dai nomi dei preset."
              />
              <TextField label="Nome visualizzato" value={state.label} onChange={(label) => update({ label })} />
              <Inline gap={2} wrap>
                <Button variant="secondary" startIcon={<RotateCcw />} onPress={() => setState((s) => ({ ...initialState(s.base), name: s.name, label: s.label }))}>
                  Ripristina il preset
                </Button>
                <Button
                  startIcon={<Wand2 />}
                  isDisabled={!result.ok}
                  onPress={() => {
                    if (!result.ok) return;
                    site.setTheme(result.theme);
                    toast.show({ tone: 'success', title: 'Tema applicato alla documentazione', description: 'Vale per questa sessione: i temi personalizzati non vengono salvati dal sito.' });
                  }}
                >
                  Applica alla documentazione
                </Button>
              </Inline>
            </Stack>
          </DocSection>

          <DocSection title="Colori di partenza">
            <Text tone="secondary" variant="body-sm">
              Ogni seme rigenera una palette tonale completa; i ruoli derivati mantengono le distanze di tono che garantiscono il contrasto nei preset.
            </Text>
            <div className="tb-seeds">
              {SEED_KEYS.map(({ key, label, help }) => {
                const value = seedValue(state, key);
                return (
                  <Stack key={key} gap={1}>
                    <ColorPicker
                      label={label}
                      description={value ? help : `${help} Attualmente automatico.`}
                      value={value ?? '#808080'}
                      onChange={(color) => setSeed(key, color.toString('hex'))}
                    />
                    {state.seeds[key] ? (
                      <Button size="sm" variant="ghost" startIcon={<RotateCcw />} onPress={() => setSeed(key, undefined)}>
                        Ripristina {label.toLowerCase()}
                      </Button>
                    ) : null}
                  </Stack>
                );
              })}
            </div>
          </DocSection>

          <DocSection title="Ruoli semantici">
            <Text tone="secondary" variant="body-sm">
              Le modifiche ai ruoli hanno priorità sui colori generati e valgono solo per la modalità selezionata.
            </Text>
            <Tabs selectedKey={editScheme} onSelectionChange={(k) => setEditScheme(k === 'dark' ? 'dark' : 'light')}>
              <TabList aria-label="Modalità da modificare">
                <Tab id="light">Chiaro ({Object.keys(state.overrides.light).length})</Tab>
                <Tab id="dark">Scuro ({Object.keys(state.overrides.dark).length})</Tab>
              </TabList>
              {(['light', 'dark'] as const).map((scheme) => (
                <TabPanel key={scheme} id={scheme}>
                  <Accordion allowsMultipleExpanded>
                    {ROLE_GROUPS.map((group) => (
                      <AccordionItem key={group.id} id={group.id} title={group.label} meta={<Badge size="sm">{group.roles.length}</Badge>}>
                        <div className="tb-roles">
                          {group.roles.map((role) => {
                            const overridden = state.overrides[scheme][role];
                            return (
                              <Stack key={role} gap={1}>
                                <ColorPicker
                                  label={role}
                                  value={overridden ?? theme.colors[scheme][role]}
                                  onChange={(color) => setRole(scheme, role, color.toString('hex'))}
                                  description={overridden ? 'Personalizzato' : 'Generato'}
                                />
                                {overridden ? (
                                  <Button size="sm" variant="ghost" startIcon={<RotateCcw />} onPress={() => setRole(scheme, role, undefined)}>
                                    Usa il valore generato
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
            Anteprima live
          </Heading>
          <Preview theme={theme} scheme="light" />
          <Preview theme={theme} scheme="dark" />
        </div>
      </div>

      <DocSection title="Contrasto">
        {failures > 0 ? (
          <Alert tone="warning" title={`${failures} ${failures === 1 ? 'coppia non raggiunge' : 'coppie non raggiungono'} il contrasto minimo`}>
            Correggi i ruoli segnalati prima di usare il tema: testi e controlli potrebbero risultare illeggibili per molte persone. Le soglie seguono
            WCAG 2.2 (4,5:1 testo normale, 3:1 componenti grafici e bordi significativi).
          </Alert>
        ) : (
          <Alert tone="success" title="Tutte le coppie verificate superano le soglie">
            Il controllo riguarda solo le coppie elencate: verifica comunque immagini, grafici e combinazioni personalizzate.
          </Alert>
        )}
        <div className="docs-two-col">
          <Stack gap={2}>
            <Heading level={3} size="title-sm">
              Chiaro
            </Heading>
            <ContrastTable scheme="light" rows={contrast.light} />
          </Stack>
          <Stack gap={2}>
            <Heading level={3} size="title-sm">
              Scuro
            </Heading>
            <ContrastTable scheme="dark" rows={contrast.dark} />
          </Stack>
        </div>
      </DocSection>

      <DocSection title="Esporta">
        <Tabs>
          <TabList aria-label="Formato di esportazione">
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
                  Scarica JSON
                </Button>
              </Inline>
            </Stack>
          </TabPanel>
          <TabPanel id="css">
            <Stack gap={2}>
              <Text variant="body-sm" tone="secondary">
                Foglio di stile statico per CSP restrittive: caricalo e usa <code>{'<ThemeProvider theme={tema} themeStrategy="stylesheet">'}</code>.
              </Text>
              {result.ok ? (
                <>
                  <CodeBlock code={css} language="css" title={`${state.name}.theme.css`} copyable maxHeight="24rem" />
                  <Inline>
                    <Button startIcon={<Download />} onPress={() => downloadText(`${state.name}.theme.css`, css, 'text/css')}>
                      Scarica CSS
                    </Button>
                  </Inline>
                </>
              ) : (
                <Text tone="danger">Correggi gli errori di validazione per generare il CSS.</Text>
              )}
            </Stack>
          </TabPanel>
        </Tabs>
      </DocSection>

      <DocSection title="Importa">
        <Text tone="secondary">
          Il JSON viene validato (schema versione 1, ruoli e token noti, colori esadecimali, dimensione massima {MAX_THEME_JSON_BYTES / 1024} KB)
          prima di essere applicato; nessun CSS arbitrario viene accettato.
        </Text>
        <div className="docs-two-col">
          <FileUpload
            label="File del tema"
            description="Un file .json esportato da questo editor o creato a mano."
            accept={['.json', 'application/json']}
            maxSize={MAX_THEME_JSON_BYTES}
            value={files}
            onChange={setFiles}
            onFilesAdded={onFilesAdded}
          />
          <Stack gap={2}>
            <Textarea label="Oppure incolla il JSON" value={importText} onChange={setImportText} rows={6} />
            <Inline>
              <Button variant="secondary" startIcon={<Upload />} isDisabled={importText.trim() === ''} onPress={() => applyJson(importText, 'testo incollato')}>
                Importa dal testo
              </Button>
            </Inline>
          </Stack>
        </div>
        {importIssues ? (
          <Alert tone="danger" title="Importazione non riuscita: il tema corrente non è stato modificato" onDismiss={() => setImportIssues(null)}>
            <IssueList issues={importIssues} />
          </Alert>
        ) : null}
      </DocSection>
    </article>
  );
}