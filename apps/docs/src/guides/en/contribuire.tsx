import { Code, DocSection, RefTable } from '../../components/Doc';

export default function Contribuire() {
  return (
    <>
      <DocSection title="Repository structure">
        <RefTable
          label="Folders"
          columns={['Path', 'Contents']}
          rows={[
            [<code key="1">packages/ui/tokens</code>, 'Single source of truth for tokens (DTCG + color configuration)'],
            [<code key="2">packages/ui/src/components</code>, 'Primitives and composite components: Component.tsx, .module.css, .meta.ts, .examples.tsx, .stories.tsx, .test.tsx'],
            [<code key="3">packages/ui/src/patterns</code>, 'Reusable patterns (UserMenu, SiteHeader, Footer, sign-in forms)'],
            [<code key="4">packages/ui/src/theme</code>, 'createTheme, ThemeProvider, persistence, exports'],
            [<code key="5">packages/ui/src/i18n</code>, 'LocaleProvider and message bundles'],
            [<code key="6">apps/docs</code>, 'Documentation site, Theme Builder and showcase (demo templates)'],
            [<code key="7">apps/playground</code>, 'Separate consumer that installs the built package'],
            [<code key="8">design/figma</code>, 'DTCG tokens and Figma specs (generated and hand-written)'],
            [<code key="9">e2e</code>, 'Playwright tests against the built site'],
          ]}
        />
        <p>
          Examples (<code>*.examples.tsx</code>) and metadata (<code>*.meta.ts</code>) are the single source for the site pages and for the Storybook
          stories: do not duplicate examples in stories.
        </p>
      </DocSection>

      <DocSection title="Commands">
        <Code language="bash">{`
npm install
npm run dev            # documentation site (http://localhost:5173)
npm run storybook      # Storybook (http://localhost:6006)
npm run tokens         # regenerate token outputs
npm run lint           # ESLint, Stylelint, token references
npm run typecheck
npm test               # Vitest + Testing Library + axe
npm run build          # library and site
npm run verify:package # npm pack + install in a separate consumer (copy of apps/playground)
npm run size           # gzip bundle budget with size-limit (requires the build)
npm run test:e2e       # Playwright (against the built site: run npm run build first)
npm run verify         # all of the above
`}</Code>
        <p>
          The first time, install the test browser with <code>npx playwright install chromium</code>. The e2e tests start{' '}
          <code>vite preview</code> on port 4173 on their own and fail on any console error or warning. <code>verify:package</code> creates the
          package with <code>npm pack</code>, installs it in a temporary consumer outside the repository and checks its types, build and behavior
          in Chromium.
        </p>
      </DocSection>

      <DocSection title="Publishing the documentation to GitHub Pages">
        <p>
          The <code>.github/workflows/pages.yml</code> workflow builds the site with the base path provided by <code>actions/configure-pages</code>,
          runs the e2e tests against the output and publishes it, together with Storybook under <code>/storybook/</code>. The workflow runs on every push to{' '}
          <code>main</code> or manually. To enable it, choose <strong>Settings → Pages → Source: GitHub Actions</strong>.
        </p>
        <Code language="bash">{`
npm run build:pages -- --base /design-system/
npm run preview:pages -- --base /design-system/   # http://localhost:4174/design-system/
npm run test:e2e:pages                            # default base: /design-system/
`}</Code>
        <p>
          <code>build:pages</code> generates an <code>index.html</code> for every known route, so deep links work without server-side
          rewrites. Guide, component and showcase pages are derived from their respective lists. Top-level routes, however, are
          listed in <code>scripts/build-pages.mjs</code>: if you add a top-level route, add it there too. A missing route is
          still rendered through <code>404.html</code>, but with HTTP status 404.
        </p>
      </DocSection>

      <DocSection title="Testing conventions">
        <ul>
          <li>
            React Aria restores focus in the frame after an overlay closes: assert it with <code>waitFor</code> (unit) or{' '}
            <code>expect.poll</code> (browser), not immediately after closing.
          </li>
          <li>Keyboard focus is obtained with Tab: <code>element.focus()</code> does not trigger focus-visible states or tooltips.</li>
          <li>Do not add axe exclusions without justifying them in <code>e2e/fixtures.ts</code> and in the Accessibility guide.</li>
        </ul>
      </DocSection>

      <DocSection title="New component checklist">
        <ul>
          <li>Is there already a component or composition that covers the use case? Avoid duplicate variants.</li>
          <li>Native HTML or React Aria for behavior; no generic clickable elements.</li>
          <li>
            Consistent props (<code>variant</code>, <code>size</code>, <code>tone</code>, <code>isDisabled</code>, <code>isInvalid</code>,{' '}
            <code>value</code>/<code>defaultValue</code>/<code>onChange</code>), forwarded ref, <code>className</code> and native attributes preserved.
          </li>
          <li>Only semantic tokens in the CSS Module; logical properties; hover, focus-visible, pressed and disabled states; forced-colors and reduced-motion.</li>
          <li>System text comes from messages (<code>useMessages</code>), never hard-coded strings.</li>
          <li>Tests: rendering, keyboard, controlled/uncontrolled, axe; examples and meta with real state in the catalog matrix.</li>
          <li>No <code>any</code> or casts to hide type errors.</li>
        </ul>
      </DocSection>

      <DocSection title="Documentation translations">
        <p>
          The portal is available in Italian (the reference language) and English. Interface strings live in{' '}
          <code>apps/docs/src/i18n/messages.ts</code>; guides and foundations have an English version in <code>guides/en</code> and{' '}
          <code>foundations/en</code>; component metadata is translated in the JSON overlays under <code>i18n/en/components</code>.
        </p>
        <ul>
          <li>
            After adding or changing a <code>*.meta.ts</code>, run <code>npm run i18n:extract -w @dev-community/docs</code> and translate the new
            fields.
          </li>
          <li>
            <code>npm run i18n:check -w @dev-community/docs</code> reports missing or stale overlays. Until a translation exists the page shows
            the Italian text with a notice.
          </li>
          <li>Live examples and templates keep their demo content in Italian.</li>
        </ul>
      </DocSection>

      <DocSection title="License">
        <p>
          The project is released under the <strong>MIT</strong> license (© 2026 Dev Community): the <code>LICENSE</code> file is in the
          repository root and ships with the <code>@dev-community/ui</code> and <code>@dev-community/ui-mcp</code> packages. By contributing you
          agree that your code is released under the same license. Do not add dependencies with incompatible licenses (for example GPL) without
          discussing it first.
        </p>
      </DocSection>

      <DocSection title="Versioning changes">
        <p>
          Add an entry to <code>CHANGELOG.md</code> stating whether the change is a patch, minor or major according to the policy described in Changelog and
          migrations.
        </p>
      </DocSection>
    </>
  );
}
