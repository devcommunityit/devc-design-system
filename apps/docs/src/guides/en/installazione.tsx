import { Alert } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

export default function Installazione() {
  return (
    <>
      <Alert tone="warning" title="Package not published">
        The <code>@dev-community/ui</code> package is ready for distribution (tarball, private registry) but has not been published to any registry. It is
        released under the MIT license (the <code>LICENSE</code> file ships with the package).
      </Alert>

      <DocSection title="Requirements">
        <RefTable
          label="Requirements"
          columns={['Requirement', 'Version', 'Notes']}
          rows={[
            ['react, react-dom', '^18.3 || ^19', 'Peer dependency: a single copy, the one from your application.'],
            ['Bundler', 'Any with ESM and CSS import support', 'Verified with Vite 8 (apps/playground) and with the documentation site.'],
            ['TypeScript', '≥ 5.0 (recommended)', 'Includes .d.ts declarations; moduleResolution "bundler", "node16" or "nodenext" (verified with arethetypeswrong).'],
            ['Browser', 'Evergreen', 'Uses :focus-visible, color-mix(), container queries, logical properties, dvh.'],
          ]}
        />
      </DocSection>

      <DocSection title="Distribution channels">
        <RefTable
          label="Distribution channels"
          columns={['Channel', 'Status', 'When to use it']}
          rows={[
            ['Tarball (npm run release:pack or GitHub Release asset)', 'Ready and verified', 'Internal distribution without a registry, integration trials, offline environments.'],
            ['GitHub Packages (Release workflow)', 'Automated, first publish still pending', 'Multiple portals that update the library following semver.'],
            ['Other private registries (Azure Artifacts, Verdaccio, Nexus)', 'Manual publishing', 'When portals cannot use GitHub Packages.'],
            ['Public npmjs.com', 'Allowed (MIT license), first publish still pending', 'After confirming the @dev-community scope is available.'],
            ['Git dependency (github:org/repo)', 'Not supported', 'The package lives in a workspace (packages/ui) and requires a build: npm cannot install it correctly from git.'],
          ]}
        />
      </DocSection>

      <DocSection title="From a tarball (internal distribution)">
        <p>
          The release script builds the library, runs <code>publint</code> and <code>arethetypeswrong</code>, and creates the tarball in <code>releases/</code>{' '}
          (ignored by git) along with its SHA-256 checksum. It does not publish anything.
        </p>
        <Code language="bash">{`
# in the design system repository
npm run release:pack
# → releases/dev-community-ui-0.1.0.tgz + .sha256

# in the consumer project (relative or absolute path)
npm install ../design-system/releases/dev-community-ui-0.1.0.tgz
`}</Code>
        <p>
          npm records a <code>file:</code> dependency in <code>package.json</code>: copy the tarball into a folder of the consumer (for example{' '}
          <code>vendor/</code>) if the CI pipeline has no access to the design system repository.
        </p>
      </DocSection>

      <DocSection title="From a private registry">
        <p>
          The <code>.github/workflows/release.yml</code> workflow publishes <code>@dev-community/ui</code> and <code>@dev-community/ui-mcp</code> to GitHub
          Packages and creates a GitHub Release with the tarball and checksum attached. GitHub Packages only accepts the scope of the repository owner:
          the repository must belong to the <code>dev-community</code> organization or user, otherwise the scope must be renamed. In the consumer project,
          create an <code>.npmrc</code> and provide a token with the <code>read:packages</code> permission (in GitHub Actions,{' '}
          <code>secrets.GITHUB_TOKEN</code> is enough if the package grants access to the portal repository):
        </p>
        <Code language="ini" title=".npmrc — GitHub Packages">{`
@dev-community:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=\${NPM_TOKEN}
`}</Code>
        <Code language="ini" title=".npmrc — Azure Artifacts">{`
@dev-community:registry=https://pkgs.dev.azure.com/<org>/<project>/_packaging/<feed>/npm/registry/
always-auth=true
# authentication: npx vsts-npm-auth -config .npmrc (Windows) or a PAT token in ~/.npmrc
`}</Code>
        <Code language="bash">{`npm install @dev-community/ui`}</Code>
        <p>Provide the token through an environment variable or a pipeline secret; never commit it.</p>
      </DocSection>

      <DocSection title="Releasing a new version">
        <p>
          Both packages already have <code>publishConfig.registry</code> set to GitHub Packages. A release can be started in one of two ways:
        </p>
        <RefTable
          label="Starting a release"
          columns={['Method', 'What it does']}
          rows={[
            ['Actions → Release → Run workflow', 'Choose the package (ui or mcp) and the bump (patch, minor, major or pre*). The workflow updates package.json, package-lock.json and the CHANGELOG (the «Unreleased» section becomes the new version), runs all checks, then creates the commit and tag and pushes them.'],
            [<code key="t">git tag ui-v0.2.0 && git push origin ui-v0.2.0</code>, 'For a version already bumped by hand in package.json. The tag must match the version (ui-v… or mcp-v…).'],
          ]}
        />
        <p>
          The workflow runs lint, typecheck, tests, build and, for the library, <code>verify:package</code>; it then publishes exactly the tarball attached to
          the release. Prerelease versions (<code>0.3.0-beta.0</code>) use the identifier as dist-tag (<code>beta</code>, <code>next</code>) and never
          become <code>latest</code>: install them with <code>npm install @dev-community/ui@next</code>. Every CI workflow run on a pull request also
          uploads the tarballs as artifacts, so you can try a change in a portal before the release.
        </p>
        <Code language="bash">{`
# manual release from the terminal (alternative to the workflow)
npm version patch -w @dev-community/ui   # or minor / major
npm publish -w @dev-community/ui --dry-run   # check contents and registry
npm publish -w @dev-community/ui
`}</Code>
        <p>
          <code>prepublishOnly</code> runs the license/registry check, the build and <code>lint:package</code>: a package with unresolvable types or exports
          is not published. If the <code>main</code> branch is protected, allow GitHub Actions to push the release commit or use a tag-based
          release.
        </p>
      </DocSection>

      <DocSection title="From a public registry">
        <p>
          The <code>license</code> field is set to <code>"MIT"</code> and the <code>LICENSE</code> file is included in the tarball. The{' '}
          <code>packages/ui/scripts/prepublish-check.mjs</code> script blocks <code>npm publish</code> to <code>registry.npmjs.org</code> only if the
          license is missing or <code>UNLICENSED</code>. After publishing, installation is still{' '}
          <code>npm install @dev-community/ui</code>.
        </p>
      </DocSection>

      <DocSection title="Package quality checks">
        <RefTable
          label="Package checks"
          columns={['Command', 'What it checks']}
          rows={[
            [<code key="a">npm run lint:package</code>, 'publint (package.json fields, exports, included files) and arethetypeswrong: types resolvable with moduleResolution bundler and node16/nodenext (ESM).'],
            [<code key="b">npm run verify:package</code>, 'npm pack + installation in a separate consumer outside the repository: exports, types, CSS, rendering, interactions, no duplicate React.'],
            [<code key="s">npm run size</code>, 'size-limit: minified and gzipped size of typical scenarios (ThemeProvider + Button, dashboard, full entry, editor, CSS) compared against the budgets in .size-limit.json; fails in CI if a budget is exceeded.'],
            [<code key="c">npm run release:pack</code>, 'Build + lint:package + tarball with checksum in releases/ (--package mcp for the MCP server).'],
          ]}
        />
      </DocSection>

      <DocSection title="Versioning and updates">
        <p>
          The package follows semver. While the version is <code>0.x</code>, a <em>minor</em> release may contain breaking changes, always described in
          the changelog with migration instructions. In portals, pin a narrow range (<code>"~0.1.0"</code>) until 1.0, then{' '}
          <code>"^1.0.0"</code>. The following are considered breaking: removing or renaming exports, props, CSS tokens (<code>--dc-*</code>), public
          classes, and theme schema changes without a migration.
        </p>
      </DocSection>

      <DocSection title="Module format">
        <p>
          The package is <strong>ESM only</strong> (<code>"type": "module"</code>, no CommonJS build). It is verified with Vite (separate consumer) and
          with Next.js at the documentation level only; webpack 5, Rspack and esbuild support ESM and CSS imports but have not been tested. With Node ≥
          20.19, <code>require()</code> of ESM is also supported, but the components are meant to be used through a bundler. Jest in CommonJS mode
          requires a transform for <code>node_modules/@dev-community</code> and handling of CSS imports: this setup is not verified, so Vitest is
          recommended for consumer tests.
        </p>
      </DocSection>

      <DocSection title="Exported entry points">
        <RefTable
          label="Entry points"
          columns={['Import', 'Contents']}
          rows={[
            [<code key="a">@dev-community/ui</code>, 'Components, patterns, ThemeProvider, LocaleProvider, hooks and utilities (ESM, tree-shakable).'],
            [<code key="b">@dev-community/ui/styles.css</code>, 'Tokens + component styles. Required; import it once.'],
            [<code key="c">@dev-community/ui/reset.css</code>, 'Optional minimal reset in the dc-reset layer.'],
            [<code key="d">@dev-community/ui/tokens.css</code>, 'Token custom properties only (already included in styles.css).'],
            [<code key="e">@dev-community/ui/tokens.json</code>, 'Tokens in DTCG format for design tools.'],
            [<code key="f">@dev-community/ui/theme</code>, 'Theme API without React or the DOM: createTheme, themeToCss, getThemeScript, cookie helpers. For servers and builds.'],
          ]}
        />
      </DocSection>

      <DocSection title="Side effects and tree-shaking">
        <p>
          The package declares <code>"sideEffects": ["**/*.css"]</code>: JavaScript modules are side-effect free and are removed when
          unused; imported CSS files are never dropped. Component styles are bundled in <code>styles.css</code>, so they do not depend on
          which components you import.
        </p>
      </DocSection>

      <DocSection title="Bundled dependencies">
        <p>
          The package depends on <code>react-aria-components</code>/<code>react-aria</code> (interactions and accessibility),{' '}
          <code>@internationalized/date</code> (time-zone-free dates), <code>@material/material-color-utilities</code> (HCT palette generation) and{' '}
          <code>lucide-react</code> (icons, selective imports). No remote fonts or assets.
        </p>
      </DocSection>
    </>
  );
}
