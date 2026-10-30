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
} from '@dev-community/ui';

/** Representative components rendered with a fixed scheme. Overlays use the provider portal, so they inherit this theme. */
export function Preview({ theme, scheme, look }: { theme: Theme; scheme: 'light' | 'dark'; look: Look }) {
  const [notify, setNotify] = useState(true);
  const [count, setCount] = useState(0);
  const label = scheme === 'light' ? 'chiaro' : 'scuro';
  return (
    <ThemeProvider theme={theme} mode={scheme} look={look} surface className="tb-preview" data-scheme={scheme}>
      <Stack gap={4}>
        <Inline justify="between" align="center" wrap gap={2}>
          <Heading level={3} size="title-md">
            Anteprima tema {label}
          </Heading>
          <Badge tone="brand" variant="soft">
            {theme.label}
          </Badge>
        </Inline>
        <Inline gap={2} wrap>
          <Button startIcon={<Plus />} onPress={() => setCount((c) => c + 1)}>
            Primario ({count})
          </Button>
          <Button variant="secondary" onPress={() => setCount(0)}>
            Azzera
          </Button>
          <Button variant="ghost" isDisabled>
            Disabilitato
          </Button>
          <Button variant="danger" onPress={() => setCount((c) => Math.max(0, c - 1))}>
            Riduci
          </Button>
          <Tooltip content={`Tooltip nel tema ${label}`}>
            <IconButton variant="ghost" icon={<Info />} label="Mostra tooltip" />
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
                <IconButton variant="ghost" icon={<Bell />} label="Notifiche" />
                <Popover title="Notifiche">
                  <Text variant="body-sm">Popover nel tema {label}: eredita il tema dal provider di origine.</Text>
                </Popover>
              </PopoverTrigger>
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
              <Checkbox defaultSelected>Ricordami</Checkbox>
            </Stack>
          </CardBody>
        </Card>
        <Tabs>
          <TabList aria-label={`Schede di esempio (${label})`}>
            <Tab id="a">Panoramica</Tab>
            <Tab id="b">Attività</Tab>
          </TabList>
          <TabPanel id="a">
            <Progress label="Completamento profilo" value={72} />
          </TabPanel>
          <TabPanel id="b">
            <Text variant="body-sm">
              Ultima modifica ieri. <Link href="#anteprima">Vedi dettagli</Link>
            </Text>
          </TabPanel>
        </Tabs>
        <TagGroup label="Etichette" selectionMode="multiple" defaultSelectedKeys={['a']}>
          <Tag id="a">Design</Tag>
          <Tag id="b">Accessibilità</Tag>
          <Tag id="c">Token</Tag>
        </TagGroup>
        <Stack gap={2}>
          <Alert tone="info" title="Informazione">
            Aggiornamento previsto domani.
          </Alert>
          <Alert tone="success" title="Salvato" />
          <Alert tone="warning" title="Quota quasi esaurita" />
          <Alert tone="danger" title="Errore di connessione" />
        </Stack>
        <DialogTrigger>
          <Button variant="secondary">Apri dialogo</Button>
          <Dialog title={`Dialogo nel tema ${label}`}>
            <Text>Anche i dialoghi resi in un portal usano il tema e la modalità di questa anteprima.</Text>
          </Dialog>
        </DialogTrigger>
      </Stack>
    </ThemeProvider>
  );
}