# dev-community design system

Design system React/TypeScript per siti pubblici, portali e dashboard. Contiene:

- **`packages/ui`**: libreria `@dev-community/ui`, con token, temi, componenti, pattern e Storybook.
- **`apps/docs`**: sito di documentazione, Theme Builder e showcase con pagine realistiche.
- **`apps/playground`**: consumer separato che installa il pacchetto compilato (`npm pack`), non i sorgenti.
- **`e2e`**: test Playwright e axe sul sito compilato.
- **`design/figma`**: token DTCG, set per Tokens Studio e specifiche dei componenti. **Non è un file Figma.**
- **`scripts/verify-package.mjs`**: verifica il tarball in un consumer temporaneo.

> **Licenza: decisione necessaria.** Il progetto non dichiara una licenza. La scelta spetta al proprietario e va fatta
> prima di qualsiasi pubblicazione. Il pacchetto non è stato pubblicato e non è stato fatto nessun deploy.

## Requisiti

- Node.js 20.19 o successivo (vedi `engines`), npm 10 o successivo.
- Per i test e2e: `npx playwright install chromium`.

## Comandi

```bash
npm install
npm run dev              # documentazione, Theme Builder e showcase: http://localhost:5173
npm run storybook        # Storybook: http://localhost:6006
npm run tokens           # rigenera CSS/TS/DTCG/Tokens Studio dalla fonte unica dei token
npm run lint             # ESLint, Stylelint, riferimenti ai token
npm run typecheck
npm test                 # Vitest + Testing Library + axe (packages/ui)
npm run build            # libreria (packages/ui/dist) e sito (apps/docs/dist)
npm run build:storybook
npm run verify:package   # npm pack + installazione e prove in un consumer separato
npm run test:e2e         # Playwright sul sito compilato (dopo npm run build)
npm run verify           # tutto quanto sopra, in sequenza
```

Per il playground manuale, crea il pacchetto e installalo nel consumer:

```bash
npm run build:lib
npm pack -w @dev-community/ui --pack-destination apps/playground/vendor
cd apps/playground && npm install ./vendor/dev-community-ui-0.1.0.tgz && npm run dev
```

## Uso della libreria

```bash
npm install @dev-community/ui   # da registry pubblico o privato (.npmrc con @dev-community:registry=…)
```

```tsx
import '@dev-community/ui/styles.css'; // obbligatorio, una sola volta
// import '@dev-community/ui/reset.css'; // opzionale (opt-in)
import { ThemeProvider, LocaleProvider, Button } from '@dev-community/ui';

export function App() {
  return (
    <LocaleProvider locale="it-IT">
      <ThemeProvider defaultMode="system" defaultTheme="aurora" persistence>
        <Button variant="primary" onPress={() => console.log('ok')}>
          Salva
        </Button>
      </ThemeProvider>
    </LocaleProvider>
  );
}
```

Tema personalizzato:

```ts
import { createTheme } from '@dev-community/ui/theme'; // entry server-safe

export const acme = createTheme({
  name: 'acme',
  label: 'Acme Portal',
  extends: 'graphite',
  seeds: { brand: '#0f766e' },
  tokens: { 'radius.md': '0.5rem' },
});
// <ThemeProvider theme={acme} themes={[acme]}>…</ThemeProvider>
```

Dettagli sull'API del pacchetto: [packages/ui/README.md](packages/ui/README.md). Le guide su installazione, portali,
SSR/Next.js, CSP, temi, accessibilità, localizzazione/RTL e troubleshooting sono nel sito di documentazione.

## Catalogo e stato

Lo stato di ogni componente e pattern (Implementato, Documentato, Testato, Limiti) è nella matrice della pagina
`/componenti` del sito. È generata dai file `*.meta.ts` accanto ai componenti, quindi non può divergere da essi.

## Assunzioni architetturali

- Workspace npm, senza monorepo manager. Vite per libreria e sito, CSS Modules e custom properties con prefisso `dc`.
- Comportamenti complessi (focus, overlay, selezione, calendari) affidati a React Aria Components. Icone da `lucide-react`
  con import selettivi.
- La libreria non dipende dal sito, da un router o da un backend. Gli overlay in portal ereditano tema e direzione
  dal provider di origine.
- Nessun accesso a `window`, `document` o `localStorage` durante l'import. La strategia SSR anti-flash è compatibile con nonce CSP.
- Il sito di documentazione riusa gli esempi e i metadati dei componenti, condivisi con Storybook.

## Verifiche

`npm run verify` esegue lint, type-check, test unitari, build, verifica del pacchetto e test e2e. La guida
*Accessibilità* del sito elenca cosa coprono e le due esclusioni motivate di axe. Le verifiche manuali con screen
reader e i test su browser diversi da Chromium non sono stati eseguiti. I test automatici non bastano a dichiarare la
conformità WCAG.

## Figma

Non sono disponibili strumenti autorizzati per scrivere su Figma, quindi **nessun file Figma è stato creato**.
`design/figma/` contiene i token in formato DTCG, i set per Tokens Studio e le specifiche di componenti e varianti.
Il file [design/figma/README.md](design/figma/README.md) spiega mapping, importazione e cosa richiede costruzione manuale.

## Contribuire

Vedi [CONTRIBUTING.md](CONTRIBUTING.md) e il changelog in [packages/ui/CHANGELOG.md](packages/ui/CHANGELOG.md).
