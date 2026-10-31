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
import type { DocsLang, Localized } from '../i18n/lang';
import { useI18n } from '../settings';
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
const BUTTON_SIZES: readonly { id: ButtonSize; label: Localized }[] = [
  { id: 'sm', label: { it: 'Piccolo', en: 'Small' } },
  { id: 'md', label: { it: 'Medio', en: 'Medium' } },
  { id: 'lg', label: { it: 'Grande', en: 'Large' } },
];
const BADGE_TONES: readonly { id: BadgeTone; label: Localized }[] = [
  { id: 'brand', label: { it: 'Brand', en: 'Brand' } },
  { id: 'neutral', label: { it: 'Neutro', en: 'Neutral' } },
  { id: 'info', label: { it: 'Info', en: 'Info' } },
  { id: 'success', label: { it: 'Successo', en: 'Success' } },
  { id: 'warning', label: { it: 'Avviso', en: 'Warning' } },
  { id: 'danger', label: { it: 'Errore', en: 'Error' } },
];
const ALERT_TONES: readonly { id: FeedbackTone; title: Localized }[] = [
  { id: 'info', title: { it: 'È disponibile una nuova versione.', en: 'A new version is available.' } },
  { id: 'success', title: { it: 'Modifiche salvate.', en: 'Changes saved.' } },
  { id: 'warning', title: { it: 'Spazio di archiviazione quasi esaurito.', en: 'Storage space almost full.' } },
  { id: 'danger', title: { it: 'Impossibile completare il pagamento.', en: 'Unable to complete the payment.' } },
];

