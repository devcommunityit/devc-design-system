import { BASE_TOKENS, tokenVar } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

const SHADOWS = Object.keys(BASE_TOKENS).filter((path) => path.startsWith('shadow.'));

export default function ShadowsFoundation() {
  return (
    <>
      <DocSection title="Elevation levels">
        <p>Shadows distinguish overlapping surfaces without replacing borders or color hierarchy. The dark theme conveys elevation mainly through surface tone.</p>
        <ul className="docs-foundation-shadow-grid">
          {SHADOWS.map((path) => (
            <li key={path}>
              <span className="docs-foundation-shadow-sample" style={{ boxShadow: `var(${tokenVar(path)})` }} aria-hidden="true" />
              <code>{path}</code>
              <code>var(--dc-{path.replace('.', '-')})</code>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="When to apply them">
        <RefTable
          label="Recommended shadow usage"
          columns={['Token', 'Typical use']}
          rows={[
            [<code key="1">shadow.1</code>, 'Slightly raised controls or cards'],
            [<code key="2">shadow.2</code>, 'Interactive cards and light popovers'],
            [<code key="3">shadow.3</code>, 'Menus and overlapping surfaces'],
            [<code key="4">shadow.4</code>, 'Foreground overlays and dialogs'],
          ]}
        />
        <p>Reduce depth when the context is already busy. Always keep a border or a surface difference so you don’t depend on the shadow alone.</p>
      </DocSection>
      <DocSection title="Customization">
        <Code language="css">{`.floating-panel {
  background: var(--dc-color-surface-raised);
  box-shadow: var(--dc-shadow-2);
  border: var(--dc-border-width-thin) solid var(--dc-color-border-subtle);
}`}</Code>
      </DocSection>
    </>
  );
}
