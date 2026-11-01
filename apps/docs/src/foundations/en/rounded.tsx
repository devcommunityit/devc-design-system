import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

const RADII = Object.keys(BASE_TOKENS).filter((path) => path.startsWith('radius.'));

export default function RoundedFoundation() {
  return (
    <>
      <DocSection title="Radius scale">
        <p>Radii define the character of surfaces without changing the layout structure. Shapes are shared across components and update with the tokens.</p>
        <ul className="docs-foundation-shape-grid">
          {RADII.map((path) => (
            <li key={path}>
              <span className="docs-foundation-shape" style={{ borderRadius: `var(${tokenVar(path)})` }} aria-hidden="true" />
              <code>{path}</code>
              <code>var(--dc-{path.replace('.', '-')})</code>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="Choosing a shape">
        <RefTable
          label="Recommended radius usage"
          columns={['Token', 'Typical use']}
          rows={[
            [<code key="xs">radius.xs–sm</code>, 'Badges and small inner elements'],
            [<code key="md">radius.md</code>, 'Fields and controls'],
            [<code key="lg">radius.lg–xl</code>, 'Cards, dialogs, and main surfaces'],
            [<code key="full">radius.full</code>, 'Chips, avatars, and pill-shaped controls'],
          ]}
        />
        <p>These are guidelines: a component may use a different radius when it improves usability or consistency with its content.</p>
      </DocSection>
      <DocSection title="Customization">
        <Code language="css">{`.brand-card {
  border-radius: var(--dc-radius-xl);
  border: var(--dc-border-width-thin) solid var(--dc-color-border-subtle);
}`}</Code>
      </DocSection>
    </>
  );
}
