import { Alert } from '@devcommunityit/ui';
import { DocSection, RefTable } from '../../components/Doc';

export default function Changelog() {
  return (
    <>
      <DocSection title="0.1.0 — first version (unpublished)">
        <ul>
          <li>DTCG tokens as the single source; generated CSS, TypeScript, DTCG and Tokens Studio outputs.</li>
          <li>Themes: light/dark/system modes, 26 presets (9 original, 8 single-hue and 9 two-color gradient), comfortable/compact density, createTheme, JSON schema v1.</li>
          <li>
            Expressive style inspired by Material 3 (ThemeProvider look prop), tertiary palette with accent.* roles, two-color gradients,
            Heading gradient and Card variant="accent".
          </li>
          <li>ThemeProvider with nested providers, themed portals, optional persistence and a strategy for strict CSPs.</li>
          <li>Complete catalog of layout, typography, actions, navigation, forms, data, feedback and overlays.</li>
          <li>AI components: PromptComposer, ChatMessage, PromptSuggestions, SourceList and ResponseFeedback. Site management: PublishStatus, BulkActionBar and SeoPreview. Labels in seven languages and clearly labeled local examples; no built-in AI backend, publishing or SEO automation.</li>
          <li>
            Documentation: Theme Designer page with a matrix of variants and states and a theme panel (accent, grays, appearance, radius, style,
            density). Preview scaling and translucent panels are CSS recipes of the page, not library tokens.
          </li>
          <li>Tabs: the line variant indicator stays inside the scroll area and avoids a spurious vertical scrollbar.</li>
          <li>
            Dependency-free SVG charts (Sparkline, LineChart, BarChart, DonutChart, ChartLegend) with data table, keyboard navigation and
            categorical color roles data.1–data.6; dashboard components (HeroCard, PromoBanner, KpiCard, QuickAction) and NavList.
          </li>
          <li>Patterns: SiteHeader with mobile menu, Footer, UserMenu, AuthLayout, LoginForm, SignUpForm, PasswordResetForm.</li>
          <li>
            Additional components: Toolbar, SplitButton, CopyButton (with useCopyToClipboard), Meter, PinInput, Rating, TreeView, SortableList,
            RelativeTime and the NotificationCenter pattern.
          </li>
          <li>
            LocaleProvider with messages in Italian, English, Spanish, French, German, Portuguese (Brazil) and Arabic (the last five pending
            native-speaker review), plurals with Intl.PluralRules, translatable theme errors with formatThemeIssue and RTL support, including in
            portaled overlays.
          </li>
          <li>Button labels and header actions wrap instead of overflowing their container with enlarged text.</li>
          <li>
            Distribution: .d.ts declarations resolvable with moduleResolution node16/nodenext too, publint and arethetypeswrong checks
            (npm run lint:package), npm run release:pack script (tarball + SHA-256) and public publishing blocked until a license is chosen.
          </li>
          <li>
            Live documentation: static build for GitHub Pages with configurable base path, deep links, 404 page, Storybook under /storybook/ and
            a GitHub Actions workflow that publishes only after the e2e tests pass.
          </li>
          <li>
            Documentation site: «On this page» table of contents and previous/next navigation in components and guides, category navigation in the
            catalog, search extended to individual examples with deep links, Storybook links for every example, «Charts and dashboards» guide and
            additional examples (controlled, states, long content) on component pages.
          </li>
        </ul>
        <p>
          Full details are in <code>packages/ui/CHANGELOG.md</code>, which ships with the package.
        </p>
      </DocSection>

      <DocSection title="Versioning policy">
        <p>
          The package follows Semantic Versioning. While the version is 0.x, minor releases may contain breaking changes, always documented
          with migration instructions.
        </p>
        <RefTable
          label="Change types"
          columns={['Type', 'Examples']}
          rows={[
            ['Major (breaking)', 'Removing or renaming components, props, tokens or CSS variables; changing default behavior; a new theme schema version without automatic migration; higher React requirements'],
            ['Minor', 'New components, optional props, additional tokens or color roles, new presets'],
            ['Patch', 'Bug, accessibility and style fixes that do not change the API'],
          ]}
        />
        <p>
          Internal CSS classes (<code>dc-component-part</code>) and the DOM structure are not part of the public API. Token values may
          change in a minor release (for example, a palette refinement); their names may not.
        </p>
      </DocSection>

      <DocSection title="Theme schema">
        <p>
          Every exported theme contains <code>schemaVersion</code>. The current version is 1. Future versions will provide automatic migration
          from earlier ones where possible; a file with a newer version than the supported one is rejected with the{' '}
          <code>unsupported_version</code> code instead of being partially parsed.
        </p>
      </DocSection>

      <DocSection title="Before publishing">
        <Alert tone="info" title="License: MIT">
          The project is released under the MIT license (© 2026 Dev Community). The <code>LICENSE</code> file ships with the{' '}
          <code>@devcommunityit/ui</code> and <code>@devcommunityit/ui-mcp</code> packages.
        </Alert>
      </DocSection>
    </>
  );
}