const COPY = {
  it: {
    panelTitle: 'Tema',
    accentColor: 'Colore di accento',
    grayColor: 'Colore dei grigi',
    appearance: 'Aspetto',
    light: 'Chiaro',
    dark: 'Scuro',
    radius: 'Raggio',
    scale: 'Scala dell’anteprima',
    scaleNote: 'CSS zoom, non è un token',
    look: 'Stile',
    expressive: 'Espressivo',
    density: 'Densità',
    comfortable: 'Comoda',
    compact: 'Compatta',
    panelBackground: 'Sfondo dei pannelli',
    panelNote: 'Ricetta CSS opzionale',
    solid: 'Pieno',
    translucent: 'Traslucido',
    failuresTitle: (count: number) => `${count} coppie sotto la soglia di contrasto`,
    failuresIn: (light: boolean) => `In tema ${light ? 'chiaro' : 'scuro'}: `,
    pairOn: (fg: string, bg: string) => `${fg} su ${bg}`,
    fixIn: '. Correggi i ruoli nel ',
    contrastOk: 'Le coppie testo/sfondo controllate superano le soglie WCAG AA in questo aspetto.',
    copiedTitle: 'Tema copiato',
    copiedDescription: 'Incolla il codice TypeScript nel tuo progetto.',
    copyTheme: 'Copia tema',
    reset: 'Ripristina',
    appliedTitle: 'Tema applicato alla documentazione',
    appliedDescription: 'Vale per questa sessione; aspetto, stile e densità del sito non cambiano.',
    applyToSite: 'Applica al sito',
    showCode: 'Mostra il codice generato',
    seeDocs: 'Vedi la documentazione',
    buttonPreviews: 'Anteprime di Button',
    variantsStates: 'Varianti e stati',
    sizes: 'Dimensioni',
    buttonVariantsCaption: 'Varianti e stati di Button',
    buttonColumns: ['Predefinito', 'Con icona', 'Disabilitato', 'In caricamento'],
    pressed: (label: string) => `Premuto: ${label}`,
    pressedWithIcon: (label: string) => `Premuto: ${label} con icona`,
    next: 'Avanti',
    buttonSizesCaption: 'Dimensioni di Button',
    badgeCaption: 'Toni e varianti di Badge',
    badgeNew: 'Nuovo',
    cardSection: 'Card e moduli',
    profile: 'Profilo',
    profileActions: 'Azioni profilo',
    menuAction: (key: string) => `Menu: ${key}`,
    edit: 'Modifica',
    share: 'Condividi',
    remove: 'Elimina',
    emailHelp: 'Usata per le notifiche.',
    phone: 'Telefono',
    phoneError: 'Numero non valido.',
    role: 'Ruolo',
    viewer: 'Lettore',
    editor: 'Editor',
    admin: 'Amministratore',
    emailNotifications: 'Notifiche email',
    rememberDevice: 'Ricordami su questo dispositivo',
    teamPlan: 'Piano Team',
    renewal: 'Rinnovo il 12 novembre',
    storageUsed: 'Spazio utilizzato',
    teamMembers: 'Membri del team',
    active: 'Attivo',
    billing: 'Fatturazione',
    monthly: 'Mensile',
    yearly: 'Annuale (−20%)',
    seats: 'Postazioni',
    overlaySection: 'Overlay nel tema',
    overlayIntro: 'Dialog, Popover, Tooltip e Menu sono resi in un portal ma ereditano tema, aspetto e raggio di questa anteprima.',
    openDialog: 'Apri dialogo',
    newProject: 'Nuovo progetto',
    dialogBody: 'Il dialogo usa il tema dell’anteprima, anche se è montato fuori dal suo contenitore.',
    projectName: 'Nome del progetto',
    projectDefault: 'Portale clienti',
    notifications: 'Notifiche',
    noNotifications: 'Nessuna nuova notifica.',
    tooltip: 'Il tooltip eredita il tema dell’anteprima',
    themeInfo: 'Informazioni sul tema',
    metaDescription: 'Scegli accento, grigi, aspetto, raggio e stile e guarda l’effetto su tutte le varianti dei componenti in tempo reale.',
    introBefore: 'Scegli un accento e una famiglia di grigi: la palette completa viene generata con l’algoritmo HCT di ',
    introAfter:
      '. Aspetto, raggio, stile e densità sono dimensioni indipendenti. Per modificare i singoli ruoli semantici o importare un JSON usa il ',
    themePanel: 'Pannello tema',
  },
  en: {
    panelTitle: 'Theme',
    accentColor: 'Accent color',
    grayColor: 'Gray color',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    radius: 'Radius',
    scale: 'Preview scale',
    scaleNote: 'CSS zoom, not a token',
    look: 'Look',
    expressive: 'Expressive',
    density: 'Density',
    comfortable: 'Comfortable',
    compact: 'Compact',
    panelBackground: 'Panel background',
    panelNote: 'Optional CSS recipe',
    solid: 'Solid',
    translucent: 'Translucent',
    failuresTitle: (count: number) => `${count} ${count === 1 ? 'pair' : 'pairs'} below the contrast threshold`,
    failuresIn: (light: boolean) => `In the ${light ? 'light' : 'dark'} theme: `,
    pairOn: (fg: string, bg: string) => `${fg} on ${bg}`,
    fixIn: '. Fix the roles in the ',
    contrastOk: 'The checked text/background pairs meet the WCAG AA thresholds in this appearance.',
    copiedTitle: 'Theme copied',
    copiedDescription: 'Paste the TypeScript code into your project.',
    copyTheme: 'Copy theme',
    reset: 'Reset',
    appliedTitle: 'Theme applied to the documentation',
    appliedDescription: 'Applies to this session only; the site appearance, look and density do not change.',
    applyToSite: 'Apply to site',
    showCode: 'Show the generated code',
    seeDocs: 'See the documentation',
    buttonPreviews: 'Button previews',
    variantsStates: 'Variants and states',
    sizes: 'Sizes',
    buttonVariantsCaption: 'Button variants and states',
    buttonColumns: ['Default', 'With icon', 'Disabled', 'Loading'],
    pressed: (label: string) => `Pressed: ${label}`,
    pressedWithIcon: (label: string) => `Pressed: ${label} with icon`,
    next: 'Next',
    buttonSizesCaption: 'Button sizes',
    badgeCaption: 'Badge tones and variants',
    badgeNew: 'New',
    cardSection: 'Cards and forms',
    profile: 'Profile',
    profileActions: 'Profile actions',
    menuAction: (key: string) => `Menu: ${key}`,
    edit: 'Edit',
    share: 'Share',
    remove: 'Delete',
    emailHelp: 'Used for notifications.',
    phone: 'Phone',
    phoneError: 'Invalid number.',
    role: 'Role',
    viewer: 'Viewer',
    editor: 'Editor',
    admin: 'Administrator',
    emailNotifications: 'Email notifications',
    rememberDevice: 'Remember me on this device',
    teamPlan: 'Team plan',
    renewal: 'Renews on November 12',
    storageUsed: 'Storage used',
    teamMembers: 'Team members',
    active: 'Active',
    billing: 'Billing',
    monthly: 'Monthly',
    yearly: 'Yearly (−20%)',
    seats: 'Seats',
    overlaySection: 'Overlays in the theme',
    overlayIntro: 'Dialog, Popover, Tooltip and Menu are rendered in a portal but inherit the theme, appearance and radius of this preview.',
    openDialog: 'Open dialog',
    newProject: 'New project',
    dialogBody: 'The dialog uses the preview theme, even though it is mounted outside its container.',
    projectName: 'Project name',
    projectDefault: 'Customer portal',
    notifications: 'Notifications',
    noNotifications: 'No new notifications.',
    tooltip: 'The tooltip inherits the preview theme',
    themeInfo: 'Theme information',
    metaDescription: 'Pick accent, grays, appearance, radius and look and see the effect on every component variant in real time.',
    introBefore: 'Pick an accent and a gray family: the full palette is generated with the HCT algorithm of ',
    introAfter: '. Appearance, radius, look and density are independent dimensions. To edit individual semantic roles or import a JSON use the ',
    themePanel: 'Theme panel',
  },
} satisfies Record<DocsLang, unknown>;

