import { AlertTriangle, Bell, BookOpen, ClipboardList, FileText, LayoutDashboard, LogOut, Moon, Settings, Sun, User, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import {
  AppShell,
  Badge,
  Footer,
  Header,
  IconButton,
  Inline,
  MenuItem,
  Popover,
  PopoverTrigger,
  Sidebar,
  Stack,
  Text,
  UserMenu,
  useTheme,
  type SidebarSection,
} from '@dev-community/ui';
import { PageMeta } from '../components/PageMeta';
import { Landing } from './Landing';
import { Dashboard } from './Dashboard';
import { CustomerList } from './CustomerList';
import { CustomerDetail } from './CustomerDetail';
import { RequestForm } from './RequestForm';
import { SettingsPage } from './SettingsPage';
import { AccountPage } from './AccountPage';
import { AuthPage } from './AuthPage';
import { ErrorStates, NotFoundTemplate } from './ErrorStates';
import { Brand, DemoBanner } from './chrome';
import './showcase.css';

const sections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/showcase/dashboard', icon: <LayoutDashboard /> },
      { id: 'elenco', label: 'Clienti', href: '/showcase/elenco', icon: <Users /> },
      { id: 'modulo', label: 'Nuova richiesta', href: '/showcase/modulo', icon: <ClipboardList /> },
    ],
  },
  {
    id: 'profile',
    title: 'Profilo',
    items: [
      { id: 'account', label: 'Account', href: '/showcase/account', icon: <User /> },
      { id: 'impostazioni', label: 'Impostazioni', href: '/showcase/impostazioni', icon: <Settings /> },
    ],
  },
  {
    id: 'other',
    title: 'Altri template',
    items: [
      { id: 'errori', label: 'Errori e stati vuoti', href: '/showcase/errori', icon: <AlertTriangle /> },
      { id: 'landing', label: 'Landing page', href: '/showcase/landing', icon: <FileText /> },
      { id: 'accesso', label: 'Accesso', href: '/showcase/accesso', icon: <LogOut /> },
    ],
  },
];

const notifications = [
  { id: 'n1', title: 'Ordine ORD-24187 da spedire', time: 'oggi' },
  { id: 'n2', title: 'Fontana Design ha rinnovato il piano', time: 'ieri' },
  { id: 'n3', title: 'Pagamento non riuscito: Caruso Ottica', time: '2 giorni fa' },
];

function ModeToggle() {
  const { resolvedScheme, setMode } = useTheme();
  const dark = resolvedScheme === 'dark';
  return (
    <IconButton
      variant="ghost"
      label={dark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      icon={dark ? <Sun /> : <Moon />}
      onPress={() => setMode(dark ? 'light' : 'dark')}
    />
  );
}

function Notifications() {
  return (
    <PopoverTrigger>
      <IconButton variant="ghost" label={`Notifiche, ${notifications.length} non lette`} icon={<Bell />} />
      <Popover title="Notifiche" placement="bottom end">
        <Stack as="ul" gap={3} className="sc-plain-list">
          {notifications.map((n) => (
            <li key={n.id}>
              <Text weight="medium">{n.title}</Text>
              <Text variant="body-sm" tone="secondary">
                {n.time}
              </Text>
            </li>
          ))}
        </Stack>
      </Popover>
    </PopoverTrigger>
  );
}

function AccountMenu() {
  const navigate = useNavigate();
  return (
    <UserMenu
      user={{ name: 'Giulia Bianchi', email: 'giulia.bianchi@northwind.example', role: 'Amministratrice' }}
      onSignOut={() => void navigate('/showcase/accesso')}
    >
      <MenuItem id="account" href="/showcase/account" icon={<User />}>
        Account
      </MenuItem>
      <MenuItem id="settings" href="/showcase/impostazioni" icon={<Settings />}>
        Impostazioni
      </MenuItem>
    </UserMenu>
  );
}

function PortalLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = pathname.split('/')[2] || 'dashboard';
  return (
    <AppShell
      header={
        <Header
          brand={<Brand />}
          actions={
            <Inline gap={1} align="center" justify="end">
              <IconButton variant="ghost" label="Torna alla documentazione" icon={<BookOpen />} onPress={() => void navigate('/pattern')} />
              <ModeToggle />
              <Notifications />
              <AccountMenu />
            </Inline>
          }
        />
      }
      sidebar={<Sidebar aria-label="Navigazione del portale" sections={sections} currentId={current} footer={<Badge tone="brand">Demo</Badge>} />}
      footer={
        <Footer
          variant="compact"
          brand={<Text as="span" weight="medium">Northwind</Text>}
          legalLinks={[
            { label: 'Impostazioni', href: '/showcase/impostazioni' },
            { label: 'Documentazione', href: '/pattern' },
          ]}
          legal="© 2025 Northwind Servizi S.r.l. — azienda e dati fittizi."
        />
      }
    >
      <DemoBanner />
      <div className="sc-page">
        <Outlet />
      </div>
    </AppShell>
  );
}

function Page({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <>
      <PageMeta title={`${title} · Showcase`} description={description} />
      {children}
    </>
  );
}

export function ShowcaseRoutes() {
  return (
    <Routes>
      <Route path="landing" element={<Page title="Landing page" description="Template di landing page."><Landing /></Page>} />
      <Route path="accesso" element={<Page title="Accesso" description="Login, registrazione e recupero password dimostrativi."><AuthPage /></Page>} />
      <Route element={<PortalLayout />}>
        <Route index element={<Page title="Dashboard" description="Dashboard del portale dimostrativo."><Dashboard /></Page>} />
        <Route path="dashboard" element={<Page title="Dashboard" description="Dashboard del portale dimostrativo."><Dashboard /></Page>} />
        <Route path="elenco" element={<Page title="Clienti" description="Elenco clienti con filtri e DataTable."><CustomerList /></Page>} />
        <Route path="dettaglio" element={<Page title="Dettaglio cliente" description="Pagina di dettaglio cliente."><CustomerDetail /></Page>} />
        <Route path="modulo" element={<Page title="Nuova richiesta" description="Form articolato con validazione."><RequestForm /></Page>} />
        <Route path="impostazioni" element={<Page title="Impostazioni" description="Preferenze del portale."><SettingsPage /></Page>} />
        <Route path="account" element={<Page title="Account" description="Area account."><AccountPage /></Page>} />
        <Route path="errori" element={<Page title="Errori e stati vuoti" description="Pagine di errore e stati vuoti."><ErrorStates /></Page>} />
        <Route path="*" element={<Page title="Pagina non trovata" description="Errore 404."><NotFoundTemplate /></Page>} />
      </Route>
    </Routes>
  );
}
