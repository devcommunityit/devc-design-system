import { Link } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

export default function Token() {
  return (
    <>
      <DocSection title="Tiers">
        <RefTable
          label="Token tiers"
          columns={['Tier', 'Examples', 'Used by']}
          rows={[
            ['Primitive', <code key="p">palette brand 0–100, space.4, radius.md, shadow.2</code>, 'Only the generator and themes'],
            ['Semantic', <code key="s">color.text.primary, color.surface.default, color.action.primary, color.feedback.danger</code>, 'Components, patterns, and consumers'],
            ['Density', <code key="d">density.control-height-md, density.control-padding-inline-md</code>, 'Interactive controls'],
          ]}
        />
        <p>
          Names describe a role, not a color or a page: <code>color.action.primary</code>, not <code>color.indigo-600</code> or{' '}
          <code>color.header-home</code>. Components consume semantic tokens only; an automated check (
          <code>scripts/check-token-refs.mjs</code>) flags references to variables that don’t exist.
        </p>
        <p>
          For data visualization there are six categorical roles, <code>color.data.1</code>…<code>color.data.6</code>{' '}
          (<code>--dc-color-data-N</code>): <code>data.1</code> is the brand color, <code>data.2</code> the tertiary, and the others are hues rotated
          from the brand in HCT. Each role has a minimum 3:1 contrast on the default surface. Charts always pair them with dash patterns, markers,
          and a legend, so information never depends on color alone.
        </p>
      </DocSection>

      <DocSection title="From name to CSS variable">
        <p>
          The dotted path becomes a custom property with the <code>dc</code> prefix: <code>color.text.primary</code> →{' '}
          <code>--dc-color-text-primary</code>, <code>space.4</code> → <code>--dc-space-4</code>. The <code>colorVar</code> and{' '}
          <code>tokenVar</code> helpers perform the same conversion in TypeScript.
        </p>
        <Code>{`
import { colorVar, tokenVar } from '@devcommunityit/ui/theme';

const style = {
  color: \`var(\${colorVar('text.secondary')})\`,   // var(--dc-color-text-secondary)
  padding: \`var(\${tokenVar('space.4')})\`,        // var(--dc-space-4)
};
`}</Code>
        <Code language="css">{`
.portal-note {
  padding: var(--dc-space-4);
  border: var(--dc-border-width-thin) solid var(--dc-color-border-subtle);
  border-radius: var(--dc-radius-md);
  background: var(--dc-color-surface-raised);
  color: var(--dc-color-text-primary);
}
`}</Code>
        <p>
          Variables are defined only on elements with <code>data-dc-theme</code> (set by <code>ThemeProvider</code>) via{' '}
          <code>:where()</code>, so they have zero specificity and don’t affect the rest of the host page.
        </p>
      </DocSection>

      <DocSection title="Single source, generated outputs">
        <p>
          All tokens originate in <code>packages/ui/tokens/</code>, and the <code>npm run tokens</code> script generates every output. Generated files
          must not be edited by hand.
        </p>
        <RefTable
          label="Sources and outputs"
          columns={['File', 'Role']}
          rows={[
            [<code key="1">tokens/base.tokens.json</code>, 'DTCG source: typography, spacing, radii, borders, shadows, z-index, motion, breakpoints, containers'],
            [<code key="2">tokens/density.*.tokens.json</code>, 'DTCG source: comfortable and compact density'],
            [<code key="3">tokens/color.config.json</code>, 'Source: preset seeds, role → tone mapping, contrast pairs'],
            [<code key="4">src/styles/generated/tokens.css</code>, 'Output: custom properties per preset, scheme, and density (exported as ./tokens.css)'],
            [<code key="5">src/tokens/generated.ts</code>, 'Output: typed constants (COLOR_ROLES, BASE_TOKENS, breakpoints, PRESET_COLORS…)'],
            [<code key="6">design/figma/tokens.dtcg.json</code>, 'Output: full DTCG, also exported as ./tokens.json'],
            [<code key="7">design/figma/tokens-studio/</code>, 'Output: sets and themes for the Tokens Studio plugin'],
          ]}
        />
        <p>
          Tonal palettes are computed from a seed color with <code>@material/material-color-utilities</code> (Material Design 3 HCT color space). The
          generator fails the build if a preset doesn’t meet the contrast pairs declared in <code>color.config.json</code>, in both
          schemes.
        </p>
      </DocSection>

      <DocSection title="Categories">
        <ul>
          <li><strong>Color</strong>: text, surface, border, action, accent (tertiary), feedback, focus, overlay.</li>
          <li><strong>Typography</strong>: families, weights, and 13 roles (display → label-sm) with size, line-height, weight, letter-spacing.</li>
          <li><strong>Spacing</strong>: 4px-step scale (space.0 → space.24, plus space.0-5 and space.1-5).</li>
          <li><strong>Radii, borders, shadows</strong>: radius.none → full, border.width.*, shadow.1 → 4.</li>
          <li><strong>Sizing</strong>: control heights and padding (density), container widths.</li>
          <li><strong>Z-index</strong>: named layers for sticky, overlay, toast.</li>
          <li><strong>Motion</strong>: durations and easing curves, zeroed out with prefers-reduced-motion.</li>
          <li><strong>Look and gradients</strong>: gradient.accent, accent-sheen, accent-subtle, text, and the look.* values (fill-primary, fill-tonal, fill-size, shadow-primary, radius-control, radius-container) for the standard and expressive looks. Source: <code>tokens/look.config.json</code>.</li>
        </ul>
        <p>
          Values and previews are in <Link href="/guide/fondamenta">Visual foundations</Link>.
        </p>
      </DocSection>

      <DocSection title="Adding or changing a token">
        <ol>
          <li>Edit the source file in <code>packages/ui/tokens/</code>.</li>
          <li>Run <code>npm run tokens -w @devcommunityit/ui</code>.</li>
          <li>Check the contrast validation and run <code>npm run lint:tokens -w @devcommunityit/ui</code>.</li>
          <li>Update the documentation if the token is new; renaming or removing a token is a breaking (major) change.</li>
        </ol>
      </DocSection>
    </>
  );
}
