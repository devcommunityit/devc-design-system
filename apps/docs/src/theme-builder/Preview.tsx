import { useState } from 'react';
import { Bell, Info, Plus } from 'lucide-react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Dialog,
  DialogTrigger,
  Heading,
  IconButton,
  Inline,
  Link,
  ListBoxItem,
  Popover,
  PopoverTrigger,
  Progress,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  TagGroup,
  Text,
  TextField,
  ThemeProvider,
  Tooltip,
  type Look,
  type Theme,
} from '@devcommunityit/ui';
import type { DocsLang } from '../i18n/lang';
import { useI18n } from '../settings';

const COPY = {
  it: {
    light: 'chiaro',
    dark: 'scuro',
    heading: (label: string) => `Anteprima tema ${label}`,
    primary: (count: number) => `Primario (${count})`,
    reset: 'Azzera',
    disabled: 'Disabilitato',
    decrease: 'Riduci',
    tooltip: (label: string) => `Tooltip nel tema ${label}`,
    showTooltip: 'Mostra tooltip',
    notifications: 'Notifiche',
    popover: (label: string) => `Popover nel tema ${label}: eredita il tema dal provider di origine.`,
    emailHelp: 'Usata per le notifiche.',
    phone: 'Telefono',
    phoneError: 'Numero non valido.',
    role: 'Ruolo',
    viewer: 'Lettore',
    editor: 'Editor',
    admin: 'Amministratore',
    emailNotifications: 'Notifiche email',
    remember: 'Ricordami',
    tabs: (label: string) => `Schede di esempio (${label})`,
    overview: 'Panoramica',
    activity: 'Attività',
    profileProgress: 'Completamento profilo',
    lastEdit: 'Ultima modifica ieri.',
    details: 'Vedi dettagli',
    tags: 'Etichette',
    accessibility: 'Accessibilità',
    info: 'Informazione',
    infoBody: 'Aggiornamento previsto domani.',
    saved: 'Salvato',
    quota: 'Quota quasi esaurita',
    connection: 'Errore di connessione',
    openDialog: 'Apri dialogo',
    dialogTitle: (label: string) => `Dialogo nel tema ${label}`,
    dialogBody: 'Anche i dialoghi resi in un portal usano il tema e la modalità di questa anteprima.',
  },
  en: {
    light: 'light',
    dark: 'dark',
    heading: (label: string) => `${label.charAt(0).toUpperCase()}${label.slice(1)} theme preview`,
    primary: (count: number) => `Primary (${count})`,
    reset: 'Reset',
    disabled: 'Disabled',
    decrease: 'Decrease',
    tooltip: (label: string) => `Tooltip in the ${label} theme`,
    showTooltip: 'Show tooltip',
    notifications: 'Notifications',
    popover: (label: string) => `Popover in the ${label} theme: it inherits the theme from its originating provider.`,
    emailHelp: 'Used for notifications.',
    phone: 'Phone',
    phoneError: 'Invalid number.',
    role: 'Role',
    viewer: 'Viewer',
    editor: 'Editor',
    admin: 'Administrator',
    emailNotifications: 'Email notifications',
    remember: 'Remember me',
    tabs: (label: string) => `Sample tabs (${label})`,
    overview: 'Overview',
    activity: 'Activity',
    profileProgress: 'Profile completion',
    lastEdit: 'Last edited yesterday.',
    details: 'See details',
    tags: 'Tags',
    accessibility: 'Accessibility',
    info: 'Information',
    infoBody: 'Update scheduled for tomorrow.',
    saved: 'Saved',
    quota: 'Quota almost exhausted',
    connection: 'Connection error',
    openDialog: 'Open dialog',
    dialogTitle: (label: string) => `Dialog in the ${label} theme`,
    dialogBody: 'Dialogs rendered in a portal also use the theme and mode of this preview.',
  },
} satisfies Record<DocsLang, unknown>;

/** Representative components rendered with a fixed scheme. Overlays use the provider portal, so they inherit this theme. */
export function Preview({ theme, scheme, look }: { theme: Theme; scheme: 'light' | 'dark'; look: Look }) {
  const [notify, setNotify] = useState(true);
  const [count, setCount] = useState(0);
  const { lang } = useI18n();
  const copy = COPY[lang];
  const label = scheme === 'light' ? copy.light : copy.dark;
  return (
    <ThemeProvider theme={theme} mode={scheme} look={look} surface className="tb-preview" data-scheme={scheme}>
      <Stack gap={4}>
        <Inline justify="between" align="center" wrap gap={2}>
          <Heading level={3} size="title-md">
            {copy.heading(label)}
          </Heading>
          <Badge tone="brand" variant="soft">
            {theme.label}
          </Badge>
        </Inline>
        <Inline gap={2} wrap>
          <Button startIcon={<Plus />} onPress={() => setCount((c) => c + 1)}>
            {copy.primary(count)}
          </Button>
          <Button variant="secondary" onPress={() => setCount(0)}>
            {copy.reset}
          </Button>
          <Button variant="ghost" isDisabled>
            {copy.disabled}
          </Button>
          <Button variant="danger" onPress={() => setCount((c) => Math.max(0, c - 1))}>
            {copy.decrease}
          </Button>
          <Tooltip content={copy.tooltip(label)}>
            <IconButton variant="ghost" icon={<Info />} label={copy.showTooltip} />
          </Tooltip>
        </Inline>
        <Card variant="outlined">
          <CardHeader
            headingLevel={4}
            media={<Avatar name="Giulia Bianchi" size="sm" />}
            title="Giulia Bianchi"
            subtitle="Product designer"
            actions={
              <PopoverTrigger>
                <IconButton variant="ghost" icon={<Bell />} label={copy.notifications} />
                <Popover title={copy.notifications}>
                  <Text variant="body-sm">{copy.popover(label)}</Text>
                </Popover>
              </PopoverTrigger>
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
              <Checkbox defaultSelected>{copy.remember}</Checkbox>
            </Stack>
          </CardBody>
        </Card>
        <Tabs>
          <TabList aria-label={copy.tabs(label)}>
            <Tab id="a">{copy.overview}</Tab>
            <Tab id="b">{copy.activity}</Tab>
          </TabList>
          <TabPanel id="a">
            <Progress label={copy.profileProgress} value={72} />
          </TabPanel>
          <TabPanel id="b">
            <Text variant="body-sm">
              {copy.lastEdit} <Link href="#anteprima">{copy.details}</Link>
            </Text>
          </TabPanel>
        </Tabs>
        <TagGroup label={copy.tags} selectionMode="multiple" defaultSelectedKeys={['a']}>
          <Tag id="a">Design</Tag>
          <Tag id="b">{copy.accessibility}</Tag>
          <Tag id="c">Token</Tag>
        </TagGroup>
        <Stack gap={2}>
          <Alert tone="info" title={copy.info}>
            {copy.infoBody}
          </Alert>
          <Alert tone="success" title={copy.saved} />
          <Alert tone="warning" title={copy.quota} />
          <Alert tone="danger" title={copy.connection} />
        </Stack>
        <DialogTrigger>
          <Button variant="secondary">{copy.openDialog}</Button>
          <Dialog title={copy.dialogTitle(label)}>
            <Text>{copy.dialogBody}</Text>
          </Dialog>
        </DialogTrigger>
      </Stack>
    </ThemeProvider>
  );
}