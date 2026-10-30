import { useState, type ReactNode } from 'react';
import { Button, Footer, RouterProvider, SiteHeader, Stack, Text, type SiteHeaderLink } from '@dev-community/ui';

const links: SiteHeaderLink[] = [
  { id: 'product', label: 'Prodotto', href: '/prodotto' },
  { id: 'pricing', label: 'Prezzi', href: '/prezzi' },
  { id: 'customers', label: 'Clienti', href: '/clienti' },
  { id: 'docs', label: 'Documentazione', href: '/documentazione' },
];

/**
 * Public site header. RouterProvider intercepts the links, as a client router would:
 * here navigation only updates the local state shown below (no real page change).
 * Narrow the window below 768px to see the menu drawer.
 */
export function PublicSiteHeader() {
  const [path, setPath] = useState('/prodotto');
  const current = links.find((l) => l.href === path);
  return (
    <RouterProvider navigate={setPath}>
      <Stack gap={3}>
        <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>
          <SiteHeader
            sticky={false}
            brand={<Text as="span" weight="bold">Acme</Text>}
            links={links}
            currentId={current?.id}
            actions={
              <Button size="sm" variant="secondary" onPress={() => setPath('/accedi')}>
                Accedi
              </Button>
            }
          />
        </div>
        <Text tone="secondary" role="status">
          Percorso simulato: <code>{path}</code>
        </Text>
      </Stack>
    </RouterProvider>
  );
}

function RoutedFrame({ path, onNavigate, children }: { path: string; onNavigate: (href: string) => void; children: ReactNode }) {
  return (
    <RouterProvider navigate={onNavigate}>
      <Stack gap={3}>
        <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>{children}</div>
        <Text tone="secondary" role="status">
          Link selezionato (instradato verso lo stato locale): <code>{path || 'nessuno'}</code>
        </Text>
      </Stack>
    </RouterProvider>
  );
}

/** Full footer with link columns, legal links and copyright. Links are routed to local state. */
export function SiteFooter() {
  const [path, setPath] = useState('');
  return (
    <RoutedFrame path={path} onNavigate={setPath}>
      <Footer
        brand={<Text weight="bold">Acme</Text>}
        columns={[
          { title: 'Prodotto', links: [{ label: 'Funzionalità', href: '#funzionalita' }, { label: 'Prezzi', href: '#prezzi' }] },
          { title: 'Azienda', links: [{ label: 'Chi siamo', href: '#chi-siamo' }, { label: 'Lavora con noi', href: '#lavora' }] },
          { title: 'Supporto', links: [{ label: 'Centro assistenza', href: '#assistenza' }, { label: 'Stato del servizio', href: '#stato' }] },
        ]}
        legalLinks={[
          { label: 'Privacy', href: '#privacy' },
          { label: 'Cookie', href: '#cookie' },
          { label: 'Dichiarazione di accessibilità', href: '#accessibilita' },
        ]}
        legal="© 2025 Acme S.p.A. — P. IVA 00000000000"
      />
    </RoutedFrame>
  );
}

/** Single-row footer for portals and back-offices. */
export function CompactFooter() {
  const [path, setPath] = useState('');
  return (
    <RoutedFrame path={path} onNavigate={setPath}>
      <Footer
        variant="compact"
        brand={<Text as="span" weight="bold">Acme Portal</Text>}
        legalLinks={[
          { label: 'Privacy', href: '#privacy' },
          { label: 'Assistenza', href: '#assistenza' },
        ]}
        legal="© 2025 Acme S.p.A."
      />
    </RoutedFrame>
  );
}
