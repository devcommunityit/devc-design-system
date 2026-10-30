import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BookOpen, Boxes, Compass, LayoutTemplate, Palette, Search } from 'lucide-react';
import { AppShell, Button, CommandPalette, Footer, Header, Kbd, Link, Sidebar, type CommandPaletteItem, type SidebarSection } from '@dev-community/ui';
import { componentsByCategory, components } from '../content/components';
import { GUIDES } from '../content/guides';
import { SHOWCASE } from '../content/showcase';
import { HAS_STORYBOOK, STORYBOOK_PATH } from '../base';
import { PreferencesMenu } from './PreferencesMenu';

function buildSections(pathname: string): SidebarSection[] {
  const guide = (group: string) =>
    GUIDES.filter((g) => g.group === group).map((g) => ({ id: `/guide/${g.slug}`, label: g.title, href: `/guide/${g.slug}` }));
  return [
    {
      id: 'start',
      title: 'Per iniziare',
      items: [{ id: '/', label: 'Introduzione', href: '/', icon: <Compass /> }, ...guide('start')],
    },
    {
      id: 'foundations',
      title: 'Fondamenta',
      items: [...guide('foundations'), { id: '/theme-builder', label: 'Theme Builder', href: '/theme-builder', icon: <Palette /> }],
    },
    {
      id: 'components',
      title: 'Componenti',
      items: [{ id: '/componenti', label: 'Catalogo e matrice', href: '/componenti', icon: <Boxes /> }],
    },
    ...componentsByCategory().map((group) => ({
      id: `cat-${group.category}`,
      title: group.label,
      collapsible: true,
      defaultExpanded: group.items.some((c) => pathname === `/componenti/${c.doc.slug}`),
      items: group.items.map((c) => ({ id: `/componenti/${c.doc.slug}`, label: c.doc.name, href: `/componenti/${c.doc.slug}` })),
    })),
    {
      id: 'patterns',
      title: 'Pattern e template',
      items: [{ id: '/pattern', label: 'Panoramica', href: '/pattern', icon: <LayoutTemplate /> }],
    },
    { id: 'guides', title: 'Guide', items: guide('guides').map((i) => ({ ...i, icon: undefined })) },
  ];
}

function buildCommands(): CommandPaletteItem[] {
  return [
    { id: '/', label: 'Introduzione', section: 'Pagine' },
    { id: '/componenti', label: 'Catalogo componenti', section: 'Pagine', keywords: ['matrice', 'catalog'] },
    { id: '/theme-builder', label: 'Theme Builder', section: 'Pagine', keywords: ['tema', 'colori', 'palette'] },
    { id: '/pattern', label: 'Pattern e template', section: 'Pagine', keywords: ['showcase'] },
    ...GUIDES.map((g) => ({ id: `/guide/${g.slug}`, label: g.title, description: g.description, section: 'Guide' })),
    ...components.map((c) => ({
      id: `/componenti/${c.doc.slug}`,
      label: c.doc.name,
      description: c.doc.summary,
      section: 'Componenti',
      keywords: [...c.doc.exports, c.doc.category],
    })),
    ...SHOWCASE.map((s) => ({ id: `/showcase/${s.slug}`, label: s.title, description: s.description, section: 'Showcase' })),
  ];
}

export function DocsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  // Expand the category of the page loaded first; later toggles are left to the user.
  const [initialPath] = useState(location.pathname);
  const sections = useMemo(() => buildSections(initialPath), [initialPath]);
  const commands = useMemo(() => buildCommands(), []);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <AppShell
      sidebarTitle="Documentazione"
      header={
        <Header
          brand={
            <Link href="/" variant="standalone" className="docs-brand" aria-label="Dev Community UI, home">
              <span className="docs-logo" aria-hidden="true" />
              <span>Dev Community UI</span>
            </Link>
          }
          actions={
            <>
              <Button variant="secondary" size="sm" startIcon={<Search />} onPress={() => setSearchOpen(true)} className="docs-search">
                <span className="docs-search-label">Cerca</span>
                <Kbd className="docs-search-kbd">Ctrl K</Kbd>
              </Button>
              <PreferencesMenu />
            </>
          }
        />
      }
      sidebar={<Sidebar aria-label="Documentazione" sections={sections} currentId={location.pathname} />}
      footer={
        <Footer
          columns={[
            {
              title: 'Documentazione',
              links: [
                { label: 'Quick start', href: '/guide/quick-start' },
                { label: 'Componenti', href: '/componenti' },
                { label: 'Theme Builder', href: '/theme-builder' },
              ],
            },
            {
              title: 'Risorse',
              links: [
                { label: 'Pattern', href: '/pattern' },
                { label: 'Figma e token', href: '/guide/figma' },
                { label: 'Changelog', href: '/guide/changelog' },
                ...(HAS_STORYBOOK ? [{ label: 'Storybook', href: STORYBOOK_PATH }] : []),
              ],
            },
          ]}
          brand={
            <span className="docs-footer-brand">
              <BookOpen aria-hidden="true" size={16} /> Dev Community UI
            </span>
          }
          legal="Versione 0.1.0 · Licenza da definire prima della pubblicazione"
        />
      }
    >
      <div className="docs-main" key={location.pathname}>
        <Outlet />
      </div>
      <CommandPalette
        aria-label="Cerca nella documentazione"
        placeholder="Cerca componenti, guide, template…"
        commands={commands}
        isOpen={searchOpen}
        onOpenChange={setSearchOpen}
        hotkey
        onAction={(id) => void navigate(id)}
      />
    </AppShell>
  );
}