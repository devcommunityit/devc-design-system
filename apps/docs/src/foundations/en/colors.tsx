import { COLOR_ROLES, colorVar } from '@dev-community/ui';
import { Code, DocSection } from '../../components/Doc';

const GROUPS = [
  ['text', 'Text'],
  ['surface', 'Surfaces'],
  ['action', 'Actions'],
  ['accent', 'Accents'],
  ['border', 'Borders'],
  ['focus', 'Focus'],
  ['feedback', 'Feedback'],
  ['data', 'Data'],
] as const;

export default function ColorsFoundation() {
  return (
    <>
      <DocSection title="Semantic roles">
        <p>Components use roles, not hard-coded colors. Values change with the preset and light/dark mode; use the theme picker in the header to compare them.</p>
        {GROUPS.map(([group, label]) => {
          const roles = COLOR_ROLES.filter((role) => role.startsWith(`${group}.`));
          if (roles.length === 0) return null;
          return (
            <section key={group} className="docs-foundation-color-group" aria-labelledby={`colors-${group}`}>
              <h3 id={`colors-${group}`}>{label}</h3>
              <ul className="docs-foundation-color-grid">
                {roles.map((role) => (
                  <li key={role}>
                    <span
                      className="docs-foundation-color-swatch"
                      style={{ backgroundColor: `var(${colorVar(role)})` }}
                      aria-hidden="true"
                    />
                    <code>color.{role}</code>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </DocSection>
      <DocSection title="Using colors in code">
        <p>Prefer semantic roles for text, surfaces, actions, borders, and feedback. The Theme Builder’s automatic contrast check helps spot problematic combinations, but custom themes still need to be verified.</p>
        <Code language="css">{`.notice {
  color: var(--dc-color-text-primary);
  background: var(--dc-color-feedback-info-surface);
  border-color: var(--dc-color-feedback-info-border);
}`}</Code>
      </DocSection>
      <DocSection title="Accessibility and theming">
        <ul>
          <li>Don’t rely on color alone to convey information, states, or charts: add text, icons, patterns, or values.</li>
          <li>Check the contrast between text and background in both themes and in brand variants.</li>
          <li>Use <code>data.1</code>–<code>data.6</code> for chart series and keep a text legend.</li>
        </ul>
      </DocSection>
    </>
  );
}
