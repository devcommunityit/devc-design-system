import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

const RADII = Object.keys(BASE_TOKENS).filter((path) => path.startsWith('radius.'));

export default function RoundedFoundation() {
  return (
    <>
      <DocSection title="Scala dei raggi">
        <p>I raggi definiscono il carattere delle superfici senza alterare la struttura del layout. Le forme sono condivise tra componenti e si aggiornano con i token.</p>
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
      <DocSection title="Scelta della forma">
        <RefTable
          label="Uso consigliato dei raggi"
          columns={['Token', 'Uso tipico']}
          rows={[
            [<code key="xs">radius.xs–sm</code>, 'Badge e piccoli elementi interni'],
            [<code key="md">radius.md</code>, 'Campi e controlli'],
            [<code key="lg">radius.lg–xl</code>, 'Card, dialog e superfici principali'],
            [<code key="full">radius.full</code>, 'Chip, avatar e controlli a pillola'],
          ]}
        />
        <p>Le indicazioni sono linee guida: il componente può adottare un raggio diverso quando migliora usabilità o coerenza con il contenuto.</p>
      </DocSection>
      <DocSection title="Personalizzazione">
        <Code language="css">{`.brand-card {
  border-radius: var(--dc-radius-xl);
  border: var(--dc-border-width-thin) solid var(--dc-color-border-subtle);
}`}</Code>
      </DocSection>
    </>
  );
}
