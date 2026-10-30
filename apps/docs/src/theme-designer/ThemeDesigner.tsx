import { useId, useMemo, useState, type ReactNode } from 'react';
import type { Key, Selection } from 'react-aria-components';
import { ArrowRight, Bell, CheckCircle2, Info, Moon, Pencil, Plus, Settings2, Share2, SlidersHorizontal, Sun, Trash2 } from 'lucide-react';
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CopyButton,
  CodeBlock,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  Heading,
  IconButton,
  Inline,
  Link,
  ListBoxItem,
  Menu,
  MenuItem,
  Popover,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextField,
  ThemeProvider,
  Toggle,
  ToggleGroup,
  Tooltip,
  VisuallyHidden,
  useTheme,
  useToast,
  type BadgeTone,
  type ButtonSize,
  type ButtonVariant,
  type FeedbackTone,
  type Theme,
} from '@dev-community/ui';
import { PageMeta } from '../components/PageMeta';
import { contrastReport } from '../theme-builder/model';
import {
  ACCENTS,
  GRAYS,
  INITIAL_STATE,
  RADIUS_PRESETS,
  RADIUS_TOKENS,
  SCALES,
  buildDesignerTheme,
  designerSnippet,
  findAccent,
  findGray,
  type DesignerState,
  type Swatch,
} from './model';
import './theme-designer.css';

const BUTTON_VARIANTS: readonly { id: ButtonVariant; label: string }[] = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'outline', label: 'Outline' },
  { id: 'ghost', label: 'Ghost' },
  { id: 'danger', label: 'Danger' },
];
const BUTTON_SIZES: readonly { id: ButtonSize; label: string }[] = [
  { id: 'sm', label: 'Piccolo' },
  { id: 'md', label: 'Medio' },
  { id: 'lg', label: 'Grande' },
];
const BADGE_TONES: readonly { id: BadgeTone; label: string }[] = [
  { id: 'brand', label: 'Brand' },
  { id: 'neutral', label: 'Neutro' },
  { id: 'info', label: 'Info' },
  { id: 'success', label: 'Successo' },
  { id: 'warning', label: 'Avviso' },
  { id: 'danger', label: 'Errore' },
];
const ALERT_TONES: readonly { id: FeedbackTone; title: string }[] = [
  { id: 'info', title: 'È disponibile una nuova versione.' },
  { id: 'success', title: 'Modifiche salvate.' },
  { id: 'warning', title: 'Spazio di archiviazione quasi esaurito.' },
  { id: 'danger', title: 'Impossibile completare il pagamento.' },
];

/** Single selection from a ToggleGroup; ignores empty selections (they are disallowed anyway). */
function pick<T extends string>(keys: Selection, allowed: readonly T[], apply: (value: T) => void) {
  if (keys === 'all') return;
  const [first] = [...keys];
  const match = allowed.find((value) => value === String(first as Key));
  if (match !== undefined) apply(match);
}

