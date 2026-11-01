import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

const SHADOWS = Object.keys(BASE_TOKENS).filter((path) => path.startsWith('shadow.'));

export default function ShadowsFoundation() {
  return (
    <>
      <DocSection title="Livelli di elevazione">
        <p>Le ombre distinguono superfici sovrapposte senza sostituire bordi o gerarchia cromatica. Il tema scuro comunica l’elevazione soprattutto tramite il tono della superficie.</p>
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
      <DocSection title="Quando applicarle">
        <RefTable
          label="Uso consigliato delle ombre"
          columns={['Token', 'Uso tipico']}
          rows={[
            [<code key="1">shadow.1</code>, 'Controlli o card appena sollevati'],
            [<code key="2">shadow.2</code>, 'Card interattive e popover leggeri'],
            [<code key="3">shadow.3</code>, 'Menu e superfici sovrapposte'],
            [<code key="4">shadow.4</code>, 'Overlay e dialog in primo piano'],
          ]}
        />
        <p>Riduci la profondità quando il contesto è già affollato. Mantieni sempre un bordo o una differenza di superficie per non dipendere dalla sola ombra.</p>
      </DocSection>
      <DocSection title="Personalizzazione">
        <Code language="css">{`.floating-panel {
  background: var(--dc-color-surface-raised);
  box-shadow: var(--dc-shadow-2);
  border: var(--dc-border-width-thin) solid var(--dc-color-border-subtle);
}`}</Code>
      </DocSection>
    </>
  );
}
