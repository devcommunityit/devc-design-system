import { Alert } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

export default function Installazione() {
  return (
    <>
      <Alert tone="info" title="Distribuzione su GitHub Packages">
        Il pacchetto <code>@devcommunityit/ui</code> viene distribuito dal workflow Release su GitHub Packages e come tarball con checksum. È
        distribuito con licenza MIT (file <code>LICENSE</code> incluso nel pacchetto).
      </Alert>

      <DocSection title="Requisiti">
        <RefTable
          label="Requisiti"
          columns={['Requisito', 'Versione', 'Note']}
          rows={[
            ['react, react-dom', '^18.3 || ^19', 'Peer dependency: un’unica copia, quella dell’applicazione.'],
            ['Bundler', 'Qualsiasi con supporto ESM e import CSS', 'Verificato con Vite 8 (apps/playground) e con il sito di documentazione.'],
            ['TypeScript', '≥ 5.0 (consigliato)', 'Dichiarazioni .d.ts incluse; moduleResolution "bundler", "node16" o "nodenext" (verificato con arethetypeswrong).'],
            ['Browser', 'Evergreen', 'Usa :focus-visible, color-mix(), container query, proprietà logiche, dvh.'],
          ]}
        />
      </DocSection>

      <DocSection title="Canali di distribuzione">
        <RefTable
          label="Canali di distribuzione"
          columns={['Canale', 'Stato', 'Quando usarlo']}
          rows={[
            ['Tarball (npm run release:pack o asset della GitHub Release)', 'Pronto e verificato', 'Distribuzione interna senza registry, prove di integrazione, ambienti offline.'],
            ['GitHub Packages (workflow Release)', 'Pubblicazione automatizzata', 'Più portali che aggiornano la libreria con semver.'],
            ['Altri registry privati (Azure Artifacts, Verdaccio, Nexus)', 'Pubblicazione manuale', 'Quando i portali non possono usare GitHub Packages.'],
            ['npmjs.com pubblico', 'Consentito (licenza MIT), prima pubblicazione da eseguire', 'Dopo aver verificato la disponibilità dello scope @devcommunityit.'],
            ['Dipendenza git (github:org/repo)', 'Non supportato', 'Il pacchetto vive in un workspace (packages/ui) e richiede una build: npm non lo installa correttamente da git.'],
          ]}
        />
      </DocSection>

      <DocSection title="Da tarball (distribuzione interna)">
        <p>
          Lo script di rilascio compila la libreria, esegue <code>publint</code> e <code>arethetypeswrong</code>, crea il tarball in <code>releases/</code>{' '}
          (ignorata da git) con il relativo checksum SHA-256. Non pubblica nulla.
        </p>
        <Code language="bash">{`
# nel repository del design system
npm run release:pack
# → releases/devcommunityit-ui-0.1.0.tgz + .sha256

# nel progetto consumer (percorso relativo o assoluto)
npm install ../design-system/releases/devcommunityit-ui-0.1.0.tgz
`}</Code>
        <p>
          npm registra in <code>package.json</code> una dipendenza <code>file:</code>: copia il tarball in una cartella del consumer (per esempio{' '}
          <code>vendor/</code>) se la pipeline CI non ha accesso al repository del design system.
        </p>
      </DocSection>

      <DocSection title="Da registry privato">
        <p>
          Il workflow <code>.github/workflows/release.yml</code> pubblica <code>@devcommunityit/ui</code> e <code>@devcommunityit/ui-mcp</code> su GitHub
          Packages e crea una GitHub Release con il tarball e il checksum allegati. GitHub Packages accetta solo lo scope del proprietario del repository:
          i pacchetti usano quindi lo scope <code>@devcommunityit</code>, come il proprietario del repository. Nel progetto consumer
          crea un <code>.npmrc</code> e fornisci un token con permesso <code>read:packages</code> (in GitHub Actions basta{' '}
          <code>secrets.GITHUB_TOKEN</code> se il pacchetto concede l’accesso al repository del portale):
        </p>
        <Code language="ini" title=".npmrc — GitHub Packages">{`
@devcommunityit:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=\${NPM_TOKEN}
`}</Code>
        <Code language="ini" title=".npmrc — Azure Artifacts">{`
@devcommunityit:registry=https://pkgs.dev.azure.com/<org>/<project>/_packaging/<feed>/npm/registry/
always-auth=true
# autenticazione: npx vsts-npm-auth -config .npmrc (Windows) oppure token PAT in ~/.npmrc
`}</Code>
        <Code language="bash">{`npm install @devcommunityit/ui`}</Code>
        <p>Il token va fornito tramite variabile d’ambiente o secret della pipeline, mai committato.</p>
      </DocSection>

      <DocSection title="Rilasciare una nuova versione">
        <p>
          Entrambi i pacchetti hanno già <code>publishConfig.registry</code> impostato su GitHub Packages. Un rilascio parte in uno di due modi:
        </p>
        <RefTable
          label="Avvio di un rilascio"
          columns={['Modo', 'Cosa fa']}
          rows={[
            ['Actions → Release → Run workflow', 'Scegli pacchetto (ui o mcp) e incremento (patch, minor, major o pre*). Il workflow aggiorna package.json, package-lock.json e il CHANGELOG (la sezione «Non rilasciato» diventa la nuova versione), esegue tutti i controlli, poi crea commit e tag e li invia.'],
            [<code key="t">git tag ui-v0.2.0 && git push origin ui-v0.2.0</code>, 'Per una versione già aggiornata a mano in package.json. Il tag deve coincidere con la versione (ui-v… oppure mcp-v…).'],
          ]}
        />
        <p>
          Il workflow esegue lint, typecheck, test, build e, per la libreria, <code>verify:package</code>; poi pubblica esattamente il tarball allegato alla
          release. Le versioni di anteprima (<code>0.3.0-beta.0</code>) usano il dist-tag dell’identificativo (<code>beta</code>, <code>next</code>) e non
          diventano <code>latest</code>: installale con <code>npm install @devcommunityit/ui@next</code>. Ogni esecuzione del workflow CI su una pull request
          carica inoltre i tarball come artifact, per provare una modifica in un portale prima del rilascio.
        </p>
        <Code language="bash">{`
# rilascio manuale da terminale (alternativa al workflow)
npm version patch -w @devcommunityit/ui   # oppure minor / major
npm publish -w @devcommunityit/ui --dry-run   # controlla contenuto e registry
npm publish -w @devcommunityit/ui
`}</Code>
        <p>
          <code>prepublishOnly</code> esegue controllo licenza/registry, build e <code>lint:package</code>: un pacchetto con tipi o export non risolvibili
          non viene pubblicato. Se il branch <code>main</code> è protetto, consenti a GitHub Actions di eseguire il push del commit di rilascio oppure usa il
          rilascio tramite tag.
        </p>
      </DocSection>

      <DocSection title="Da registry pubblico">
        <p>
          Il campo <code>license</code> vale <code>"MIT"</code> e il file <code>LICENSE</code> è incluso nel tarball. Lo script{' '}
          <code>packages/ui/scripts/prepublish-check.mjs</code> blocca <code>npm publish</code> verso <code>registry.npmjs.org</code> solo se la licenza
          manca o vale <code>UNLICENSED</code>. Dopo la pubblicazione l’installazione resta{' '}
          <code>npm install @devcommunityit/ui</code>.
        </p>
      </DocSection>

      <DocSection title="Controlli di qualità del pacchetto">
        <RefTable
          label="Controlli del pacchetto"
          columns={['Comando', 'Cosa verifica']}
          rows={[
            [<code key="a">npm run lint:package</code>, 'publint (campi package.json, exports, file inclusi) e arethetypeswrong: tipi risolvibili con moduleResolution bundler e node16/nodenext (ESM).'],
            [<code key="b">npm run verify:package</code>, 'npm pack + installazione in un consumer separato fuori dal repository: export, tipi, CSS, rendering, interazioni, React non duplicato.'],
            [<code key="s">npm run size</code>, 'size-limit: dimensione minificata e gzip di scenari tipici (ThemeProvider + Button, dashboard, entry completa, editor, CSS) confrontata con i budget in .size-limit.json; fallisce in CI se un budget viene superato.'],
            [<code key="c">npm run release:pack</code>, 'Build + lint:package + tarball con checksum in releases/ (--package mcp per il server MCP).'],
          ]}
        />
      </DocSection>

      <DocSection title="Versionamento e aggiornamenti">
        <p>
          Il pacchetto segue semver. Finché la versione è <code>0.x</code> una release <em>minor</em> può contenere modifiche incompatibili, sempre descritte
          nel changelog con le istruzioni di migrazione. Nei portali conviene fissare un intervallo stretto (<code>"~0.1.0"</code>) fino alla 1.0, poi{' '}
          <code>"^1.0.0"</code>. Sono considerate incompatibili: rimozione o rinomina di export, props, token CSS (<code>--dc-*</code>), classi pubbliche e
          cambi dello schema dei temi senza migrazione.
        </p>
      </DocSection>

      <DocSection title="Formato dei moduli">
        <p>
          Il pacchetto è <strong>solo ESM</strong> (<code>"type": "module"</code>, nessuna build CommonJS). È verificato con Vite (consumer separato) e
                    con Next.js solo a livello di documentazione; webpack 5, Rspack ed esbuild supportano ESM e import CSS ma non sono stati provati. Con Node ≥ 20.19 anche <code>require()</code> di ESM è supportato, ma i componenti sono pensati per il bundler. Jest in modalità CommonJS
          richiede un transform per <code>node_modules/@devcommunityit</code> e la gestione degli import CSS: questa configurazione non è verificata, per i test
          dei consumer si consiglia Vitest.
        </p>
      </DocSection>

      <DocSection title="Entry point esportati">
        <RefTable
          label="Entry point"
          columns={['Import', 'Contenuto']}
          rows={[
            [<code key="a">@devcommunityit/ui</code>, 'Componenti, pattern, ThemeProvider, LocaleProvider, hook e utilità (ESM, tree-shakable).'],
            [<code key="b">@devcommunityit/ui/styles.css</code>, 'Token + stili dei componenti. Obbligatorio, da importare una volta.'],
            [<code key="c">@devcommunityit/ui/reset.css</code>, 'Reset minimo opzionale nel layer dc-reset.'],
            [<code key="d">@devcommunityit/ui/tokens.css</code>, 'Solo le custom properties dei token (già incluse in styles.css).'],
            [<code key="e">@devcommunityit/ui/tokens.json</code>, 'Token in formato DTCG per strumenti di design.'],
            [<code key="f">@devcommunityit/ui/theme</code>, 'API dei temi senza React né DOM: createTheme, themeToCss, getThemeScript, cookie helper. Per server e build.'],
          ]}
        />
      </DocSection>

      <DocSection title="Side effect e tree-shaking">
        <p>
          Il pacchetto dichiara <code>"sideEffects": ["**/*.css"]</code>: i moduli JavaScript sono privi di effetti collaterali e vengono eliminati se non
          usati; i file CSS importati non vengono scartati. Gli stili dei componenti sono raccolti in <code>styles.css</code>, quindi non dipendono da
          quali componenti importi.
        </p>
      </DocSection>

      <DocSection title="Dipendenze incluse">
        <p>
          Il pacchetto dipende da <code>react-aria-components</code>/<code>react-aria</code> (interazioni e accessibilità),{' '}
          <code>@internationalized/date</code> (date senza fuso), <code>@material/material-color-utilities</code> (generazione palette HCT) e{' '}
          <code>lucide-react</code> (icone, import selettivi). Nessun font o asset remoto.
        </p>
      </DocSection>
    </>
  );
}
