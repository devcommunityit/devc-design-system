import { BarChart3, CreditCard, FileText, LayoutDashboard, Settings, ShieldCheck, Users } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { Badge, NavList, Stack, Text, type NavListItem } from '@dev-community/ui';

const adminItems: NavListItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: <LayoutDashboard /> },
  { id: 'users', label: 'Utenti', href: '#users', icon: <Users />, badge: <Badge tone="brand">12</Badge> },
  { id: 'reports', label: 'Report', href: '#reports', icon: <BarChart3 /> },
  {
    id: 'settings',
    label: 'Impostazioni',
    icon: <Settings />,
    items: [
      { id: 'general', label: 'Generali', href: '#general' },
      { id: 'billing', label: 'Fatturazione', href: '#billing' },
      { id: 'security', label: 'Sicurezza', href: '#security' },
    ],
  },
  { id: 'audit', label: 'Audit log', href: '#audit', icon: <ShieldCheck />, isDisabled: true },
];

export function Vertical() {
  return (
    <div style={{ maxInlineSize: '18rem' }}>
      <NavList
        label="Amministrazione"
        currentId="users"
        items={[
          { id: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: <LayoutDashboard /> },
          { id: 'users', label: 'Utenti', href: '#users', icon: <Users />, badge: <Badge tone="brand">12</Badge> },
          { id: 'docs', label: 'Documenti', href: '#docs', icon: <FileText /> },
          { id: 'payments', label: 'Pagamenti', href: '#payments', icon: <CreditCard /> },
        ]}
      />
    </div>
  );
}

export function WithGroups() {
  return (
    <div style={{ maxInlineSize: '18rem' }}>
      <NavList label="Amministrazione" items={adminItems} currentId="billing" />
    </div>
  );
}

export function CollapsibleRail() {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('dashboard');
  const handleNavigate = (id: string, event: MouseEvent<Element>) => {
    event.preventDefault();
    setCurrent(id);
  };
  return (
    <Stack gap={3}>
      <div style={{ inlineSize: collapsed ? 'auto' : '18rem' }}>
        <NavList
          label="Amministrazione"
          items={adminItems}
          currentId={current}
          collapsible
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onNavigate={handleNavigate}
          variant="pill"
        />
      </div>
      <Text variant="body-sm" tone="secondary">
        Pagina corrente: {current} · {collapsed ? 'rail compressa' : 'espansa'}
      </Text>
    </Stack>
  );
}

export function Horizontal() {
  return (
    <NavList
      label="Sezioni del progetto"
      orientation="horizontal"
      variant="underline"
      currentId="overview"
      items={[
        { id: 'overview', label: 'Panoramica', href: '#overview' },
        { id: 'activity', label: 'Attività', href: '#activity' },
        { id: 'members', label: 'Membri', href: '#members', badge: <Badge>8</Badge> },
        { id: 'files', label: 'File', href: '#files' },
        { id: 'integrations', label: 'Integrazioni', href: '#integrations' },
        { id: 'settings', label: 'Impostazioni', href: '#settings' },
      ]}
    />
  );
}

export function Variants() {
  return (
    <Stack gap={6}>
      {(['subtle', 'pill', 'underline'] as const).map((variant) => (
        <div key={variant} style={{ maxInlineSize: '18rem' }}>
          <Text variant="body-sm" tone="secondary">
            {variant}
          </Text>
          <NavList label={`Variante ${variant}`} variant={variant} items={adminItems} currentId="reports" />
        </div>
      ))}
    </Stack>
  );
}
