import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

const SPACING = Object.keys(BASE_TOKENS).filter((path) => path.startsWith('space.'));

export default function SpacingFoundation() {
  return (
    <>
      <DocSection title="Spacing scale">
        <p>The scale grows in regular steps, with a few intermediate sizes for compact controls and layouts. The previews use the values of the active theme.</p>
        <ul className="docs-foundation-scale">
          {SPACING.map((path) => (
            <li key={path}>
              <code>{path}</code>
              <span className="docs-foundation-space-bar" style={{ inlineSize: `var(${tokenVar(path)})` }} aria-hidden="true" />
              <code>var(--dc-{path.replace('.', '-')})</code>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="Rhythm and composition">
        <p>Use the same tokens for padding, gaps, and inner margins. For composable layouts, the <code>Stack</code>, <code>Inline</code>, and <code>Grid</code> primitives apply the scale without arbitrary values.</p>
        <div className="docs-foundation-spacing-demo" aria-label="Example of spacing between elements">
          <div className="docs-foundation-spacing-demo__item">Content</div>
          <div className="docs-foundation-spacing-demo__item">Gap · space.4</div>
          <div className="docs-foundation-spacing-demo__item">Content</div>
        </div>
        <Code language="tsx">{`import { Stack, Text } from '@devcommunityit/ui';

<Stack gap={4}>
  <Text variant="title-md">Settings</Text>
  <Text tone="secondary">Manage your account preferences.</Text>
</Stack>`}</Code>
      </DocSection>
      <DocSection title="Token reference">
        <RefTable
          label="Spacing tokens"
          columns={['Token', 'Value']}
          rows={SPACING.map((path) => [<code key={path}>{path}</code>, <code key="value">{String(BASE_TOKENS[path as keyof typeof BASE_TOKENS])}</code>])}
        />
      </DocSection>
    </>
  );
}
