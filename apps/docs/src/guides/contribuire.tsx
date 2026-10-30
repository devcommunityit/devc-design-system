import { Code, DocSection, RefTable } from '../components/Doc';

export default function Contribuire() {
  return (
    <>
      <DocSection title="Struttura del repository">
        <RefTable
          label="Cartelle"
          columns={['Percorso', 'Contenuto']}
          rows={[
            [<code key="1">packages/ui/tokens</code>, 'Sorgente unica dei token (DTCG + configurazione colori)'],
            [<code key="2">packages/ui/src/components</code>, 'Primitive e componenti compositi: Componente.tsx, .module.css, .meta.ts, .examples.tsx, .stories.tsx, .test.tsx'],
            [<code key="3">packages/ui/src/patterns</code>, 'Pattern riutilizzabili (UserMenu, SiteHeader, Footer, moduli di accesso)'],
            [<code key="4">packages/ui/src/theme</code>, 'createTheme, ThemeProvider, persistenza, esportazioni'],
            [<code key="5">packages/ui/src/i18n</code>, 'LocaleProvider e bundle dei messaggi'],
            [<code key="6">apps/docs</code>, 'Sito di documentazione, Theme Builder e showcase (template dimostrativi)'],
            [<code key="7">apps/playground</code>, 'Consumer separato che installa il pacchetto compilato'],
            [<code key="8">design/figma</code>, 'Token DTCG e specifiche per Figma (generati e manuali)'],
            [<code key="9">e2e</code>, 'Test Playwright sul sito compilato'],
          ]}
        />
        <p>
          Gli esempi (<code>*.examples.tsx</code>) e i metadati (<code>*.meta.ts</code>) sono la fonte unica per le pagine del sito e per le storie di
          Storybook: non duplicare esempi nelle storie.
        </p>
      </DocSection>

      <DocSection title="Comandi">
        <Code language="bash">{`
npm install
npm run dev            # sito di documentazione (http://localhost:5173)
npm run storybook      # Storybook (http://localhost:6006)
npm run tokens         # rigenera gli output dei token
npm run lint           # ESLint, Stylelint, riferimenti ai token
npm run typecheck
npm test               # Vitest + Testing Library + axe
npm run build          # libreria e sito
npm run verify:package # npm pack + installazione in un consumer separato (copia di apps/playground)
npm run test:e2e       # Playwright (sul sito compilato: esegui prima npm run build)
npm run verify         # tutto quanto sopra
`}</Code>
        <p>
          La prima volta installa il browser dei test con <code>npx playwright install chromium</code>. I test e2e avviano da soli{' '}
          <code>vite preview</code> sulla porta 4173 e falliscono in presenza di errori o avvisi in console. <code>verify:package</code> crea il
          pacchetto con <code>npm pack</code>, lo installa in un consumer temporaneo fuori dal repository e ne verifica tipi, build e comportamento
          in Chromium.
        </p>
      </DocSection>

      <DocSection title="Convenzioni dei test">
        <ul>
          <li>
            React Aria ripristina il focus nel frame successivo alla chiusura di un overlay: verificalo con <code>waitFor</code> (unit) o{' '}
            <code>expect.poll</code> (browser), non subito dopo la chiusura.
          </li>
          <li>Il focus da tastiera si ottiene con Tab: <code>element.focus()</code> non attiva gli stati focus-visible né i tooltip.</li>
          <li>Non aggiungere esclusioni ad axe senza motivarle in <code>e2e/fixtures.ts</code> e nella guida Accessibilità.</li>
        </ul>
      </DocSection>

      <DocSection title="Checklist per un nuovo componente">
        <ul>
          <li>Esiste già un componente o una composizione che risolve il caso? Evita varianti duplicate.</li>
          <li>HTML nativo o React Aria per il comportamento; nessun elemento genericamente cliccabile.</li>
          <li>
            Props coerenti (<code>variant</code>, <code>size</code>, <code>tone</code>, <code>isDisabled</code>, <code>isInvalid</code>,{' '}
            <code>value</code>/<code>defaultValue</code>/<code>onChange</code>), ref inoltrato, <code>className</code> e attributi nativi preservati.
          </li>
          <li>Solo token semantici nel CSS Module; proprietà logiche; stati hover, focus-visible, pressed, disabled; forced-colors e reduced-motion.</li>
          <li>Testi di sistema dai messaggi (<code>useMessages</code>), mai stringhe fisse.</li>
          <li>Test: rendering, tastiera, controlled/uncontrolled, axe; esempi e meta con stato reale nella matrice del catalogo.</li>
          <li>Nessun <code>any</code> né cast per nascondere errori di tipo.</li>
        </ul>
      </DocSection>

      <DocSection title="Versionamento delle modifiche">
        <p>
          Aggiungi una voce al <code>CHANGELOG.md</code> indicando se la modifica è patch, minor o major secondo la politica descritta in Changelog e
          migrazioni.
        </p>
      </DocSection>
    </>
  );
}
