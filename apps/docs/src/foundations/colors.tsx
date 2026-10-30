import { COLOR_ROLES, colorVar } from '@dev-community/ui';
import { Code, DocSection } from '../components/Doc';

const GROUPS = [
  ['text', 'Testo'],
  ['surface', 'Superfici'],
  ['action', 'Azioni'],
  ['accent', 'Accenti'],
  ['border', 'Bordi'],
  ['focus', 'Focus'],
  ['feedback', 'Feedback'],
  ['data', 'Dati'],
] as const;

export default function ColorsFoundation() {
  return (
    <>
      <DocSection title="Ruoli semantici">
        <p>I componenti usano ruoli, non colori hard-coded. I valori cambiano con preset e modalità light/dark; usa il selettore del tema nell’intestazione per confrontarli.</p>
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
      <DocSection title="Usare i colori nel codice">
        <p>Preferisci i ruoli semantici per testo, superfici, azioni, bordi e feedback. Il controllo automatico del contrasto del Theme Builder aiuta a individuare combinazioni problematiche, ma temi personalizzati richiedono comunque verifica.</p>
        <Code language="css">{`.notice {
  color: var(--dc-color-text-primary);
  background: var(--dc-color-feedback-info-surface);
  border-color: var(--dc-color-feedback-info-border);
}`}</Code>
      </DocSection>
      <DocSection title="Accessibilità e tematizzazione">
        <ul>
          <li>Non affidare informazioni, stati o grafici al solo colore: aggiungi testo, icone, pattern o valori.</li>
          <li>Verifica il contrasto tra testo e sfondo in entrambi i temi e nelle varianti del brand.</li>
          <li>Usa <code>data.1</code>–<code>data.6</code> per le serie dei grafici e mantieni una legenda testuale.</li>
        </ul>
      </DocSection>
    </>
  );
}
