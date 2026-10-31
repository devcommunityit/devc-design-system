import { Alert } from '@dev-community/ui';
import { DocSection, RefTable } from '../../components/Doc';

export default function Figma() {
  return (
    <>
      <Alert tone="warning" title="The Figma file has not been created">
        The environment in which the design system was developed had no authorized tools with write access to Figma. As a result, there is
        no native Figma library: standard-format tokens, component specifications, and the procedure to build one are available instead.
        The JSON files are not a Figma library, and there is no two-way sync.
      </Alert>

      <DocSection title="Available artifacts">
        <RefTable
          label="Design artifacts"
          columns={['Repository path', 'Contents']}
          rows={[
            [<code key="1">design/figma/tokens.dtcg.json</code>, 'All tokens in W3C Design Tokens (DTCG) format: base, density, tonal palettes, and color roles per preset and scheme'],
            [<code key="2">design/figma/tokens-studio/</code>, 'Sets for Tokens Studio: base, density/*, palette/*, scheme/light|dark, with $themes (26 presets × 2 schemes × 2 densities). The expressive style and gradients are CSS-only and are not exported'],
            [<code key="3">design/figma/README.md</code>, 'Import procedure and token ↔ Figma variable ↔ CSS mapping'],
            [<code key="4">design/figma/components.md</code>, 'Specifications of components, variants, properties, and states to build in Figma'],
            [<code key="5">@dev-community/ui/tokens.json</code>, 'The same DTCG file, shipped with the package'],
          ]}
        />
        <p>
          All files are generated from the same source as the CSS tokens (<code>npm run tokens</code>), so the names match:{' '}
          <code>color.text.primary</code> in Figma corresponds to <code>--dc-color-text-primary</code> in code.
        </p>
      </DocSection>

      <DocSection title="Importing the tokens">
        <ol>
          <li>Install the Tokens Studio for Figma plugin in a new file (don’t overwrite existing libraries).</li>
          <li>
            Connect the <code>design/figma/tokens-studio</code> folder as a source (Git sync or file import); check that
            the set order matches <code>$metadata.json</code>.
          </li>
          <li>
            Use “Export to Figma → Variables” and pick the themes from <code>$themes.json</code>: palette as a collection with a mode for each of the 26 presets (aurora, nebula, sunset, …); scheme as light/dark modes; density as comfortable/compact modes.
          </li>
          <li>Create text styles from the <code>typography.*</code> tokens and effects from the <code>shadow.*</code> tokens.</li>
          <li>Repeat the import after every release that changes tokens; the flow is code → Figma only.</li>
        </ol>
        <p>
          Alternatively, tools that read DTCG (for example, Figma’s native variable import, if available on your plan)
          can use <code>tokens.dtcg.json</code> directly; references between tokens (aliases) are expressed with the{' '}
          <code>{'{palette.brand.40}'}</code> syntax.
        </p>
      </DocSection>

      <DocSection title="What needs to be built manually">
        <ul>
          <li>Components and variants (Button, Input, Select, Card, Dialog…) with Auto Layout, following <code>components.md</code>.</li>
          <li>Component properties (variant, size, tone, state, optional icons) and hover, focus, pressed, disabled, invalid, and loading states.</li>
          <li>Desktop and mobile page examples (dashboard, list, form, sign-in) based on the site showcase.</li>
          <li>Sign-in patterns, SiteHeader with mobile menu, UserMenu, and Footer.</li>
        </ul>
        <p>
          Code remains the source of truth for behavior, accessibility, and keyboard interaction: Figma represents appearance and composition.
        </p>
      </DocSection>
    </>
  );
}