function PanelGroup({ title, value, children }: { title: string; value?: string; children: ReactNode }) {
  return (
    <div className="td-group">
      <div className="td-group-head">
        <Text as="span" variant="label-md">
          {title}
        </Text>
        {value ? (
          <Text as="span" variant="body-sm" tone="secondary">
            {value}
          </Text>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SwatchGroup({
  legend,
  items,
  value,
  onChange,
  background,
}: {
  legend: string;
  items: readonly Swatch[];
  value: string;
  onChange: (id: string) => void;
  background?: (item: Swatch) => string;
}) {
  const name = useId();
  const selected = items.find((item) => item.id === value);
  return (
    <fieldset className="td-group td-fieldset">
      <legend className="td-group-head">
        <Text as="span" variant="label-md">
          {legend}
        </Text>
        <Text as="span" variant="body-sm" tone="secondary">
          {selected?.label}
        </Text>
      </legend>
      <div className="td-swatches">
        {items.map((item) => (
          <label key={item.id} className="td-swatch" title={item.label}>
            <input type="radio" className="td-swatch-input" name={name} value={item.id} checked={item.id === value} onChange={() => onChange(item.id)} />
            <span className="td-swatch-dot" style={{ background: background?.(item) ?? item.hex }} aria-hidden="true" />
            <VisuallyHidden>{item.label}</VisuallyHidden>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ThemePanel({
  state,
  setState,
  theme,
  onApplyToSite,
  id,
}: {
  state: DesignerState;
  setState: (patch: Partial<DesignerState>) => void;
  theme: Theme;
  onApplyToSite: () => void;
  id: string;
}) {
  const toast = useToast();
  const failures = useMemo(() => contrastReport(theme, state.appearance).filter((row) => !row.pass), [theme, state.appearance]);
  const accent = findAccent(state.accent);
  const snippet = designerSnippet(state);

  return (
    <aside id={id} className="td-panel td-surface" aria-labelledby={`${id}-title`}>
      <Heading level={2} size="title-md" id={`${id}-title`}>
        Tema
      </Heading>

      <SwatchGroup legend="Colore di accento" items={ACCENTS} value={state.accent} onChange={(accentId) => setState({ accent: accentId })} />
      <SwatchGroup
        legend="Colore dei grigi"
        items={GRAYS}
        value={state.gray}
        onChange={(gray) => setState({ gray })}
        background={(item) => (item.id === 'auto' ? `linear-gradient(135deg, ${accent.hex} 0 50%, ${item.hex} 50% 100%)` : item.hex)}
      />

      <PanelGroup title="Aspetto">
        <ToggleGroup
          aria-label="Aspetto"
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.appearance]}
          onSelectionChange={(keys) => pick(keys, ['light', 'dark'] as const, (appearance) => setState({ appearance }))}
        >
          <Toggle id="light" icon={<Sun />}>
            Chiaro
          </Toggle>
          <Toggle id="dark" icon={<Moon />}>
            Scuro
          </Toggle>
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title="Raggio">
        <ToggleGroup
          aria-label="Raggio"
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--5 td-radius"
          selectedKeys={[state.radius]}
          onSelectionChange={(keys) => pick(keys, RADIUS_PRESETS.map((r) => r.id), (radius) => setState({ radius }))}
        >
          {RADIUS_PRESETS.map((preset) => (
            <Toggle key={preset.id} id={preset.id} aria-label={preset.label}>
              <span className="td-radius-cell">
                <span className="td-radius-sample" style={{ borderStartEndRadius: RADIUS_TOKENS[preset.id]['radius.xl'] ?? 'var(--dc-radius-xl)' }} aria-hidden="true" />
                <span className="td-radius-label">{preset.label}</span>
              </span>
            </Toggle>
          ))}
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title="Scala dell’anteprima" value="CSS zoom, non è un token">
        <ToggleGroup
          aria-label="Scala dell’anteprima"
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--5"
          selectedKeys={[String(state.scale)]}
          onSelectionChange={(keys) => pick(keys, SCALES.map(String), (scale) => setState({ scale: Number(scale) as DesignerState['scale'] }))}
        >
          {SCALES.map((scale) => (
            <Toggle key={scale} id={String(scale)} size="sm">
              {`${scale}%`}
            </Toggle>
          ))}
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title="Stile">
        <ToggleGroup
          aria-label="Stile"
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.look]}
          onSelectionChange={(keys) => pick(keys, ['standard', 'expressive'] as const, (look) => setState({ look }))}
        >
          <Toggle id="standard">Standard</Toggle>
          <Toggle id="expressive">Espressivo</Toggle>
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title="Densità">
        <ToggleGroup
          aria-label="Densità"
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.density]}
          onSelectionChange={(keys) => pick(keys, ['comfortable', 'compact'] as const, (density) => setState({ density }))}
        >
          <Toggle id="comfortable">Comoda</Toggle>
          <Toggle id="compact">Compatta</Toggle>
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title="Sfondo dei pannelli" value="Ricetta CSS opzionale">
        <ToggleGroup
          aria-label="Sfondo dei pannelli"
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.panel]}
          onSelectionChange={(keys) => pick(keys, ['solid', 'translucent'] as const, (panel) => setState({ panel }))}
        >
          <Toggle id="solid">Pieno</Toggle>
          <Toggle id="translucent">Traslucido</Toggle>
        </ToggleGroup>
      </PanelGroup>

      {failures.length > 0 ? (
        <Alert tone="warning" title={`${failures.length} coppie sotto la soglia di contrasto`}>
          <Text variant="body-sm">
            In tema {state.appearance === 'light' ? 'chiaro' : 'scuro'}: {failures.map((row) => `${row.fg} su ${row.bg}`).join(', ')}. Correggi i ruoli nel{' '}
            <Link href="/theme-builder">Theme Builder</Link>.
          </Text>
        </Alert>
      ) : (
        <Text variant="body-sm" tone="secondary" className="td-contrast-ok">
          <CheckCircle2 aria-hidden="true" /> Le coppie testo/sfondo controllate superano le soglie WCAG AA in questo aspetto.
        </Text>
      )}

      <div className="td-actions">
        <CopyButton value={snippet} variant="primary" onCopy={() => toast.show({ tone: 'success', title: 'Tema copiato', description: 'Incolla il codice TypeScript nel tuo progetto.' })}>
          Copia tema
        </CopyButton>
        <Button variant="secondary" onPress={() => setState(INITIAL_STATE)}>
          Ripristina
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            onApplyToSite();
            toast.show({ tone: 'success', title: 'Tema applicato alla documentazione', description: 'Vale per questa sessione; aspetto, stile e densità del sito non cambiano.' });
          }}
        >
          Applica al sito
        </Button>
      </div>
      <details className="td-code">
        <summary>Mostra il codice generato</summary>
        <CodeBlock code={snippet} language="ts" title="theme.ts" copyable maxHeight="20rem" />
      </details>
    </aside>
  );
}

