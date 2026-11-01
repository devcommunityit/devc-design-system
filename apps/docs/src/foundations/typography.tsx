import { BASE_TOKENS, tokenVar } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

const ROLES = ['display', 'headline-lg', 'headline-md', 'headline-sm', 'title-lg', 'title-md', 'title-sm', 'body-lg', 'body-md', 'body-sm', 'label-lg', 'label-md', 'label-sm'];

export default function TypographyFoundation() {
  return (
    <>
      <DocSection title="Scala tipografica">
        <p>La scala usa font di sistema senza download esterni. I ruoli semantici definiscono dimensione, interlinea, peso e spaziatura, così la gerarchia rimane leggibile anche cambiando tema.</p>
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
                {role.startsWith('label') ? 'Etichetta di controllo' : 'Portale clienti'}
              </span>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="Famiglie e pesi">
        <RefTable
          label="Famiglie e pesi tipografici"
          columns={['Token', 'Valore']}
          rows={Object.entries(BASE_TOKENS)
            .filter(([path]) => path.startsWith('font.family.') || path.startsWith('font.weight.'))
            .map(([path, value]) => [<code key={path}>{path}</code>, <code key="value">{String(value)}</code>])}
        />
      </DocSection>
      <DocSection title="Uso semantico">
        <p>Usa i componenti <code>Heading</code> e <code>Text</code> per mantenere coerenti semantica HTML e gerarchia visiva. I token restano disponibili per componenti custom.</p>
        <Code language="tsx">{`import { Heading, Text } from '@devcommunityit/ui';

<Heading level={1} size="headline-lg">Panoramica clienti</Heading>
<Text variant="body-md" tone="secondary">Aggiornato pochi minuti fa</Text>`}</Code>
        <Code language="css">{`.custom-summary {
  font-size: var(--dc-typography-body-md-size);
  line-height: var(--dc-typography-body-md-line-height);
  font-weight: var(--dc-typography-body-md-weight);
}`}</Code>
      </DocSection>
      <DocSection title="Linee guida">
        <ul>
          <li>Rispetta l’ordine dei titoli: un solo H1 per pagina, poi H2 e H3 in sequenza.</li>
          <li>Non usare dimensione o colore da soli per comunicare l’importanza di un contenuto.</li>
          <li>Preferisci ruoli <code>body</code> per i testi lunghi e <code>label</code> per interfacce dense.</li>
        </ul>
      </DocSection>
    </>
  );
}
