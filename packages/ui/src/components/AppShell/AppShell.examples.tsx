import { BarChart3, FileText, Home, Package, Settings, ShoppingCart, Truck, Undo2, Users } from 'lucide-react';
import { useState } from 'react';
import {
  AppShell,
  Button,
  Footer,
  Header,
  Heading,
  MenuItem,
  NavigationMenu,
  Sidebar,
  Stack,
  Text,
  UserMenu,
  useAppShell,
  type NavigationMenuItem,
  type SidebarSection,
} from '@dev-community/ui';

const sections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Panoramica', href: '#overview', icon: <Home /> },
      { id: 'docs', label: 'Documenti', href: '#documents', icon: <FileText />, badge: '12' },
      { id: 'team', label: 'Team', href: '#team', icon: <Users /> },
    ],
  },
  {
    id: 'admin',
    title: 'Amministrazione',
    collapsible: true,
    items: [{ id: 'settings', label: 'Impostazioni', href: '#settings', icon: <Settings /> }],
  },
];

/**
 * The shell switches to a drawer below 1024px. In the docs preview the frame is as wide as the page,
 * so resize the window to see the mobile navigation. Links only update local state here.
 */
export function PortalShell() {
  const [current, setCurrent] = useState('home');
  const [signedOut, setSignedOut] = useState(false);
  const currentLabel = sections.flatMap((s) => s.items).find((i) => i.id === current)?.label;
  return (
    <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>
      <AppShell
        header={
          <Header
            sticky={false}
            brand={<Text as="span" weight="bold">Acme Portal</Text>}
            actions={
              <UserMenu
                user={{ name: 'Marco Rossi', email: 'marco.rossi@acme.example' }}
                onAction={(key) => setCurrent(String(key))}
                onSignOut={() => setSignedOut(true)}
              >
                <MenuItem id="settings">Impostazioni</MenuItem>
              </UserMenu>
            }
          />
        }
        sidebar={
          <Sidebar
            sections={sections}
            currentId={current}
            onNavigate={(item) => setCurrent(item.id)}
          />
        }
        footer={<Footer variant="compact" legal="© 2025 Acme S.p.A." legalLinks={[{ label: 'Privacy', href: '#privacy' }]} />}
      >
        <Stack gap={3} style={{ padding: 'var(--dc-space-6)' }}>
          <Heading level={2}>{currentLabel}</Heading>
          <Text tone="secondary" role="status">
            {signedOut ? 'Uscita simulata: nessuna sessione reale da chiudere.' : 'Contenuto della pagina selezionata.'}
          </Text>
        </Stack>
      </AppShell>
    </div>
  );
}

const backOfficeSections: SidebarSection[] = [
  {
    id: 'operations',
    title: 'Operazioni',
    items: [
      { id: 'orders', label: 'Ordini', href: '#ordini', icon: <ShoppingCart />, badge: '8' },
      { id: 'shipments', label: 'Spedizioni', href: '#spedizioni', icon: <Truck /> },
      { id: 'returns', label: 'Resi (in arrivo)', href: '#resi', icon: <Undo2 />, isDisabled: true },
    ],
  },
  {
    id: 'reports',
    title: 'Report',
    collapsible: true,
    defaultExpanded: false,
    items: [
      { id: 'sales', label: 'Vendite', href: '#vendite', icon: <BarChart3 /> },
      { id: 'stock', label: 'Magazzino', href: '#magazzino', icon: <Package /> },
    ],
  },
];

function CompactHint() {
  const shell = useAppShell();
  if (!shell) return null;
  return shell.isCompact ? (
    <Button variant="outline" onPress={() => shell.setSidebarOpen(true)}>
      Apri la navigazione
    </Button>
  ) : (
    <Text variant="body-sm" tone="secondary">
      Layout ampio: la barra laterale è sempre visibile. Restringi la finestra sotto 1024 px per usare il drawer.
    </Text>
  );
}

/** Controlled drawer state (`isSidebarOpen`), collapsible section closed by default, disabled item and sidebar footer. */
export function ControlledSidebar() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('orders');
  const currentLabel = backOfficeSections.flatMap((s) => s.items).find((i) => i.id === current)?.label;
  return (
    <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>
      <AppShell
        isSidebarOpen={open}
        onSidebarOpenChange={setOpen}
        sidebarTitle="Menu back-office"
        mainProps={{ 'aria-label': 'Contenuto back-office' }}
        header={<Header sticky={false} brand={<Text as="span" weight="bold">Acme Back-office</Text>} />}
        sidebar={
          <Sidebar
            aria-label="Back-office"
            sections={backOfficeSections}
            currentId={current}
            onNavigate={(item) => setCurrent(item.id)}
            footer={
              <Text variant="body-sm" tone="secondary">
                Versione 4.2.0
              </Text>
            }
          />
        }
      >
        <Stack gap={3} style={{ padding: 'var(--dc-space-6)' }}>
          <Heading level={2}>{currentLabel}</Heading>
          <Text tone="secondary">Drawer di navigazione: {open ? 'aperto' : 'chiuso'}.</Text>
          <CompactHint />
        </Stack>
      </AppShell>
    </div>
  );
}

const publicPages = [
  { id: 'pub-home', label: 'Home', href: '#sito-home' },
  { id: 'pub-services', label: 'Servizi', href: '#sito-servizi' },
  { id: 'pub-contacts', label: 'Contatti', href: '#sito-contatti' },
];

/** Public site without sidebar: Header with navigation and actions, Footer with link columns. */
export function WithoutSidebar() {
  const [current, setCurrent] = useState('pub-home');
  const [signedIn, setSignedIn] = useState(false);
  const navigation: NavigationMenuItem[] = publicPages.map((page) => ({
    ...page,
    current: page.id === current,
    linkProps: { onPress: () => setCurrent(page.id) },
  }));
  const currentLabel = publicPages.find((page) => page.id === current)?.label;
  return (
    <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>
      <AppShell
        mainProps={{ 'aria-label': 'Contenuto sito pubblico' }}
        header={
          <Header
            sticky={false}
            brand={<Text as="span" weight="bold">Studio Bianchi</Text>}
            navigation={<NavigationMenu items={navigation} aria-label="Sito pubblico" />}
            actions={
              <Button size="sm" variant={signedIn ? 'ghost' : 'primary'} onPress={() => setSignedIn((v) => !v)}>
                {signedIn ? 'Esci' : 'Accedi'}
              </Button>
            }
          />
        }
        footer={
          <Footer
            brand={<Text weight="bold">Studio Bianchi</Text>}
            columns={[
              { title: 'Studio', links: [{ label: 'Chi siamo', href: '#chi-siamo' }, { label: 'Lavora con noi', href: '#lavora' }] },
              { title: 'Supporto', links: [{ label: 'Domande frequenti', href: '#faq' }, { label: 'Contatti', href: '#sito-contatti' }] },
            ]}
            legal="© 2025 Studio Bianchi S.r.l. · P. IVA 01234567890"
          />
        }
      >
        <Stack gap={3} style={{ padding: 'var(--dc-space-6)' }}>
          <Heading level={2}>{currentLabel}</Heading>
          <Text tone="secondary">{signedIn ? 'Accesso simulato: area riservata disponibile.' : 'Visitatore non autenticato.'}</Text>
        </Stack>
      </AppShell>
    </div>
  );
}