function SpecimenTable({ caption, columns, rows }: { caption: string; columns: readonly string[]; rows: readonly { label: string; cells: ReactNode[] }[] }) {
  return (
    <ScrollArea orientation="horizontal" aria-label={caption} className="td-matrix-wrap">
      <table className="td-matrix">
        <caption className="td-visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <td />
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.cells.map((cell, index) => (
                <td key={columns[index]}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

function PreviewSection({ id, title, href, children }: { id: string; title: string; href: string; children: ReactNode }) {
  return (
    <section className="td-section" aria-labelledby={id}>
      <Inline gap={3} align="center" wrap>
        <Heading level={2} size="title-lg" id={id}>
          {title}
        </Heading>
        <Link href={href}>Vedi la documentazione</Link>
      </Inline>
      {children}
    </section>
  );
}

function Preview({ onAction }: { onAction: (message: string) => void }) {
  const [notify, setNotify] = useState(true);
  return (
    <div className="td-sections">
      <PreviewSection id="td-button" title="Button" href="/componenti/button">
        <Tabs>
          <TabList aria-label="Anteprime di Button">
            <Tab id="variants">Varianti e stati</Tab>
            <Tab id="sizes">Dimensioni</Tab>
          </TabList>
          <TabPanel id="variants">
            <SpecimenTable
              caption="Varianti e stati di Button"
              columns={['Predefinito', 'Con icona', 'Disabilitato', 'In caricamento']}
              rows={BUTTON_VARIANTS.map((variant) => ({
                label: variant.label,
                cells: [
                  <Button key="d" variant={variant.id} onPress={() => onAction(`Premuto: ${variant.label}`)}>
                    Avanti
                  </Button>,
                  <Button key="i" variant={variant.id} endIcon={<ArrowRight />} onPress={() => onAction(`Premuto: ${variant.label} con icona`)}>
                    Avanti
                  </Button>,
                  <Button key="x" variant={variant.id} isDisabled>
                    Avanti
                  </Button>,
                  <Button key="l" variant={variant.id} isPending>
                    Avanti
                  </Button>,
                ],
              }))}
            />
          </TabPanel>
          <TabPanel id="sizes">
            <SpecimenTable
              caption="Dimensioni di Button"
              columns={BUTTON_VARIANTS.map((v) => v.label)}
              rows={BUTTON_SIZES.map((size) => ({
                label: size.label,
                cells: BUTTON_VARIANTS.map((variant) => (
                  <Button key={variant.id} size={size.id} variant={variant.id} onPress={() => onAction(`Premuto: ${variant.label} ${size.label.toLowerCase()}`)}>
                    Avanti
                  </Button>
                )),
              }))}
            />
          </TabPanel>
        </Tabs>
      </PreviewSection>

      <PreviewSection id="td-alert" title="Alert" href="/componenti/alert">
        <div className="td-grid-2">
          {(['soft', 'outline'] as const).map((variant) => (
            <Stack key={variant} gap={2}>
              <Text variant="label-md" tone="secondary">
                {variant === 'soft' ? 'Soft' : 'Outline'}
              </Text>
              {ALERT_TONES.map((tone) => (
                <Alert key={tone.id} tone={tone.id} variant={variant} title={tone.title} />
              ))}
            </Stack>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection id="td-badge" title="Badge" href="/componenti/badge">
        <SpecimenTable
          caption="Toni e varianti di Badge"
          columns={['Soft', 'Solid', 'Outline']}
          rows={BADGE_TONES.map((tone) => ({
            label: tone.label,
            cells: (['soft', 'solid', 'outline'] as const).map((variant) => (
              <Badge key={variant} tone={tone.id} variant={variant}>
                Nuovo
              </Badge>
            )),
          }))}
        />
      </PreviewSection>

      <PreviewSection id="td-card" title="Card e moduli" href="/componenti/card">
        <div className="td-grid-2">
          <Card variant="outlined" className="td-surface">
            <CardHeader
              headingLevel={3}
              media={<Avatar name="Giulia Bianchi" size="sm" />}
              title="Profilo"
              subtitle="Giulia Bianchi · Product designer"
              actions={
                <DropdownMenu>
                  <IconButton variant="ghost" icon={<Settings2 />} label="Azioni profilo" />
                  <Menu aria-label="Azioni profilo" onAction={(key) => onAction(`Menu: ${String(key)}`)}>
                    <MenuItem id="modifica" icon={<Pencil />}>
                      Modifica
                    </MenuItem>
                    <MenuItem id="condividi" icon={<Share2 />}>
                      Condividi
                    </MenuItem>
                    <MenuItem id="elimina" icon={<Trash2 />}>
                      Elimina
                    </MenuItem>
                  </Menu>
                </DropdownMenu>
              }
            />
            <CardBody>
              <Stack gap={3}>
                <TextField label="Email" defaultValue="giulia@example.com" description="Usata per le notifiche." />
                <TextField label="Telefono" isInvalid errorMessage="Numero non valido." defaultValue="12" />
                <Select label="Ruolo" defaultValue="editor">
                  <ListBoxItem id="viewer">Lettore</ListBoxItem>
                  <ListBoxItem id="editor">Editor</ListBoxItem>
                  <ListBoxItem id="admin">Amministratore</ListBoxItem>
                </Select>
                <Switch isSelected={notify} onChange={setNotify}>
                  Notifiche email
                </Switch>
                <Checkbox defaultSelected>Ricordami su questo dispositivo</Checkbox>
              </Stack>
            </CardBody>
          </Card>
          <Stack gap={4}>
            <Card variant="elevated" className="td-surface">
              <CardHeader headingLevel={3} title="Piano Team" subtitle="Rinnovo il 12 novembre" />
              <CardBody>
                <Stack gap={3}>
                  <Progress label="Spazio utilizzato" value={68} />
                  <Inline justify="between" align="center" gap={2} wrap>
                    <AvatarGroup aria-label="Membri del team" max={3} size="sm">
                      <Avatar name="Giulia Bianchi" />
                      <Avatar name="Marco Rossi" />
                      <Avatar name="Sara Neri" />
                      <Avatar name="Luca Verdi" />
                    </AvatarGroup>
                    <Badge tone="success" variant="soft">
                      Attivo
                    </Badge>
                  </Inline>
                </Stack>
              </CardBody>
            </Card>
            <Card variant="filled" className="td-surface">
              <Stack gap={3}>
                <RadioGroup label="Fatturazione" defaultValue="annuale">
                  <Radio value="mensile">Mensile</Radio>
                  <Radio value="annuale">Annuale (−20%)</Radio>
                </RadioGroup>
                <Slider label="Postazioni" defaultValue={12} minValue={1} maxValue={50} />
              </Stack>
            </Card>
          </Stack>
        </div>
      </PreviewSection>

      <PreviewSection id="td-overlay" title="Overlay nel tema" href="/componenti/dialog">
        <Text tone="secondary" variant="body-sm">
          Dialog, Popover, Tooltip e Menu sono resi in un portal ma ereditano tema, aspetto e raggio di questa anteprima.
        </Text>
        <Inline gap={2} wrap>
          <DialogTrigger>
            <Button startIcon={<Plus />}>Apri dialogo</Button>
            <Dialog title="Nuovo progetto">
              <Stack gap={3}>
                <Text>Il dialogo usa il tema dell’anteprima, anche se è montato fuori dal suo contenitore.</Text>
                <TextField label="Nome del progetto" defaultValue="Portale clienti" />
              </Stack>
            </Dialog>
          </DialogTrigger>
          <PopoverTrigger>
            <Button variant="secondary" startIcon={<Bell />}>
              Notifiche
            </Button>
            <Popover title="Notifiche">
              <Text variant="body-sm">Nessuna nuova notifica.</Text>
            </Popover>
          </PopoverTrigger>
          <Tooltip content="Il tooltip eredita il tema dell’anteprima">
            <IconButton variant="outline" icon={<Info />} label="Informazioni sul tema" />
          </Tooltip>
        </Inline>
      </PreviewSection>
    </div>
  );
}

export function ThemeDesigner() {
  // Read outside the nested preview provider, so "Apply to site" targets the documentation theme.
  const site = useTheme();
  const [state, setStateRaw] = useState<DesignerState>(INITIAL_STATE);
  const [panelOpen, setPanelOpen] = useState(true);
  const [lastAction, setLastAction] = useState('');
  const theme = useMemo(() => buildDesignerTheme(state), [state]);
  const panelId = useId();
  const setState = (patch: Partial<DesignerState>) => setStateRaw((s) => ({ ...s, ...patch }));
  const gray = findGray(state.gray);

  return (
    <article className="docs-article docs-article--wide td">
      <PageMeta
        title="Theme Designer"
        description="Scegli accento, grigi, aspetto, raggio e stile e guarda l’effetto su tutte le varianti dei componenti in tempo reale."
      />
      <header className="docs-page-header">
        <Heading level={1}>Theme Designer</Heading>
        <Text variant="body-lg" tone="secondary">
          Scegli un accento e una famiglia di grigi: la palette completa viene generata con l’algoritmo HCT di <code>createTheme</code>. Aspetto, raggio,
          stile e densità sono dimensioni indipendenti. Per modificare i singoli ruoli semantici o importare un JSON usa il{' '}
          <Link href="/theme-builder">Theme Builder</Link>.
        </Text>
      </header>

      <ThemeProvider
        theme={theme}
        mode={state.appearance}
        look={state.look}
        density={state.density}
        surface
        className="td-stage"
        data-panel={state.panel}
        data-panel-open={panelOpen ? 'true' : 'false'}
      >
        <div className="td-toolbar">
          <Text variant="body-sm" tone="secondary">
            {findAccent(state.accent).label} · {gray.label} · {state.appearance === 'light' ? 'Chiaro' : 'Scuro'}
          </Text>
          <Toggle
            icon={<SlidersHorizontal />}
            variant="outline"
            size="sm"
            isSelected={panelOpen}
            onChange={setPanelOpen}
            aria-controls={panelOpen ? panelId : undefined}
          >
            Pannello tema
          </Toggle>
        </div>
        <p className="td-visually-hidden" role="status">
          {lastAction}
        </p>
        <div className="td-layout">
          {panelOpen ? <ThemePanel id={panelId} state={state} setState={setState} theme={theme} onApplyToSite={() => site.setTheme(theme)} /> : null}
          <div className="td-preview" style={state.scale === 100 ? undefined : { zoom: state.scale / 100 }}>
            <Preview onAction={setLastAction} />
          </div>
        </div>
      </ThemeProvider>
    </article>
  );
}
