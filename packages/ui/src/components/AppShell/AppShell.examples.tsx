import { FileText, Home, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import { AppShell, Footer, Header, Heading, MenuItem, Sidebar, Stack, Text, UserMenu, type SidebarSection } from '@dev-community/ui';

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