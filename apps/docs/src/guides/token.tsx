import { Link } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

export default function Token() {
  return (
    <>
      <DocSection title="Livelli">
        <RefTable
          label="Livelli dei token"
          columns={['Livello', 'Esempi', 'Chi li usa']}
          rows={[
            ['Primitivi', <code key="p">palette brand 0–100, space.4, radius.md, shadow.2</code>, 'Solo il generatore e i temi'],
            ['Semantici', <code key="s">color.text.primary, color.surface.default, color.action.primary, color.feedback.danger</code>, 'Componenti, pattern e consumer'],
            ['Densità', <code key="d">density.control-height-md, density.control-padding-inline-md</code>, 'Controlli interattivi'],
          ]}
        />
        <p>
          I nomi descrivono un ruolo, non un colore né una pagina: <code>color.action.primary</code>, non <code>color.indigo-600</code> o{' '}
          <code>color.header-home</code>. I componenti consumano esclusivamente token semantici; un controllo automatico (
          <code>scripts/check-token-refs.mjs</code>) segnala riferimenti a variabili inesistenti.
        </p>
        <p>
          Per la visualizzazione dei dati esistono sei ruoli categoriali <code>color.data.1</code>…<code>color.data.6</code>{' '}
          (<code>--dc-color-data-N</code>): <code>data.1</code> è il brand, <code>data.2</code> il terziario, gli altri sono tinte ruotate dal
          brand con HCT. Ogni ruolo ha contrasto minimo 3:1 sulla superficie predefinita. I grafici li combinano sempre con tratteggi, marcatori
          e legenda, quindi l&apos;informazione non dipende dal solo colore.
        </p>
      </DocSection>

      <DocSection title="Da nome a variabile CSS">
        <p>
          Il percorso puntato diventa una custom property con prefisso <code>dc</code>: <code>color.text.primary</code> →{' '}
          <code>--dc-color-text-primary</code>, <code>space.4</code> → <code>--dc-space-4</code>. Gli helper <code>colorVar</code> e{' '}
          <code>tokenVar</code> eseguono la stessa conversione in TypeScript.
        </p>
        <Code>{`
import { colorVar, tokenVar } from '@devcommunityit/ui/theme';

const style = {
  color: \`var(\${colorVar('text.secondary')})\`,   // var(--dc-color-text-secondary)
  padding: \`var(\${tokenVar('space.4')})\`,        // var(--dc-space-4)
};
`}</Code>
        <Code language="css">{`
.portal-note {
  padding: var(--dc-space-4);
  border: var(--dc-border-width-thin) solid var(--dc-color-border-subtle);
  border-radius: var(--dc-radius-md);
  background: var(--dc-color-surface-raised);
  color: var(--dc-color-text-primary);
}
`}</Code>
        <p>
          Le variabili sono definite solo su elementi con <code>data-dc-theme</code> (impostato da <code>ThemeProvider</code>) tramite{' '}
          <code>:where()</code>, quindi hanno specificità zero e non toccano il resto della pagina ospite.
        </p>
      </DocSection>

      <DocSection title="Unica fonte, output generati">
        <p>
          Tutti i token nascono in <code>packages/ui/tokens/</code> e lo script <code>npm run tokens</code> genera ogni output. I file generati non vanno
          modificati a mano.
        </p>
        <RefTable
          label="Sorgenti e output"
          columns={['File', 'Ruolo']}
          rows={[
            [<code key="1">tokens/base.tokens.json</code>, 'Sorgente DTCG: tipografia, spaziature, raggi, bordi, ombre, z-index, motion, breakpoint, contenitori'],
            [<code key="2">tokens/density.*.tokens.json</code>, 'Sorgente DTCG: densità comoda e compatta'],
            [<code key="3">tokens/color.config.json</code>, 'Sorgente: seed dei preset, mappatura ruoli → toni, coppie di contrasto'],
            [<code key="4">src/styles/generated/tokens.css</code>, 'Output: custom properties per preset, schema e densità (esportato come ./tokens.css)'],
            [<code key="5">src/tokens/generated.ts</code>, 'Output: costanti tipizzate (COLOR_ROLES, BASE_TOKENS, breakpoints, PRESET_COLORS…)'],
            [<code key="6">design/figma/tokens.dtcg.json</code>, 'Output: DTCG completo, esportato anche come ./tokens.json'],
            [<code key="7">design/figma/tokens-studio/</code>, 'Output: set e temi per il plugin Tokens Studio'],
          ]}
        />
        <p>
          Le palette tonali sono calcolate da un colore seed con <code>@material/material-color-utilities</code> (spazio HCT di Material Design 3). Il
          generatore interrompe la build se un preset non rispetta le coppie di contrasto dichiarate in <code>color.config.json</code>, in entrambi gli
          schemi.
        </p>
      </DocSection>

      <DocSection title="Categorie">
        <ul>
          <li><strong>Colore</strong>: text, surface, border, action, accent (terziario), feedback, focus, overlay.</li>
          <li><strong>Tipografia</strong>: famiglie, pesi e 13 ruoli (display → label-sm) con size, line-height, weight, letter-spacing.</li>
          <li><strong>Spaziatura</strong>: scala a passi di 4px (space.0 → space.24, più space.0-5 e space.1-5).</li>
          <li><strong>Raggi, bordi, ombre</strong>: radius.none → full, border.width.*, shadow.1 → 4.</li>
          <li><strong>Dimensioni</strong>: altezze dei controlli e padding (densità), larghezze dei contenitori.</li>
          <li><strong>Z-index</strong>: livelli nominati per sticky, overlay, toast.</li>
          <li><strong>Motion</strong>: durate e curve, azzerate con prefers-reduced-motion.</li>
          <li><strong>Stile e gradienti</strong>: gradient.accent, accent-sheen, accent-subtle, text e i valori look.* (fill-primary, fill-tonal, fill-size, shadow-primary, radius-control, radius-container) per gli stili standard ed expressive. Fonte: <code>tokens/look.config.json</code>.</li>
        </ul>
        <p>
          Valori e anteprime sono in <Link href="/guide/fondamenta">Fondamenta visive</Link>.
        </p>
      </DocSection>

      <DocSection title="Aggiungere o modificare un token">
        <ol>
          <li>Modifica il file sorgente in <code>packages/ui/tokens/</code>.</li>
          <li>Esegui <code>npm run tokens -w @devcommunityit/ui</code>.</li>
          <li>Verifica il controllo di contrasto e <code>npm run lint:tokens -w @devcommunityit/ui</code>.</li>
          <li>Aggiorna la documentazione se il token è nuovo; rinominare o rimuovere un token è una modifica incompatibile (major).</li>
        </ol>
      </DocSection>
    </>
  );
}
