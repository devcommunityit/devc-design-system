import type { CSSProperties } from 'react';
import { BASE_TOKENS, COLOR_ROLES, breakpoints, colorVar, tokenVar, Heading, Link } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

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
      <DocSection title="Principi">
        <ul>
          <li>Ruoli semantici (testo, superfici, azioni, bordi, feedback) ispirati a Material Design 3, con un’identità propria.</li>
          <li>Palette neutra a bassa saturazione e un unico accento di brand; il feedback non dipende solo dal colore (icone e testo).</li>
          <li>Superfici distinte per tono e bordo sottile; ombre riservate a elementi sollevati e overlay.</li>
          <li>Movimento breve e discreto, disattivato con prefers-reduced-motion.</li>
          <li>Densità (comoda/compatta) indipendente dalla palette.</li>
        </ul>
        <p>
          I valori mostrati qui sono letti dalle variabili CSS del tema attivo: cambia tema o modalità dal selettore in alto per vederli aggiornati.
        </p>
      </DocSection>

      <DocSection title="Colore">
        {GROUPS.map((group) => (
          <section key={group} aria-label={`Ruoli ${group}`}>
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

      <DocSection title="Tipografia">
        <p>Font di sistema (nessun download): leggibili, veloci e coerenti con la piattaforma. Ogni ruolo definisce dimensione, interlinea, peso e spaziatura.</p>
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
                Portale clienti
              </span>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Spaziatura, raggi ed elevazione">
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

      <DocSection title="Movimento">
        <RefTable
          label="Token di movimento"
          columns={['Token', 'Valore']}
          rows={tokensWith('motion.').map((t) => [<code key={t}>{t}</code>, <code key="v">{BASE_TOKENS[t]}</code>])}
        />
        <p>
          Con <code>prefers-reduced-motion: reduce</code> le transizioni dei componenti sono rimosse o ridotte a un cambio di opacità; nessuna informazione
          è veicolata soltanto dall’animazione.
        </p>
      </DocSection>

      <DocSection title="Breakpoint">
        <p>
          Mobile-first, con media query <code>min-width</code>. Le custom properties non sono valide nelle condizioni delle media query: i valori sono
          esportati come costante <code>breakpoints</code> per JavaScript e scritti come numeri nei CSS. Molti componenti usano container query, quindi
          si adattano allo spazio disponibile e non solo alla finestra.
        </p>
        <RefTable
          label="Breakpoint"
          columns={['Nome', 'min-width']}
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

      <DocSection title="Approfondimenti">
        <p>
          Nomi, livelli e output dei token sono descritti in <Link href="/guide/token">Design token</Link>; la combinazione di palette, modalità e densità in{' '}
          <Link href="/guide/temi">Temi</Link>.
        </p>
      </DocSection>
    </>
  );
}
