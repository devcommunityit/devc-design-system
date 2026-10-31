import { Suspense, useMemo, useState, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  BookOpen,
  Boxes,
  Compass,
  Download,
  Layers3,
  LayoutTemplate,
  Palette,
  PanelsTopLeft,
  Plug,
  Rocket,
  Ruler,
  Search,
  SlidersHorizontal,
  SquareDashed,
  Type,
} from 'lucide-react';
import {
  AppShell,
  Button,
  CommandPalette,
  Footer,
  Header,
  Kbd,
  Link,
  SearchInput,
  Sidebar,
  Spinner,
  Toggle,
  ToggleGroup,
  type CommandPaletteItem,
  type SidebarSection,
} from '@dev-community/ui';
import type { ComponentCategory } from '@ui-src/docs-meta/types';
import { CATEGORY_GROUPS, categoryLabel, components, type ComponentEntry } from '../content/components';
import { GUIDES, type GuideGroup } from '../content/guides';
import { FOUNDATIONS, type FoundationSlug } from '../content/foundations';
import { SHOWCASE } from '../content/showcase';
import { HAS_STORYBOOK, STORYBOOK_PATH } from '../base';
import { DOCS_LANGS, isDocsLang, type DocsLang } from '../i18n/lang';
import type { Messages } from '../i18n/messages';
import { useEnglishSummaries } from '../i18n/componentDocs';
import { useI18n } from '../settings';
import { PreferencesMenu } from './PreferencesMenu';
import { useHashScroll } from '../useHashScroll';

const VERSION = '0.1.0';

type Area = 'start' | 'foundations' | 'components' | 'patterns' | 'guides';

const AREAS: Array<{ id: Area; href: string }> = [
  { id: 'start', href: '/' },
  { id: 'foundations', href: '/foundations/typography' },
  { id: 'components', href: '/componenti' },
  { id: 'patterns', href: '/pattern' },
  { id: 'guides', href: '/guide/stati-di-caricamento' },
];

const GUIDE_AREA: Record<GuideGroup, Area> = { start: 'start', foundations: 'foundations', develop: 'guides', design: 'guides', project: 'guides' };

const BY_SLUG = new Map(components.map((c) => [c.doc.slug, c]));

/** Every page belongs to exactly one area: the header tab and the sidebar content follow from the URL. */
function areaOf(pathname: string): Area {
  if (pathname.startsWith('/foundations/') || pathname === '/theme-designer' || pathname === '/theme-builder') return 'foundations';
  if (pathname === '/pattern') return 'patterns';
  const guide = /^\/guide\/([^/]+)/.exec(pathname);
  if (guide) return GUIDE_AREA[GUIDES.find((g) => g.slug === (guide[1] ?? ''))?.group ?? 'develop'];
  const component = /^\/componenti\/([^/]+)/.exec(pathname);
  if (component) return BY_SLUG.get(component[1] ?? '')?.doc.category === 'patterns' ? 'patterns' : 'components';
  if (pathname === '/componenti') return 'components';
  return 'start';
}

const FOUNDATION_ICONS: Record<FoundationSlug, ReactNode> = {
  typography: <Type />,
  spacing: <Ruler />,
  rounded: <SquareDashed />,
  colors: <Palette />,
  shadows: <Layers3 />,
};

const GUIDE_ICONS: Record<string, ReactNode> = { 'quick-start': <Rocket />, installazione: <Download />, integrazione: <Plug /> };

const componentItem = (c: ComponentEntry) => ({ id: `/componenti/${c.doc.slug}`, label: c.doc.name, href: `/componenti/${c.doc.slug}` });

function categorySection(category: ComponentCategory, lang: DocsLang, currentCategory: ComponentCategory | undefined): SidebarSection {
  const items = components.filter((c) => c.doc.category === category);
  return {
    id: `cat-${category}`,
    title: (
      <span className="docs-nav-category">
        {categoryLabel(category, lang)}
        <span className="docs-nav-count" aria-hidden="true">
          {items.length}
        </span>
      </span>
    ),
    collapsible: true,
    defaultExpanded: category === currentCategory,
    items: items.map(componentItem),
  };
}

