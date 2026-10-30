import { AlertTriangle, BookOpen, ClipboardList, FileText, LayoutDashboard, LogOut, Moon, Settings, Sun, User, Users } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import {
  AppShell,
  Badge,
  Button,
  Footer,
  Header,
  IconButton,
  Inline,
  MenuItem,
  NotificationCenter,
  Sidebar,
  Text,
  UserMenu,
  useTheme,
  type NotificationItem,
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

// Fixed reference instant so relative times are deterministic in the demo.
const DEMO_NOW = '2025-03-14T10:00:00Z';

const initialNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Ordine ORD-24187 da spedire', description: 'Consegna prevista entro venerdì.', date: '2025-03-14T09:20:00Z', href: '/showcase/dashboard' },
  { id: 'n2', title: 'Fontana Design ha rinnovato il piano', date: '2025-03-13T15:00:00Z', href: '/showcase/dettaglio' },
  { id: 'n3', title: 'Pagamento non riuscito: Caruso Ottica', description: 'Verifica il metodo di pagamento.', date: '2025-03-12T08:30:00Z', href: '/showcase/elenco' },
  { id: 'n4', title: 'Richiesta di supporto chiusa', date: '2025-03-10T11:00:00Z', read: true },
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
  const [items, setItems] = useState(initialNotifications);
  const markRead = (id: string) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  return (
    <NotificationCenter
      items={items}
      now={DEMO_NOW}
      onMarkRead={markRead}
      onMarkAllRead={() => setItems((list) => list.map((n) => ({ ...n, read: true })))}
      onItemAction={markRead}
      footer={({ close }) => (
        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            setItems(initialNotifications);
            close();
          }}
        >
          Ripristina notifiche demo
        </Button>
      )}
    />
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