type Copy = (typeof COPY)[DocsLang];

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
  const { lang } = useI18n();
  const selected = items.find((item) => item.id === value);
  return (
    <fieldset className="td-group td-fieldset">
      <legend className="td-group-head">
        <Text as="span" variant="label-md">
          {legend}
        </Text>
        <Text as="span" variant="body-sm" tone="secondary">
          {selected?.label[lang]}
        </Text>
      </legend>
      <div className="td-swatches">
        {items.map((item) => (
          <label key={item.id} className="td-swatch" title={item.label[lang]}>
            <input type="radio" className="td-swatch-input" name={name} value={item.id} checked={item.id === value} onChange={() => onChange(item.id)} />
            <span className="td-swatch-dot" style={{ background: background?.(item) ?? item.hex }} aria-hidden="true" />
            <VisuallyHidden>{item.label[lang]}</VisuallyHidden>
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
  const { lang } = useI18n();
  const copy = COPY[lang];
  const failures = useMemo(() => contrastReport(theme, state.appearance).filter((row) => !row.pass), [theme, state.appearance]);
  const accent = findAccent(state.accent);
  const snippet = designerSnippet(state, lang);

  return (
    <aside id={id} className="td-panel td-surface" aria-labelledby={`${id}-title`}>
      <Heading level={2} size="title-md" id={`${id}-title`}>
        {copy.panelTitle}
      </Heading>

      <SwatchGroup legend={copy.accentColor} items={ACCENTS} value={state.accent} onChange={(accentId) => setState({ accent: accentId })} />
      <SwatchGroup
        legend={copy.grayColor}
        items={GRAYS}
        value={state.gray}
        onChange={(gray) => setState({ gray })}
        background={(item) => (item.id === 'auto' ? `linear-gradient(135deg, ${accent.hex} 0 50%, ${item.hex} 50% 100%)` : item.hex)}
      />

      <PanelGroup title={copy.appearance}>
        <ToggleGroup
          aria-label={copy.appearance}
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.appearance]}
          onSelectionChange={(keys) => pick(keys, ['light', 'dark'] as const, (appearance) => setState({ appearance }))}
        >
          <Toggle id="light" icon={<Sun />}>
            {copy.light}
          </Toggle>
          <Toggle id="dark" icon={<Moon />}>
            {copy.dark}
          </Toggle>
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title={copy.radius}>
        <ToggleGroup
          aria-label={copy.radius}
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--5 td-radius"
          selectedKeys={[state.radius]}
          onSelectionChange={(keys) => pick(keys, RADIUS_PRESETS.map((r) => r.id), (radius) => setState({ radius }))}
        >
          {RADIUS_PRESETS.map((preset) => (
            <Toggle key={preset.id} id={preset.id} aria-label={preset.label[lang]}>
              <span className="td-radius-cell">
                <span className="td-radius-sample" style={{ borderStartEndRadius: RADIUS_TOKENS[preset.id]['radius.xl'] ?? 'var(--dc-radius-xl)' }} aria-hidden="true" />
                <span className="td-radius-label">{preset.label[lang]}</span>
              </span>
            </Toggle>
          ))}
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title={copy.scale} value={copy.scaleNote}>
        <ToggleGroup
          aria-label={copy.scale}
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

      <PanelGroup title={copy.look}>
        <ToggleGroup
          aria-label={copy.look}
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.look]}
          onSelectionChange={(keys) => pick(keys, ['standard', 'expressive'] as const, (look) => setState({ look }))}
        >
          <Toggle id="standard">Standard</Toggle>
          <Toggle id="expressive">{copy.expressive}</Toggle>
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title={copy.density}>
        <ToggleGroup
          aria-label={copy.density}
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.density]}
          onSelectionChange={(keys) => pick(keys, ['comfortable', 'compact'] as const, (density) => setState({ density }))}
        >
          <Toggle id="comfortable">{copy.comfortable}</Toggle>
          <Toggle id="compact">{copy.compact}</Toggle>
        </ToggleGroup>
      </PanelGroup>

      <PanelGroup title={copy.panelBackground} value={copy.panelNote}>
        <ToggleGroup
          aria-label={copy.panelBackground}
          attached={false}
          disallowEmptySelection
          className="td-segments td-segments--2"
          selectedKeys={[state.panel]}
          onSelectionChange={(keys) => pick(keys, ['solid', 'translucent'] as const, (panel) => setState({ panel }))}
        >
          <Toggle id="solid">{copy.solid}</Toggle>
          <Toggle id="translucent">{copy.translucent}</Toggle>
        </ToggleGroup>
      </PanelGroup>

      {failures.length > 0 ? (
        <Alert tone="warning" title={copy.failuresTitle(failures.length)}>
          <Text variant="body-sm">
            {copy.failuresIn(state.appearance === 'light')}
            {failures.map((row) => copy.pairOn(row.fg, row.bg)).join(', ')}
            {copy.fixIn}
            <Link href="/theme-builder">Theme Builder</Link>.
          </Text>
        </Alert>
      ) : (
        <Text variant="body-sm" tone="secondary" className="td-contrast-ok">
          <CheckCircle2 aria-hidden="true" /> {copy.contrastOk}
        </Text>
      )}

      <div className="td-actions">
        <CopyButton value={snippet} variant="primary" onCopy={() => toast.show({ tone: 'success', title: copy.copiedTitle, description: copy.copiedDescription })}>
          {copy.copyTheme}
        </CopyButton>
        <Button variant="secondary" onPress={() => setState(INITIAL_STATE)}>
          {copy.reset}
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            onApplyToSite();
            toast.show({ tone: 'success', title: copy.appliedTitle, description: copy.appliedDescription });
          }}
        >
          {copy.applyToSite}
        </Button>
      </div>
      <details className="td-code">
        <summary>{copy.showCode}</summary>
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
  const { lang } = useI18n();
  return (
    <section className="td-section" aria-labelledby={id}>
      <Inline gap={3} align="center" wrap>
        <Heading level={2} size="title-lg" id={id}>
          {title}
        </Heading>
        <Link href={href}>{COPY[lang].seeDocs}</Link>
      </Inline>
      {children}
    </section>
  );
}