function buildSections(area: Area, lang: DocsLang, t: Messages, pathname: string, query: string): SidebarSection[] {
  const guides = (group: GuideGroup, withIcons = false) =>
    GUIDES.filter((g) => g.group === group).map((g) => ({
      id: `/guide/${g.slug}`,
      label: g.title[lang],
      href: `/guide/${g.slug}`,
      icon: withIcons ? GUIDE_ICONS[g.slug] : undefined,
    }));

  switch (area) {
    case 'start':
      return [
        {
          id: 'start',
          title: t.nav.gettingStarted,
          items: [{ id: '/', label: t.nav.introduction, href: '/', icon: <Compass /> }, ...guides('start', true)],
        },
        {
          id: 'next',
          title: t.nav.explore,
          items: [
            { id: 'next-components', label: t.areas.components, href: '/componenti', icon: <Boxes /> },
            { id: 'next-foundations', label: t.areas.foundations, href: '/foundations/typography', icon: <Palette /> },
            { id: 'next-patterns', label: t.areas.patterns, href: '/pattern', icon: <LayoutTemplate /> },
          ],
        },
      ];
    case 'foundations':
      return [
        {
          id: 'foundations',
          title: t.nav.foundations,
          items: FOUNDATIONS.map((f) => ({
            id: `/foundations/${f.slug}`,
            label: f.title[lang],
            href: `/foundations/${f.slug}`,
            icon: FOUNDATION_ICONS[f.slug],
          })),
        },
        { id: 'design-system', title: t.nav.designSystem, items: guides('foundations') },
        {
          id: 'tools',
          title: t.nav.tools,
          items: [
            { id: '/theme-designer', label: 'Theme Designer', href: '/theme-designer', icon: <SlidersHorizontal /> },
            { id: '/theme-builder', label: 'Theme Builder', href: '/theme-builder', icon: <Palette /> },
          ],
        },
      ];
    case 'components': {
      const catalog: SidebarSection = {
        id: 'catalog',
        items: [{ id: '/componenti', label: t.nav.catalog, href: '/componenti', icon: <Boxes /> }],
      };
      const q = query.trim().toLowerCase();
      if (q) {
        const matches = components.filter(
          (c) => c.doc.category !== 'patterns' && [c.doc.name, ...c.doc.exports, categoryLabel(c.doc.category, lang)].some((s) => s.toLowerCase().includes(q)),
        );
        return [{ id: 'matches', title: t.nav.matches(matches.length), items: matches.map(componentItem) }];
      }
      const current = BY_SLUG.get(pathname.replace('/componenti/', ''))?.doc.category;
      return [
        catalog,
        ...CATEGORY_GROUPS.flatMap((group) => [
          { id: `group-${group.id}`, title: t.nav.groups[group.id], items: [] },
          ...group.categories.map((category) => categorySection(category, lang, current)),
        ]),
      ];
    }
    case 'patterns':
      return [
        { id: 'patterns', items: [{ id: '/pattern', label: t.nav.overview, href: '/pattern', icon: <LayoutTemplate /> }] },
        { id: 'page-patterns', title: t.nav.pagePatterns, items: components.filter((c) => c.doc.category === 'patterns').map(componentItem) },
        {
          id: 'templates',
          title: t.nav.templates,
          items: SHOWCASE.map((s) => ({ id: `/showcase/${s.slug}`, label: s.title[lang], href: `/showcase/${s.slug}`, icon: <PanelsTopLeft /> })),
        },
      ];
    case 'guides':
      return [
        { id: 'develop', title: t.nav.develop, items: guides('develop') },
        { id: 'design', title: t.nav.design, items: guides('design') },
        { id: 'project', title: t.nav.project, items: guides('project') },
      ];
  }
}

function buildCommands(lang: DocsLang, t: Messages, summaries: ReturnType<typeof useEnglishSummaries>): CommandPaletteItem[] {
  const s = t.search;
  return [
    { id: '/', label: t.nav.introduction, section: s.pages },
    { id: '/componenti', label: s.catalog, section: s.pages, keywords: ['matrice', 'catalog', 'matrix'] },
    { id: '/theme-designer', label: 'Theme Designer', section: s.pages, keywords: ['tema', 'theme', 'accento', 'accent', 'raggio', 'radius'] },
    { id: '/theme-builder', label: 'Theme Builder', section: s.pages, keywords: ['tema', 'theme', 'colori', 'colors', 'palette'] },
    { id: '/pattern', label: s.patterns, section: s.pages, keywords: ['showcase', 'template'] },
    ...GUIDES.map((g) => ({ id: `/guide/${g.slug}`, label: g.title[lang], description: g.description[lang], section: s.guides, keywords: [g.title.it, g.title.en] })),
    ...FOUNDATIONS.map((f) => ({
      id: `/foundations/${f.slug}`,
      label: f.title[lang],
      description: f.description[lang],
      section: s.foundations,
      keywords: [f.title.it, f.title.en],
    })),
    ...components.map((c) => ({
      id: `/componenti/${c.doc.slug}`,
      label: c.doc.name,
      description: summaries?.SUMMARIES[c.doc.slug] ?? c.doc.summary,
      section: s.components,
      keywords: [...c.doc.exports, c.doc.category, categoryLabel(c.doc.category, lang)],
    })),
    ...SHOWCASE.map((x) => ({ id: `/showcase/${x.slug}`, label: x.title[lang], description: x.description[lang], section: s.showcase })),
    ...components.flatMap((c) =>
      c.doc.examples.map((ex) => {
        const translated = summaries?.EXAMPLE_TITLES[c.doc.slug]?.[ex.name];
        return {
          id: `/componenti/${c.doc.slug}#esempio-${ex.name.toLowerCase()}`,
          label: `${c.doc.name} › ${translated?.title ?? ex.title}`,
          description: translated?.description ?? ex.description,
          section: s.examples,
          keywords: [c.doc.name, ...c.doc.exports],
        };
      }),
    ),
  ];
}

