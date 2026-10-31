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
npm run size           # budget gzip del bundle con size-limit (richiede la build)
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

      <DocSection title="Pubblicare la documentazione su GitHub Pages">
        <p>
          Il workflow <code>.github/workflows/pages.yml</code> compila il sito con il base path fornito da <code>actions/configure-pages</code>,
          esegue i test e2e sul risultato e lo pubblica, insieme a Storybook in <code>/storybook/</code>. Il workflow parte a ogni push su{' '}
          <code>main</code> o manualmente. Per attivarlo, scegli <strong>Settings → Pages → Source: GitHub Actions</strong>.
        </p>
        <Code language="bash">{`
npm run build:pages -- --base /design-system/
npm run preview:pages -- --base /design-system/   # http://localhost:4174/design-system/
npm run test:e2e:pages                            # base predefinita: /design-system/
`}</Code>
        <p>
          <code>build:pages</code> genera un <code>index.html</code> per ogni rotta nota, così i link diretti funzionano senza riscritture lato
          server. Le pagine di guide, componenti e showcase vengono ricavate dai rispettivi elenchi. Le rotte di primo livello, invece, sono
          elencate in <code>scripts/build-pages.mjs</code>: se aggiungi una rotta di primo livello, aggiungila anche lì. Una rotta mancante viene
          comunque mostrata tramite <code>404.html</code>, ma con stato HTTP 404.
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

      <DocSection title="Traduzioni della documentazione">
        <p>
          Il portale è disponibile in italiano (lingua di riferimento) e in inglese. I testi dell&apos;interfaccia sono in{' '}
          <code>apps/docs/src/i18n/messages.ts</code>; guide e fondamenta hanno una versione inglese in <code>guides/en</code> e{' '}
          <code>foundations/en</code>; i metadati dei componenti sono tradotti negli overlay JSON di <code>i18n/en/components</code>.
        </p>
        <ul>
          <li>
            Dopo aver aggiunto o modificato un <code>*.meta.ts</code>, esegui <code>npm run i18n:extract -w @dev-community/docs</code> e traduci i
            campi nuovi.
          </li>
          <li>
            <code>npm run i18n:check -w @dev-community/docs</code> segnala overlay mancanti o non aggiornati. Finché manca la traduzione la pagina
            mostra il testo italiano con un avviso.
          </li>
          <li>Gli esempi dal vivo e i template mantengono i contenuti dimostrativi in italiano.</li>
        </ul>
      </DocSection>

      <DocSection title="Licenza">
        <p>
          Il progetto è distribuito con licenza <strong>MIT</strong> (© 2026 Dev Community): il file <code>LICENSE</code> è nella radice del
          repository ed è incluso nei pacchetti <code>@dev-community/ui</code> e <code>@dev-community/ui-mcp</code>. Contribuendo accetti che il
          tuo codice sia rilasciato con la stessa licenza. Non aggiungere dipendenze con licenze incompatibili (ad esempio GPL) senza discuterne
          prima.
        </p>
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
