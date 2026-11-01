import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

const SPACING = Object.keys(BASE_TOKENS).filter((path) => path.startsWith('space.'));

export default function SpacingFoundation() {
  return (
    <>
      <DocSection title="Scala di spaziatura">
        <p>La scala cresce in passi regolari con alcune misure intermedie per controlli e layout compatti. Le anteprime usano i valori del tema attivo.</p>
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
      <DocSection title="Ritmo e composizione">
        <p>Usa gli stessi token per padding, gap e margini interni. Per layout componibili, i primitivi <code>Stack</code>, <code>Inline</code> e <code>Grid</code> applicano la scala senza valori arbitrari.</p>
        <div className="docs-foundation-spacing-demo" aria-label="Esempio di spaziatura tra elementi">
          <div className="docs-foundation-spacing-demo__item">Contenuto</div>
          <div className="docs-foundation-spacing-demo__item">Gap · space.4</div>
          <div className="docs-foundation-spacing-demo__item">Contenuto</div>
        </div>
        <Code language="tsx">{`import { Stack, Text } from '@devcommunityit/ui';

<Stack gap={4}>
  <Text variant="title-md">Impostazioni</Text>
  <Text tone="secondary">Gestisci le preferenze del tuo account.</Text>
</Stack>`}</Code>
      </DocSection>
      <DocSection title="Riferimento token">
        <RefTable
          label="Token di spaziatura"
          columns={['Token', 'Valore']}
          rows={SPACING.map((path) => [<code key={path}>{path}</code>, <code key="value">{String(BASE_TOKENS[path as keyof typeof BASE_TOKENS])}</code>])}
        />
      </DocSection>
    </>
  );
}