function Preview({ onAction, copy, lang }: { onAction: (message: string) => void; copy: Copy; lang: DocsLang }) {
  const [notify, setNotify] = useState(true);
  return (
    <div className="td-sections">
      <PreviewSection id="td-button" title="Button" href="/componenti/button">
        <Tabs>
          <TabList aria-label={copy.buttonPreviews}>
            <Tab id="variants">{copy.variantsStates}</Tab>
            <Tab id="sizes">{copy.sizes}</Tab>
          </TabList>
          <TabPanel id="variants">
            <SpecimenTable
              caption={copy.buttonVariantsCaption}
              columns={copy.buttonColumns}
              rows={BUTTON_VARIANTS.map((variant) => ({
                label: variant.label,
                cells: [
                  <Button key="d" variant={variant.id} onPress={() => onAction(copy.pressed(variant.label))}>
                    {copy.next}
                  </Button>,
                  <Button key="i" variant={variant.id} endIcon={<ArrowRight />} onPress={() => onAction(copy.pressedWithIcon(variant.label))}>
                    {copy.next}
                  </Button>,
                  <Button key="x" variant={variant.id} isDisabled>
                    {copy.next}
                  </Button>,
                  <Button key="l" variant={variant.id} isPending>
                    {copy.next}
                  </Button>,
                ],
              }))}
            />
          </TabPanel>
          <TabPanel id="sizes">
            <SpecimenTable
              caption={copy.buttonSizesCaption}
              columns={BUTTON_VARIANTS.map((v) => v.label)}
              rows={BUTTON_SIZES.map((size) => ({
                label: size.label[lang],
                cells: BUTTON_VARIANTS.map((variant) => (
                  <Button key={variant.id} size={size.id} variant={variant.id} onPress={() => onAction(copy.pressed(`${variant.label} ${size.label[lang].toLowerCase()}`))}>
                    {copy.next}
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
                <Alert key={tone.id} tone={tone.id} variant={variant} title={tone.title[lang]} />
              ))}
            </Stack>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection id="td-badge" title="Badge" href="/componenti/badge">
        <SpecimenTable
          caption={copy.badgeCaption}
          columns={['Soft', 'Solid', 'Outline']}
          rows={BADGE_TONES.map((tone) => ({
            label: tone.label[lang],
            cells: (['soft', 'solid', 'outline'] as const).map((variant) => (
              <Badge key={variant} tone={tone.id} variant={variant}>
                {copy.badgeNew}
              </Badge>
            )),
          }))}
        />
      </PreviewSection>

      <PreviewSection id="td-card" title={copy.cardSection} href="/componenti/card">
        <div className="td-grid-2">
          <Card variant="outlined" className="td-surface">
            <CardHeader
              headingLevel={3}
              media={<Avatar name="Giulia Bianchi" size="sm" />}
              title={copy.profile}
              subtitle="Giulia Bianchi · Product designer"
              actions={
                <DropdownMenu>
                  <IconButton variant="ghost" icon={<Settings2 />} label={copy.profileActions} />
                  <Menu aria-label={copy.profileActions} onAction={(key) => onAction(copy.menuAction(String(key)))}>
                    <MenuItem id="modifica" icon={<Pencil />}>
                      {copy.edit}
                    </MenuItem>
                    <MenuItem id="condividi" icon={<Share2 />}>
                      {copy.share}
                    </MenuItem>
                    <MenuItem id="elimina" icon={<Trash2 />}>
                      {copy.remove}
                    </MenuItem>
                  </Menu>
                </DropdownMenu>
              }
            />
            <CardBody>
              <Stack gap={3}>
                <TextField label="Email" defaultValue="giulia@example.com" description={copy.emailHelp} />
                <TextField label={copy.phone} isInvalid errorMessage={copy.phoneError} defaultValue="12" />
                <Select label={copy.role} defaultValue="editor">
                  <ListBoxItem id="viewer">{copy.viewer}</ListBoxItem>
                  <ListBoxItem id="editor">{copy.editor}</ListBoxItem>
                  <ListBoxItem id="admin">{copy.admin}</ListBoxItem>
                </Select>
                <Switch isSelected={notify} onChange={setNotify}>
                  {copy.emailNotifications}
                </Switch>
                <Checkbox defaultSelected>{copy.rememberDevice}</Checkbox>
              </Stack>
            </CardBody>
          </Card>
          <Stack gap={4}>
            <Card variant="elevated" className="td-surface">
              <CardHeader headingLevel={3} title={copy.teamPlan} subtitle={copy.renewal} />
              <CardBody>
                <Stack gap={3}>
                  <Progress label={copy.storageUsed} value={68} />
                  <Inline justify="between" align="center" gap={2} wrap>
                    <AvatarGroup aria-label={copy.teamMembers} max={3} size="sm">
                      <Avatar name="Giulia Bianchi" />
                      <Avatar name="Marco Rossi" />
                      <Avatar name="Sara Neri" />
                      <Avatar name="Luca Verdi" />
                    </AvatarGroup>
                    <Badge tone="success" variant="soft">
                      {copy.active}
                    </Badge>
                  </Inline>
                </Stack>
              </CardBody>
            </Card>
            <Card variant="filled" className="td-surface">
              <Stack gap={3}>
                <RadioGroup label={copy.billing} defaultValue="annuale">
                  <Radio value="mensile">{copy.monthly}</Radio>
                  <Radio value="annuale">{copy.yearly}</Radio>
                </RadioGroup>
                <Slider label={copy.seats} defaultValue={12} minValue={1} maxValue={50} />
              </Stack>
            </Card>
          </Stack>
        </div>
      </PreviewSection>

      <PreviewSection id="td-overlay" title={copy.overlaySection} href="/componenti/dialog">
        <Text tone="secondary" variant="body-sm">
          {copy.overlayIntro}
        </Text>
        <Inline gap={2} wrap>
          <DialogTrigger>
            <Button startIcon={<Plus />}>{copy.openDialog}</Button>
            <Dialog title={copy.newProject}>
              <Stack gap={3}>
                <Text>{copy.dialogBody}</Text>
                <TextField label={copy.projectName} defaultValue={copy.projectDefault} />
              </Stack>
            </Dialog>
          </DialogTrigger>
          <PopoverTrigger>
            <Button variant="secondary" startIcon={<Bell />}>
              {copy.notifications}
            </Button>
            <Popover title={copy.notifications}>
              <Text variant="body-sm">{copy.noNotifications}</Text>
            </Popover>
          </PopoverTrigger>
          <Tooltip content={copy.tooltip}>
            <IconButton variant="outline" icon={<Info />} label={copy.themeInfo} />
          </Tooltip>
        </Inline>
      </PreviewSection>
    </div>
  );
}

export function ThemeDesigner() {
  // Read outside the nested preview provider, so "Apply to site" targets the documentation theme.
  const site = useTheme();
  const { lang } = useI18n();
  const copy = COPY[lang];
  const [state, setStateRaw] = useState<DesignerState>(INITIAL_STATE);
  const [panelOpen, setPanelOpen] = useState(true);
  const [lastAction, setLastAction] = useState('');
  const theme = useMemo(() => buildDesignerTheme(state, lang), [state, lang]);
  const panelId = useId();
  const setState = (patch: Partial<DesignerState>) => setStateRaw((s) => ({ ...s, ...patch }));
  const gray = findGray(state.gray);

  return (
    <article className="docs-article docs-article--wide td">
      <PageMeta
        title="Theme Designer"
        description={copy.metaDescription}
      />
      <header className="docs-page-header">
        <Heading level={1}>Theme Designer</Heading>
        <Text variant="body-lg" tone="secondary">
          {copy.introBefore}
          <code>createTheme</code>
          {copy.introAfter}
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
            {findAccent(state.accent).label[lang]} · {gray.label[lang]} · {state.appearance === 'light' ? copy.light : copy.dark}
          </Text>
          <Toggle
            icon={<SlidersHorizontal />}
            variant="outline"
            size="sm"
            isSelected={panelOpen}
            onChange={setPanelOpen}
            aria-controls={panelOpen ? panelId : undefined}
          >
            {copy.themePanel}
          </Toggle>
        </div>
        <p className="td-visually-hidden" role="status">
          {lastAction}
        </p>
        <div className="td-layout">
          {panelOpen ? <ThemePanel id={panelId} state={state} setState={setState} theme={theme} onApplyToSite={() => site.setTheme(theme)} /> : null}
          <div className="td-preview" style={state.scale === 100 ? undefined : { zoom: state.scale / 100 }}>
            <Preview onAction={setLastAction} copy={copy} lang={lang} />
          </div>
        </div>
      </ThemeProvider>
    </article>
  );
}
