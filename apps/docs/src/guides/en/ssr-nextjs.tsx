import { Alert } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

export default function SsrNextjs() {
  return (
    <>
      <DocSection title="Library guarantees">
        <ul>
          <li>No access to window, document, or localStorage when modules are imported.</li>
          <li>
            The <code>@devcommunityit/ui/theme</code> entry point contains neither React nor DOM code: use it in Server Components, build scripts, and
            Node.
          </li>
          <li>
            Component modules are marked <code>&apos;use client&apos;</code> in the compiled package: they can be imported from a Server Component
            and automatically become the client boundary.
          </li>
          <li>
            Persisted preferences are read after mount (never during render), so the server markup always matches the first client render: no
            hydration mismatches.
          </li>
          <li>
            With <code>mode=&quot;system&quot;</code>, the dark scheme is applied by a CSS media query: no flash for users relying on the system
            preference, even without JavaScript.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Avoiding the theme flash: cookies (recommended)">
        <p>
          If the user explicitly picks light/dark, palette, density, or look, the server needs to know about it to render the correct markup. Store the
          preferences in a cookie and pass them to the provider as initial values.
        </p>
        <Code title="app/providers.tsx">{`
'use client';
import type { ReactNode } from 'react';
import { ThemeProvider, LocaleProvider, createCookieStorageAdapter, isPresetName, type ThemePreferences } from '@devcommunityit/ui';

const storage = createCookieStorageAdapter({ sameSite: 'Lax', secure: true });

export function Providers({ initial, children }: { initial: ThemePreferences; children: ReactNode }) {
  return (
    <LocaleProvider locale="it-IT">
      <ThemeProvider
        defaultMode={initial.mode ?? 'system'}
        defaultTheme={initial.theme && isPresetName(initial.theme) ? initial.theme : 'aurora'}
        defaultDensity={initial.density ?? 'comfortable'}
        defaultLook={initial.look ?? 'standard'}
        persistence={{ storage, keys: ['mode', 'theme', 'density', 'look'] }}
        surface
      >
        {children}
      </ThemeProvider>
    </LocaleProvider>
  );
}
`}</Code>
        <Code title="app/layout.tsx (Server Component)">{`
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { getThemePreferencesFromCookie } from '@devcommunityit/ui/theme';
import '@devcommunityit/ui/styles.css';
import { Providers } from './providers';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const prefs = getThemePreferencesFromCookie((await headers()).get('cookie'));
  return (
    <html lang="it">
      <body>
        <Providers initial={prefs}>{children}</Providers>
      </body>
    </html>
  );
}
`}</Code>
        <p>
          <code>getThemePreferencesFromCookie</code> validates the content and never throws: a tampered cookie simply yields the default
          preferences. In Next.js versions where <code>headers()</code> is synchronous, remove <code>await</code>.
        </p>
      </DocSection>

      <DocSection title="Static sites and SPAs">
        <p>
          In a client-only SPA, the provider restores preferences before the first paint (layout effect): nothing else is needed. For pre-rendered
          pages without a server (SSG), use <code>getThemeScript()</code>, an inline script that sets the{' '}
          <code>data-dc-*</code> attributes on <code>&lt;html&gt;</code> by reading localStorage before paint. Combine it with <code>applyToDocument</code> to
          color the page background and <code>color-scheme</code> right away.
        </p>
        <Code>{`
import { getThemeScript } from '@devcommunityit/ui/theme';

// in the HTML template / _document, with a per-request nonce or a static hash
<script nonce={nonce} dangerouslySetInnerHTML={{ __html: getThemeScript({ storageKey: 'dc-theme' }) }} />
`}</Code>
        <Alert tone="warning" title="Known limitation">
          The script acts on <code>&lt;html&gt;</code>; content inside the provider uses the values from the pre-rendered markup until React
          finishes hydration. With explicit preferences that differ from the defaults, SSG pages may therefore show a brief color change: to
          eliminate it, use server-side rendering with cookies.
        </Alert>
      </DocSection>

      <DocSection title="Content Security Policy">
        <RefTable
          label="CSP requirements"
          columns={['Directive', 'Requirement', 'Notes']}
          rows={[
            [<code key="1">script-src</code>, 'No unsafe-inline / unsafe-eval', 'getThemeScript, if used, requires a nonce or hash'],
            [<code key="2">style-src-elem</code>, 'Only the package stylesheets', 'No <style> injected at runtime; no dependency on external fonts or CDNs'],
            [
              <code key="3">style-src-attr</code>,
              <span key="3b">
                <code>&apos;unsafe-inline&apos;</code> with SSR only
              </span>,
              'Some components (Grid, Progress, Skeleton, AspectRatio, inline custom themes) use the style attribute. In client rendering, styles are applied via the CSSOM and require no exceptions.',
            ],
          ]}
        />
        <p>
          For custom themes under a strict CSP, generate the CSS at build time with <code>themeToCss()</code>, serve it as a static file, and use{' '}
          <code>themeStrategy=&quot;stylesheet&quot;</code>: color variables no longer go through style attributes.
        </p>
      </DocSection>

      <DocSection title="Next.js checklist (App Router)">
        <ul>
          <li>Import <code>@devcommunityit/ui/styles.css</code> only once, in the root layout.</li>
          <li>Keep the providers in a <code>&apos;use client&apos;</code> file and pass them serializable data (not functions) from Server Components.</li>
          <li>To wire links to the router, use <code>RouterProvider</code> with <code>useRouter().push</code> in the client providers component.</li>
          <li>Don’t read <code>useTheme().resolvedScheme</code> to decide the markup of the first render: during SSR it is always light.</li>
        </ul>
      </DocSection>
    </>
  );
}
