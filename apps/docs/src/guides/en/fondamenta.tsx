import type { CSSProperties } from 'react';
import { BASE_TOKENS, COLOR_ROLES, breakpoints, colorVar, tokenVar, Heading, Link } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

type TokenPath = keyof typeof BASE_TOKENS;
const tokensWith = (prefix: string) => (Object.keys(BASE_TOKENS) as TokenPath[]).filter((k) => k.startsWith(prefix));
const GROUPS = ['text', 'surface', 'border', 'action', 'feedback'] as const;
const TYPE_ROLES = ['display', 'headline-lg', 'headline-md', 'headline-sm', 'title-lg', 'title-md', 'title-sm', 'body-lg', 'body-md', 'body-sm', 'label-lg', 'label-md', 'label-sm'];

function Swatch({ role }: { role: string }) {
  const style: CSSProperties = { background: `var(${colorVar(role)})` };
  return (
    <li className="docs-swatch">
      <span className="docs-swatch-chip" style={style} aria-hidden="true" />
      <code>color.{role}</code>
    </li>
  );
}

export default function Fondamenta() {
  return (
    <>
      <DocSection title="Principles">
        <ul>
          <li>Semantic roles (text, surfaces, actions, borders, feedback) inspired by Material Design 3, with an identity of their own.</li>
          <li>A low-saturation neutral palette and a single brand accent; feedback never relies on color alone (icons and text).</li>
          <li>Surfaces are distinguished by tone and a thin border; shadows are reserved for raised elements and overlays.</li>
          <li>Short, subtle motion, disabled with prefers-reduced-motion.</li>
          <li>Density (comfortable/compact) is independent of the palette.</li>
        </ul>
        <p>
          The values shown here are read from the CSS variables of the active theme: switch theme or mode from the selector at the top to see them update.
        </p>
      </DocSection>

      <DocSection title="Foundations in detail">
        <p>Browse the previews and references for each token family:</p>
        <ul>
          <li><Link href="/foundations/typography">Typography</Link>: type hierarchy and roles.</li>
          <li><Link href="/foundations/spacing">Spacing</Link>: spacing scale and layout rhythm.</li>
          <li><Link href="/foundations/rounded">Rounded</Link>: surface radii and shapes.</li>
          <li><Link href="/foundations/colors">Colors</Link>: color roles across themes and modes.</li>
          <li><Link href="/foundations/shadows">Shadows</Link>: elevation and layered surfaces.</li>
        </ul>
      </DocSection>

      <DocSection title="Color">
        {GROUPS.map((group) => (
          <section key={group} aria-label={`${group} roles`}>
            <Heading level={3} size="title-sm">
              {group}
            </Heading>
            <ul className="docs-swatch-grid">
              {COLOR_ROLES.filter((r) => r.startsWith(`${group}.`)).map((role) => (
                <Swatch key={role} role={role} />
              ))}
            </ul>
          </section>
        ))}
      </DocSection>

      <DocSection title="Typography">
        <p>System fonts (no downloads): legible, fast, and consistent with the platform. Each role defines size, line height, weight, and letter spacing.</p>
        <ul className="docs-type-scale">
          {TYPE_ROLES.map((role) => (
            <li key={role}>
              <code>{role}</code>
              <span
                style={{
                  fontSize: `var(${tokenVar(`typography.${role}.size`)})`,
                  lineHeight: `var(${tokenVar(`typography.${role}.line-height`)})`,
                  fontWeight: `var(${tokenVar(`typography.${role}.weight`)})`,
                  letterSpacing: `var(${tokenVar(`typography.${role}.letter-spacing`)})`,
                }}
              >
                Customer portal
              </span>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Spacing, radii, and elevation">
        <ul className="docs-scale">
          {tokensWith('space.').map((t) => (
            <li key={t}>
              <code>{t}</code>
              <span className="docs-scale-bar" style={{ inlineSize: `var(${tokenVar(t)})` }} aria-hidden="true" />
              <span>{BASE_TOKENS[t]}</span>
            </li>
          ))}
        </ul>
        <ul className="docs-swatch-grid">
          {tokensWith('radius.').map((t) => (
            <li key={t} className="docs-swatch">
              <span className="docs-swatch-chip docs-swatch-chip--outline" style={{ borderRadius: `var(${tokenVar(t)})` }} aria-hidden="true" />
              <code>{t}</code>
            </li>
          ))}
          {tokensWith('shadow.').map((t) => (
            <li key={t} className="docs-swatch">
              <span className="docs-swatch-chip docs-swatch-chip--raised" style={{ boxShadow: `var(${tokenVar(t)})` }} aria-hidden="true" />
              <code>{t}</code>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Motion">
        <RefTable
          label="Motion tokens"
          columns={['Token', 'Value']}
          rows={tokensWith('motion.').map((t) => [<code key={t}>{t}</code>, <code key="v">{BASE_TOKENS[t]}</code>])}
        />
        <p>
          With <code>prefers-reduced-motion: reduce</code>, component transitions are removed or reduced to an opacity change; no information is
          conveyed by animation alone.
        </p>
      </DocSection>

      <DocSection title="Breakpoints">
        <p>
          Mobile-first, using <code>min-width</code> media queries. Custom properties aren’t valid in media query conditions, so the values are
          exported as the <code>breakpoints</code> constant for JavaScript and written as numbers in CSS. Many components use container queries, so
          they adapt to the available space, not just the viewport.
        </p>
        <RefTable
          label="Breakpoints"
          columns={['Name', 'min-width']}
          rows={Object.entries(breakpoints).map(([name, px]) => [<code key={name}>{name}</code>, `${px}px`])}
        />
        <Code>{`
import { breakpoints } from '@dev-community/ui';

const isDesktop = window.matchMedia(\`(min-width: \${breakpoints.lg}px)\`).matches;
`}</Code>
        <Code language="css">{`
.my-panel { display: grid; gap: var(--dc-space-4); }
@media (width >= 1024px) { /* breakpoints.lg */
  .my-panel { grid-template-columns: 16rem 1fr; }
}
`}</Code>
      </DocSection>

      <DocSection title="Learn more">
        <p>
          Token names, tiers, and outputs are described in <Link href="/guide/token">Design tokens</Link>; combining palette, mode, and density is covered in{' '}
          <Link href="/guide/temi">Themes</Link>.
        </p>
      </DocSection>
    </>
  );
}