function LanguageSwitch({ className }: { className: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <ToggleGroup
      aria-label={t.language.label}
      className={`docs-lang ${className}`}
      selectedKeys={[lang]}
      disallowEmptySelection
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (typeof next === 'string' && isDocsLang(next)) setLang(next);
      }}
    >
      {DOCS_LANGS.map((l) => (
        <Toggle key={l.id} id={l.id} aria-label={l.label}>
          <span aria-hidden="true">{l.short}</span>
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

function AreaLinks({ area, t, className }: { area: Area; t: Messages; className: string }) {
  return (
    <ul className={className}>
      {AREAS.map((a) => (
        <li key={a.id}>
          <Link href={a.href} variant="standalone" className="docs-area-link" aria-current={a.id === area ? 'page' : undefined}>
            {t.areas[a.id]}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DocsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const area = areaOf(location.pathname);
  const summaries = useEnglishSummaries(lang);
  const sections = useMemo(() => buildSections(area, lang, t, location.pathname, query), [area, lang, t, location.pathname, query]);
  const commands = useMemo(() => buildCommands(lang, t, summaries), [lang, t, summaries]);
  const currentCategory = BY_SLUG.get(location.pathname.replace('/componenti/', ''))?.doc.category ?? 'none';
  useHashScroll();

  return (
    <AppShell
      sidebarTitle={t.site.docs}
      header={
        <Header
          brand={
            <Link href="/" variant="standalone" className="docs-brand" aria-label={t.site.home}>
              <span className="docs-logo" aria-hidden="true" />
              <span>Dev Community UI</span>
            </Link>
          }
          navigation={
            <nav aria-label={t.areas.label}>
              <AreaLinks area={area} t={t} className="docs-areas" />
            </nav>
          }
          actions={
            <>
              <Button variant="secondary" size="sm" startIcon={<Search />} onPress={() => setSearchOpen(true)} className="docs-search">
                <span className="docs-search-label">{t.search.button}</span>
                <Kbd className="docs-search-kbd">Ctrl K</Kbd>
              </Button>
              <LanguageSwitch className="docs-lang-header" />
              <PreferencesMenu />
            </>
          }
        />
      }
      sidebar={
        <div className="docs-sidebar">
          <nav aria-label={t.areas.label} className="docs-area-switch">
            <AreaLinks area={area} t={t} className="docs-area-switch-list" />
          </nav>
          {/* Below 640px the header has no room for the language switch: it moves into the drawer. */}
          <div className="docs-lang-drawer">
            <span aria-hidden="true">{t.language.label}</span>
            <LanguageSwitch className="" />
          </div>
          {area === 'components' ? (
            <SearchInput
              aria-label={t.nav.filterComponents}
              placeholder={t.nav.filterComponents}
              value={query}
              onChange={setQuery}
              className="docs-sidebar-filter"
            />
          ) : null}
          <Sidebar
            key={`${area}-${lang}-${currentCategory}`}
            aria-label={t.nav.sidebar}
            sections={sections}
            currentId={location.pathname}
            onNavigate={() => setQuery('')}
          />
          {area === 'components' && query.trim() && sections[0]?.items.length === 0 ? (
            <p className="docs-sidebar-empty" role="status">
              {t.nav.noMatches(query.trim())}
            </p>
          ) : null}
        </div>
      }
      footer={
        <Footer
          columns={[
            {
              title: t.footer.docs,
              links: [
                { label: 'Quick start', href: '/guide/quick-start' },
                { label: t.areas.components, href: '/componenti' },
                { label: t.areas.patterns, href: '/pattern' },
                { label: 'Theme Builder', href: '/theme-builder' },
              ],
            },
            {
              title: t.footer.resources,
              links: [
                { label: lang === 'en' ? 'Figma and tokens' : 'Figma e token', href: '/guide/figma' },
                { label: 'Changelog', href: '/guide/changelog' },
                ...(HAS_STORYBOOK ? [{ label: 'Storybook', href: STORYBOOK_PATH }] : []),
              ],
            },
            {
              title: t.footer.project,
              links: [
                { label: t.footer.contributing, href: '/guide/contribuire' },
                { label: t.footer.license, href: `/guide/contribuire#${t.footer.licenseAnchor}` },
              ],
            },
          ]}
          brand={
            <span className="docs-footer-brand">
              <BookOpen aria-hidden="true" size={16} /> Dev Community UI
              <span className="docs-footer-tagline">{t.site.tagline}</span>
            </span>
          }
          legal={t.footer.legal(VERSION)}
        />
      }
    >
      <div className="docs-main" key={location.pathname}>
        <Suspense
          fallback={
            <div className="docs-loading">
              <Spinner label={t.site.loading} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      <CommandPalette
        aria-label={t.search.label}
        placeholder={t.search.placeholder}
        commands={commands}
        isOpen={searchOpen}
        onOpenChange={setSearchOpen}
        hotkey
        onAction={(id) => void navigate(id)}
      />
    </AppShell>
  );
}
