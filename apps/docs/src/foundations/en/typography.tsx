import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

const ROLES = ['display', 'headline-lg', 'headline-md', 'headline-sm', 'title-lg', 'title-md', 'title-sm', 'body-lg', 'body-md', 'body-sm', 'label-lg', 'label-md', 'label-sm'];

export default function TypographyFoundation() {
  return (
    <>
      <DocSection title="Type scale">
        <p>The scale uses system fonts with no external downloads. Semantic roles define size, line height, weight, and letter spacing, so the hierarchy stays readable when the theme changes.</p>
        <ul className="docs-foundation-type-list">
          {ROLES.map((role) => (
            <li key={role}>
              <code>typography.{role}</code>
              <span
                style={{
                  fontSize: `var(${tokenVar(`typography.${role}.size`)})`,
                  lineHeight: `var(${tokenVar(`typography.${role}.line-height`)})`,
                  fontWeight: `var(${tokenVar(`typography.${role}.weight`)})`,
                  letterSpacing: `var(${tokenVar(`typography.${role}.letter-spacing`)})`,
                }}
              >
                {role.startsWith('label') ? 'Control label' : 'Customer portal'}
              </span>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="Families and weights">
        <RefTable
          label="Font families and weights"
          columns={['Token', 'Value']}
          rows={Object.entries(BASE_TOKENS)
            .filter(([path]) => path.startsWith('font.family.') || path.startsWith('font.weight.'))
            .map(([path, value]) => [<code key={path}>{path}</code>, <code key="value">{String(value)}</code>])}
        />
      </DocSection>
      <DocSection title="Semantic usage">
        <p>Use the <code>Heading</code> and <code>Text</code> components to keep HTML semantics and visual hierarchy consistent. The tokens remain available for custom components.</p>
        <Code language="tsx">{`import { Heading, Text } from '@devcommunityit/ui';

<Heading level={1} size="headline-lg">Customer overview</Heading>
<Text variant="body-md" tone="secondary">Updated a few minutes ago</Text>`}</Code>
        <Code language="css">{`.custom-summary {
  font-size: var(--dc-typography-body-md-size);
  line-height: var(--dc-typography-body-md-line-height);
  font-weight: var(--dc-typography-body-md-weight);
}`}</Code>
      </DocSection>
      <DocSection title="Guidelines">
        <ul>
          <li>Respect heading order: a single H1 per page, then H2 and H3 in sequence.</li>
          <li>Don’t rely on size or color alone to convey the importance of content.</li>
          <li>Prefer <code>body</code> roles for long-form text and <code>label</code> roles for dense interfaces.</li>
        </ul>
      </DocSection>
    </>
  );
}
