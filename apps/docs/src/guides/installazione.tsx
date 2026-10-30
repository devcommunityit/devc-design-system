import { Alert } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

export default function Installazione() {
  return (
    <>
      <Alert tone="warning" title="Pacchetto non pubblicato">
        Il pacchetto <code>@dev-community/ui</code> non è stato pubblicato su alcun registry e il repository non contiene ancora una licenza. Prima della
        pubblicazione serve una decisione esplicita su licenza, registry e nome dello scope.
      </Alert>

      <DocSection title="Requisiti">
        <RefTable
          label="Requisiti"
          columns={['Requisito', 'Versione', 'Note']}
          rows={[
            ['react, react-dom', '^18.3 || ^19', 'Peer dependency: un’unica copia, quella dell’applicazione.'],
            ['Bundler', 'Qualsiasi con supporto ESM e import CSS', 'Verificato con Vite 8 (apps/playground) e con il sito di documentazione.'],
            ['TypeScript', '≥ 5.0 (consigliato)', 'Dichiarazioni .d.ts incluse; moduleResolution "bundler" o "node16".'],
            ['Browser', 'Evergreen', 'Usa :focus-visible, color-mix(), container query, proprietà logiche, dvh.'],
          ]}
        />
      </DocSection>

      <DocSection title="Da tarball locale (verifica o distribuzione interna)">
        <Code language="bash">{`
# nel repository del design system
npm run build -w @dev-community/ui
npm pack -w @dev-community/ui            # crea dev-community-ui-0.1.0.tgz

# nel progetto consumer
npm install ../design-system/dev-community-ui-0.1.0.tgz
`}</Code>
      </DocSection>

      <DocSection title="Da registry privato">
        <p>Configura lo scope verso il registry dell’organizzazione (GitHub Packages, Azure Artifacts, Verdaccio, Nexus…) in un <code>.npmrc</code> di progetto:</p>
        <Code language="ini" title=".npmrc">{`
@dev-community:registry=https://npm.example.internal/
//npm.example.internal/:_authToken=\${NPM_TOKEN}
`}</Code>
        <Code language="bash">{`npm install @dev-community/ui`}</Code>
        <p>Il token va fornito tramite variabile d’ambiente o secret della pipeline, mai committato.</p>
      </DocSection>

      <DocSection title="Da registry pubblico">
        <p>
          Dopo un’eventuale pubblicazione su npmjs.com l’installazione è la stessa (<code>npm install @dev-community/ui</code>). La pubblicazione richiede
          licenza, verifica del nome dello scope e una pipeline di rilascio: nessuna di queste è stata configurata.
        </p>
      </DocSection>

      <DocSection title="Entry point esportati">
        <RefTable
          label="Entry point"
          columns={['Import', 'Contenuto']}
          rows={[
            [<code key="a">@dev-community/ui</code>, 'Componenti, pattern, ThemeProvider, LocaleProvider, hook e utilità (ESM, tree-shakable).'],
            [<code key="b">@dev-community/ui/styles.css</code>, 'Token + stili dei componenti. Obbligatorio, da importare una volta.'],
            [<code key="c">@dev-community/ui/reset.css</code>, 'Reset minimo opzionale nel layer dc-reset.'],
            [<code key="d">@dev-community/ui/tokens.css</code>, 'Solo le custom properties dei token (già incluse in styles.css).'],
            [<code key="e">@dev-community/ui/tokens.json</code>, 'Token in formato DTCG per strumenti di design.'],
            [<code key="f">@dev-community/ui/theme</code>, 'API dei temi senza React né DOM: createTheme, themeToCss, getThemeScript, cookie helper. Per server e build.'],
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
