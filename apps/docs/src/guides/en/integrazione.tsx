import { Alert, Link } from '@devcommunityit/ui';
import { Code, DocSection } from '../../components/Doc';

export default function Integrazione() {
  return (
    <>
      <DocSection title="Principles">
        <ul>
          <li>The library does not depend on a router, a backend, or the documentation site.</li>
          <li>
            No global reset: styles only target elements with <code>dc-…</code> classes, and <code>--dc-…</code> variables are defined under{' '}
            <code>[data-dc-theme]</code>, that is, inside a <code>ThemeProvider</code>.
          </li>
          <li>
            The provider doesn't modify <code>&lt;html&gt;</code>, <code>lang</code>, or <code>dir</code> unless you ask it to (<code>applyToDocument</code>),
            and doesn't use storage unless you enable <code>persistence</code>.
          </li>
          <li>No access to <code>window</code>, <code>document</code>, or <code>localStorage</code> at module import time.</li>
        </ul>
      </DocSection>

      <DocSection title="Vite">
        <p>No configuration needed: Vite handles ESM and CSS imports. Import the styles in your entry point.</p>
        <Code>{`
// src/main.tsx
import '@devcommunityit/ui/styles.css';
import './app.css'; // app styles after the library's
`}</Code>
      </DocSection>

      <DocSection title="Connecting your router">
        <p>
          Link, LinkButton, Menu items, Breadcrumb, Sidebar, SiteHeader, and Footer use react-aria navigation. Without configuration they perform
          native browser navigation. For a SPA, connect your router once with <code>RouterProvider</code> (re-exported by the
          library):
        </p>
        <Code title="React Router">{`
import { useHref, useNavigate } from 'react-router';
import { RouterProvider } from '@devcommunityit/ui';

// React Router's useHref treats every value as a path: external URLs must be left untouched,
// otherwise "https://…" becomes "/current-page/https:/…".
function useRouterHref(href: string) {
  const isExternal = /^[a-z][a-z\\d+.-]*:/i.test(href) || href.startsWith('//');
  const resolved = useHref(isExternal ? '.' : href);
  return isExternal ? href : resolved;
}

export function UiRouter({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={(to) => void navigate(to)} useHref={useRouterHref}>
      {children}
    </RouterProvider>
  );
}
`}</Code>
        <Code title="Next.js App Router (client component)">{`
'use client';
import { useRouter } from 'next/navigation';
import { RouterProvider } from '@devcommunityit/ui';

export function UiRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <RouterProvider navigate={(to) => router.push(to)}>{children}</RouterProvider>;
}
`}</Code>
        <Alert tone="info" title="Fragment links">
          With some routers, <code>#section</code> hrefs go through the <code>navigate</code> function. If your router doesn't handle scrolling to
          fragments, intercept them and set <code>window.location.hash</code>, as this site does.
        </Alert>
      </DocSection>

      <DocSection title="Nested providers">
        <p>
          An inner <code>ThemeProvider</code> inherits whatever it doesn't specify from its parent. Use it for an area with a different palette or
          density (a compact admin panel, a theme preview, a partner widget).
        </p>
        <Code>{`
<ThemeProvider defaultTheme="aurora" defaultMode="system" surface>
  <Portal />
  <ThemeProvider theme="graphite" density="compact">
    <AdminPanel /> {/* Dialogs, Menus, Tooltips, and Toasts opened here use graphite + compact */}
  </ThemeProvider>
</ThemeProvider>
`}</Code>
        <p>
          Overlays (Dialog, AlertDialog, Drawer, Popover, Tooltip, Menu, Select, Combobox, DatePicker, Toast) are mounted in a container created by
          the nearest provider, with the same theme attributes: they inherit the palette, mode, density, and direction of their point of origin.
        </p>
      </DocSection>

      <DocSection title="Coexisting with existing CSS">
        <ul>
          <li>Classes and variables are prefixed (<code>dc-</code>, <code>--dc-</code>): no naming conflicts with Bootstrap, Tailwind, or legacy CSS.</li>
          <li>
            If your app has aggressive global rules (for example <code>button {'{'} all: unset {'}'}</code> or <code>* {'{'} line-height: … {'}'}</code>),
            wrap them in a cascade layer: the library's unlayered styles win over layered ones.
          </li>
          <li>Tailwind is neither required nor included; it can coexist without configuration.</li>
          <li>
            A microfrontend's content can have its own <code>ThemeProvider</code>: tokens are defined per subtree, not on{' '}
            <code>:root</code>.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Strings and language">
        <p>
          System strings (close, load more, no results…) come from <code>LocaleProvider</code>, with bundled Italian, English, Spanish, French,
          German, Portuguese (Brazil), and Arabic packs, plus partial overrides. See{' '}
          <Link href="/guide/localizzazione-rtl">Localization and RTL</Link>.
        </p>
      </DocSection>

      <DocSection title="Ready-made portal patterns">
        <p>
          <Link href="/componenti/site-header">SiteHeader and Footer</Link>, <Link href="/componenti/user-menu">UserMenu</Link> (signed-in user
          header), <Link href="/componenti/auth-forms">LoginForm, SignUpForm, PasswordResetForm</Link>, and{' '}
          <Link href="/componenti/app-shell">AppShell</Link> cover recurring structures. They contain no authentication logic: they receive data and
          callbacks from the application.
        </p>
      </DocSection>
    </>
  );
}
